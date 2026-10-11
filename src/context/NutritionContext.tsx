import React, { createContext, useContext, useState, useMemo } from 'react';
import { FoodItem, INITIAL_TODAY_LOGS, LoggedFoodItem, PLACEHOLDER_FOODS } from '../data/placeholderFoods';
import { RecipeResult } from '../utils/yieldEngine';

export interface SavedRecipeItem {
  name: string;
  cookedWeightGrams: number;
  result: RecipeResult;
}

export interface UserTargets {
  currentWeightKg: number;
  targetWeightKg: number;
  proteinPerKg: number; // e.g. 2.0
  trainingDay: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  restDay: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface NutritionContextType {
  logs: LoggedFoodItem[];
  foods: FoodItem[];
  targets: UserTargets;
  activeDayType: 'training' | 'rest';
  setActiveDayType: (type: 'training' | 'rest') => void;
  addLog: (log: Omit<LoggedFoodItem, 'id'>) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
  copyYesterday: () => void;
  savedRecipes: SavedRecipeItem[];
  saveRecipe: (name: string, cookedWeightGrams: number, result: RecipeResult) => void;
  activeTarget: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  totals: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    remainingKcal: number;
    proteinPercent: number;
  };
  streakDays: number;
}

const DEFAULT_TARGETS: UserTargets = {
  currentWeightKg: 74,
  targetWeightKg: 71.5,
  proteinPerKg: 2.0,
  trainingDay: {
    kcal: 2150,
    protein: 148,
    carbs: 235,
    fat: 55,
    fiber: 35,
  },
  restDay: {
    kcal: 1850,
    protein: 148,
    carbs: 165,
    fat: 55,
    fiber: 35,
  },
};

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LoggedFoodItem[]>(INITIAL_TODAY_LOGS);
  const [foods, setFoods] = useState<FoodItem[]>(PLACEHOLDER_FOODS);
  const [targets, setTargets] = useState<UserTargets>(DEFAULT_TARGETS);
  const [activeDayType, setActiveDayType] = useState<'training' | 'rest'>('training');
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
  const streakDays = 14;

  const activeTarget = activeDayType === 'training' ? targets.trainingDay : targets.restDay;

  const totals = useMemo(() => {
    let kcal = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    for (const item of logs) {
      kcal += item.kcal;
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
      fiber += item.fiber;
    }

    const round1 = (v: number) => Math.round(v * 10) / 10;
    const remainingKcal = Math.max(0, activeTarget.kcal - Math.round(kcal));
    const proteinPercent = Math.min(100, Math.round((protein / activeTarget.protein) * 100));

    return {
      kcal: Math.round(kcal),
      protein: round1(protein),
      carbs: round1(carbs),
      fat: round1(fat),
      fiber: round1(fiber),
      remainingKcal,
      proteinPercent,
    };
  }, [logs, activeTarget]);

  const addLog = (newLog: Omit<LoggedFoodItem, 'id'>) => {
    const item: LoggedFoodItem = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setLogs((prev) => [item, ...prev]);
  };

  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const copyYesterday = () => {
    // Duplicates typical logs to simulate fast copy yesterday
    setLogs(INITIAL_TODAY_LOGS);
  };

  const saveRecipe = (name: string, cookedWeightGrams: number, result: RecipeResult) => {
    setSavedRecipes((prev) => [{ name, cookedWeightGrams, result }, ...prev]);
    // Also add to foods list so user can search and log it!
    const gramsPerServing = result.gramsPerServing ?? Math.round(cookedWeightGrams / 2);
    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: `${name} (Yield Cooked)`,
      category: 'Dal & Curries',
      regionalNames: {},
      source: 'own_measurement',
      isCookedRecipe: true,
      densityKcalPerGram: Math.round(result.perGramCooked.kcal * 100) / 100,
      per100g: {
        kcal: Math.round(result.per100gCooked.kcal),
        protein: Math.round(result.per100gCooked.protein * 10) / 10,
        carbs: Math.round(result.per100gCooked.carbs * 10) / 10,
        fat: Math.round(result.per100gCooked.fat * 10) / 10,
        fiber: Math.round(result.per100gCooked.fibre * 10) / 10,
      },
      defaultPortionIndex: 0,
      portions: [
        { name: 'serving', label: `1 Serving (${Math.round(gramsPerServing)}g)`, grams: Math.round(gramsPerServing) },
        { name: 'katori', label: '1 Katori (150g)', grams: 150 },
        { name: 'custom', label: '100g Cooked', grams: 100 },
      ],
      verifiedNote: `Calculated with MAXIII Yield Engine (${cookedWeightGrams}g finished weight)`,
    };
    setFoods((prev) => [newFood, ...prev]);
  };

  return (
    <NutritionContext.Provider
      value={{
        logs,
        foods,
        targets,
        activeDayType,
        setActiveDayType,
        addLog,
        removeLog,
        clearLogs,
        copyYesterday,
        savedRecipes,
        saveRecipe,
        activeTarget,
        totals,
        streakDays,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
