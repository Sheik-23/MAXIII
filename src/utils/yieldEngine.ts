/**
 * MAXIII yield engine
 * Turns raw ingredients + oil + total cooked weight into nutrition per gram,
 * per 100 g and per serving of the cooked dish.
 *
 * All nutrition values are per 100 g of the RAW ingredient (grams, kcal).
 * Source values (USDA / IFCT / own measurement) must be verified before shipping.
 */

export interface Nutrients {
  kcal: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fibre: number; // g
}

export interface Ingredient {
  name: string;
  rawGrams: number; // weight of the raw ingredient used
  per100g: Nutrients; // nutrition per 100 g of the raw ingredient
}

export interface RecipeInput {
  ingredients: Ingredient[];
  oilAddedGrams?: number; // oil/ghee put in the pan (tadka, frying)
  oilLeftInPanGrams?: number; // oil that stayed behind and was NOT eaten
  oilPer100g?: Nutrients; // defaults to a generic vegetable oil
  cookedWeightGrams: number; // weight of the finished food only (pot weight minus empty pot)
  servings?: number; // optional: how many equal servings the pot makes
}

export interface RecipeResult {
  totals: Nutrients; // whole pot
  per100gCooked: Nutrients;
  perGramCooked: Nutrients;
  perServing?: Nutrients;
  gramsPerServing?: number;
}

/** Generic vegetable oil, approx. USDA value. Verify before relying on it. */
export const DEFAULT_OIL_PER_100G: Nutrients = {
  kcal: 884,
  protein: 0,
  carbs: 0,
  fat: 100,
  fibre: 0,
};

const KEYS: (keyof Nutrients)[] = ["kcal", "protein", "carbs", "fat", "fibre"];

const zero = (): Nutrients => ({ kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 });

const scale = (n: Nutrients, factor: number): Nutrients => {
  const out = zero();
  for (const k of KEYS) out[k] = n[k] * factor;
  return out;
};

const add = (a: Nutrients, b: Nutrients): Nutrients => {
  const out = zero();
  for (const k of KEYS) out[k] = a[k] + b[k];
  return out;
};

/** Round every value to `digits` decimals (for display only, never for storage). */
export const roundNutrients = (n: Nutrients, digits = 1): Nutrients => {
  const f = 10 ** digits;
  const out = zero();
  for (const k of KEYS) out[k] = Math.round(n[k] * f) / f;
  return out;
};

const assertNonNegative = (value: number, label: string): void => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a number that is 0 or more`);
  }
};

export function calculateRecipe(input: RecipeInput): RecipeResult {
  const {
    ingredients,
    oilAddedGrams = 0,
    oilLeftInPanGrams = 0,
    oilPer100g = DEFAULT_OIL_PER_100G,
    cookedWeightGrams,
    servings,
  } = input;

  if (ingredients.length === 0) throw new Error("Add at least one ingredient");
  assertNonNegative(oilAddedGrams, "oilAddedGrams");
  assertNonNegative(oilLeftInPanGrams, "oilLeftInPanGrams");
  if (oilLeftInPanGrams > oilAddedGrams) {
    throw new Error("oilLeftInPanGrams cannot be more than oilAddedGrams");
  }
  if (!Number.isFinite(cookedWeightGrams) || cookedWeightGrams <= 0) {
    throw new Error("cookedWeightGrams must be greater than 0");
  }
  if (servings !== undefined && (!Number.isFinite(servings) || servings <= 0)) {
    throw new Error("servings must be greater than 0");
  }

  // 1. Add up the raw ingredients
  let totals = zero();
  for (const ing of ingredients) {
    assertNonNegative(ing.rawGrams, `rawGrams of ${ing.name}`);
    totals = add(totals, scale(ing.per100g, ing.rawGrams / 100));
  }

  // 2. Add only the oil that actually went into the food
  const oilEatenGrams = oilAddedGrams - oilLeftInPanGrams;
  totals = add(totals, scale(oilPer100g, oilEatenGrams / 100));

  // 3. Spread the total over the cooked weight (this is the yield step)
  const perGramCooked = scale(totals, 1 / cookedWeightGrams);
  const per100gCooked = scale(perGramCooked, 100);

  const result: RecipeResult = { totals, per100gCooked, perGramCooked };

  if (servings !== undefined) {
    result.perServing = scale(totals, 1 / servings);
    result.gramsPerServing = cookedWeightGrams / servings;
  }
  return result;
}

/** Nutrition for any portion the user eats, e.g. 150 g from the pot. */
export function nutritionForPortion(result: RecipeResult, grams: number): Nutrients {
  assertNonNegative(grams, "grams");
  return scale(result.perGramCooked, grams);
}

/**
 * Data-quality check: kcal should roughly equal 4*protein + 4*carbs + 9*fat.
 * Fibre is included in carbs in many tables, so allow a tolerance.
 * Returns the difference as a fraction (0.05 = 5% off).
 */
export function atwaterDifference(n: Nutrients): number {
  const estimate = 4 * n.protein + 4 * n.carbs + 9 * n.fat;
  if (n.kcal === 0) return estimate === 0 ? 0 : 1;
  return Math.abs(estimate - n.kcal) / n.kcal;
}
