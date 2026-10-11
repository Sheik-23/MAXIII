import {
  calculateRecipe,
  nutritionForPortion,
  atwaterDifference,
  roundNutrients,
  Ingredient,
  Nutrients,
} from "./yieldEngine";

// Example values only. Replace with your verified data.
const toorDal: Ingredient = {
  name: "toor dal (raw)",
  rawGrams: 100,
  per100g: { kcal: 335, protein: 22, carbs: 62, fat: 1.5, fibre: 15 },
};

// Oil at exactly 9 kcal/g so the hand-calculated example is 335 + 90 = 425
const OIL_9_KCAL: Nutrients = { kcal: 900, protein: 0, carbs: 0, fat: 100, fibre: 0 };

describe("calculateRecipe", () => {
  test("dal pot: 100 g dal + 10 g oil = 425 kcal total", () => {
    const r = calculateRecipe({
      ingredients: [toorDal],
      oilAddedGrams: 10,
      oilPer100g: OIL_9_KCAL,
      cookedWeightGrams: 400,
    });
    expect(r.totals.kcal).toBeCloseTo(425, 5);
  });

  test("per 100 g of cooked dal = total / cooked weight * 100", () => {
    const r = calculateRecipe({
      ingredients: [toorDal],
      oilAddedGrams: 10,
      oilPer100g: OIL_9_KCAL,
      cookedWeightGrams: 400,
    });
    expect(r.per100gCooked.kcal).toBeCloseTo(106.25, 5);
    expect(nutritionForPortion(r, 150).kcal).toBeCloseTo(159.375, 5);
  });

  test("guessing servings causes the 34% error (4 vs 3 servings)", () => {
    const base = {
      ingredients: [toorDal],
      oilAddedGrams: 10,
      oilPer100g: OIL_9_KCAL,
      cookedWeightGrams: 400,
    };
    const four = calculateRecipe({ ...base, servings: 4 }).perServing!.kcal;
    const three = calculateRecipe({ ...base, servings: 3 }).perServing!.kcal;
    expect(four).toBeCloseTo(106.25, 5);
    expect(three).toBeCloseTo(141.667, 2);
    expect((three - four) / four).toBeCloseTo(0.333, 2);
  });

  test("oil left in the pan is not counted", () => {
    const r = calculateRecipe({
      ingredients: [toorDal],
      oilAddedGrams: 10,
      oilLeftInPanGrams: 4,
      oilPer100g: OIL_9_KCAL,
      cookedWeightGrams: 400,
    });
    expect(r.totals.kcal).toBeCloseTo(335 + 54, 5);
  });

  test("default oil uses 884 kcal per 100 g", () => {
    const r = calculateRecipe({
      ingredients: [toorDal],
      oilAddedGrams: 10,
      cookedWeightGrams: 400,
    });
    expect(r.totals.kcal).toBeCloseTo(335 + 88.4, 5);
  });

  test("gramsPerServing is cooked weight / servings", () => {
    const r = calculateRecipe({
      ingredients: [toorDal],
      cookedWeightGrams: 600,
      servings: 4,
    });
    expect(r.gramsPerServing).toBe(150);
  });

  test("rejects bad input", () => {
    expect(() => calculateRecipe({ ingredients: [], cookedWeightGrams: 100 })).toThrow();
    expect(() => calculateRecipe({ ingredients: [toorDal], cookedWeightGrams: 0 })).toThrow();
    expect(() =>
      calculateRecipe({ ingredients: [toorDal], oilAddedGrams: 5, oilLeftInPanGrams: 8, cookedWeightGrams: 100 })
    ).toThrow();
    expect(() => calculateRecipe({ ingredients: [toorDal], cookedWeightGrams: 100, servings: 0 })).toThrow();
  });
});

describe("helpers", () => {
  test("atwaterDifference is small for consistent data", () => {
    // 22*4 + 62*4 + 1.5*9 = 349.5 vs 335 kcal => about 4.3% off
    expect(atwaterDifference(toorDal.per100g)).toBeLessThan(0.1);
  });

  test("atwaterDifference flags bad data", () => {
    expect(atwaterDifference({ kcal: 100, protein: 22, carbs: 62, fat: 1.5, fibre: 15 })).toBeGreaterThan(0.5);
  });

  test("roundNutrients rounds for display", () => {
    expect(roundNutrients({ kcal: 106.256, protein: 1.04, carbs: 2, fat: 3, fibre: 4 }).kcal).toBe(106.3);
  });
});
