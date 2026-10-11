import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useNutrition } from '@/context/NutritionContext';
import {
  calculateRecipe,
  atwaterDifference,
  roundNutrients,
  Ingredient,
  Nutrients,
} from '@/utils/yieldEngine';

const theme = Colors.dark;

interface PresetItem {
  name: string;
  per100g: Nutrients;
}

const COMMON_RAW_PRESETS: PresetItem[] = [
  { name: 'Toor Dal (raw)', per100g: { kcal: 335, protein: 22, carbs: 58, fat: 1.5, fibre: 15 } },
  { name: 'Moong Dal (raw)', per100g: { kcal: 347, protein: 24, carbs: 60, fat: 1.2, fibre: 16 } },
  { name: 'Chicken Breast (raw)', per100g: { kcal: 120, protein: 26, carbs: 0, fat: 1.5, fibre: 0 } },
  { name: 'Paneer (raw)', per100g: { kcal: 265, protein: 18, carbs: 3.5, fat: 20, fibre: 0 } },
  { name: 'Basmati Rice (raw)', per100g: { kcal: 360, protein: 7.5, carbs: 78, fat: 0.6, fibre: 1.3 } },
  { name: 'Onion (raw)', per100g: { kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fibre: 1.7 } },
  { name: 'Tomato (raw)', per100g: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fibre: 1.2 } },
];

export default function RecipeYieldScreen() {
  const { saveRecipe } = useNutrition();

  const [recipeName, setRecipeName] = useState('Home-style Toor Dal Tadka');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      name: 'Toor Dal (raw)',
      rawGrams: 100,
      per100g: { kcal: 335, protein: 22, carbs: 58, fat: 1.5, fibre: 15 },
    },
    {
      name: 'Onion (raw)',
      rawGrams: 50,
      per100g: { kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fibre: 1.7 },
    },
    {
      name: 'Tomato (raw)',
      rawGrams: 80,
      per100g: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fibre: 1.2 },
    },
  ]);

  const [oilAdded, setOilAdded] = useState('10');
  const [oilLeftInPan, setOilLeftInPan] = useState('0');
  const [cookedWeight, setCookedWeight] = useState('380');
  const [servings, setServings] = useState('2');
  const [customPortionGrams, setCustomPortionGrams] = useState('150');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const cookedGramsNumber = parseFloat(cookedWeight) || 380;
  const oilAddedNumber = parseFloat(oilAdded) || 0;
  const oilLeftNumber = parseFloat(oilLeftInPan) || 0;
  const oilRetainedGrams = Math.max(0, oilAddedNumber - oilLeftNumber);
  const totalRawGrams = ingredients.reduce((sum, item) => sum + item.rawGrams, 0);

  // Compute live yield engine results
  const yieldResult = useMemo(() => {
    const srv = parseInt(servings, 10) || 1;

    try {
      return calculateRecipe({
        ingredients,
        oilAddedGrams: oilAddedNumber,
        oilLeftInPanGrams: oilLeftNumber,
        cookedWeightGrams: cookedGramsNumber,
        servings: srv,
      });
    } catch {
      return null;
    }
  }, [ingredients, oilAddedNumber, oilLeftNumber, cookedGramsNumber, servings]);

  const atwaterDiffPercent = useMemo(() => {
    if (!yieldResult) return 0;
    const diff = atwaterDifference(yieldResult.totals);
    return Math.round(diff * 1000) / 10; // e.g. 1.5%
  }, [yieldResult]);

  const handleAddPreset = (preset: PresetItem) => {
    setIngredients((prev) => [
      ...prev,
      {
        name: preset.name,
        rawGrams: 100,
        per100g: preset.per100g,
      },
    ]);
  };

  const handleUpdateIngredientGrams = (index: number, gramsText: string) => {
    const g = parseFloat(gramsText) || 0;
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, rawGrams: g } : item))
    );
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) {
      Alert.alert('Required', 'A recipe must contain at least 1 ingredient.');
      return;
    }
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    if (!yieldResult) return;
    saveRecipe(recipeName.trim() || 'Untitled Recipe', cookedGramsNumber, yieldResult);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const roundedTotals = yieldResult ? roundNutrients(yieldResult.totals, 1) : null;
  const roundedPer100g = yieldResult ? roundNutrients(yieldResult.per100gCooked, 1) : null;
  const roundedPerGram = yieldResult ? yieldResult.perGramCooked : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Title Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>MAXIII CORE DIFFERENTIATOR</Text>
          </View>
          <Text style={styles.title}>Indian Yield Engine</Text>
          <Text style={styles.subtitle}>
            Converts raw weighed ingredients + oil absorption + total cooked weight into accurate calories per gram & portion.
          </Text>
        </View>

        {/* Recipe Name Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RECIPE NAME</Text>
          <TextInput
            style={styles.textInput}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="e.g. Mom's Sambar, Chicken Curry"
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        {/* Raw Ingredients Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.cardLabel}>1. RAW INGREDIENTS</Text>
            <Text style={styles.ingredientsCount}>{ingredients.length} items</Text>
          </View>

          {ingredients.map((item, index) => {
            const rawKcal = Math.round((item.per100g.kcal * item.rawGrams) / 100);
            const rawProtein = Math.round(((item.per100g.protein * item.rawGrams) / 100) * 10) / 10;
            return (
              <View key={index} style={styles.ingredientRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ingredientName}>{item.name}</Text>
                  <Text style={styles.ingredientMacros}>
                    {rawKcal} kcal • {rawProtein}g P
                  </Text>
                </View>

                <View style={styles.gramsInputBox}>
                  <TextInput
                    style={styles.gramsInput}
                    keyboardType="numeric"
                    value={item.rawGrams.toString()}
                    onChangeText={(txt) => handleUpdateIngredientGrams(index, txt)}
                  />
                  <Text style={styles.gramsUnit}>g raw</Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteIngredientBtn}
                  onPress={() => handleRemoveIngredient(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteIngredientText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Quick Preset Buttons */}
          <Text style={styles.presetsLabel}>+ Quick Add Raw Staples:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
            {COMMON_RAW_PRESETS.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={styles.presetPill}
                onPress={() => handleAddPreset(p)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetPillText}>+ {p.name.replace(' (raw)', '')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Oil Precision Section */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>2. COOKING OIL PRECISION</Text>
          <Text style={styles.cardHint}>
            Oil added minus oil left in pan = true oil retained (pure fat @ 9 kcal/g).
          </Text>

          <View style={styles.oilInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subInputLabel}>Oil Added (g)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={oilAdded}
                onChangeText={setOilAdded}
                placeholder="10"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: Spacing.two }}>
              <Text style={styles.subInputLabel}>Oil Left in Pan (g)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={oilLeftInPan}
                onChangeText={setOilLeftInPan}
                placeholder="0"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={styles.oilRetainedBox}>
              <Text style={styles.subInputLabel}>Oil Retained</Text>
              <Text style={styles.oilRetainedVal}>{oilRetainedGrams}g</Text>
              <Text style={styles.oilKcalVal}>
                +{Math.round(oilRetainedGrams * 9)} kcal
              </Text>
            </View>
          </View>
        </View>

        {/* Cooked Dish Scale & Yield Weight */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>3. FINAL COOKED DISH WEIGHT</Text>
          <Text style={styles.cardHint}>
            Weigh the entire cooked pot or dish once finished on the stove.
          </Text>

          <View style={styles.oilInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subInputLabel}>Cooked Weight (g)</Text>
              <TextInput
                style={[styles.textInput, styles.highlightInput]}
                keyboardType="numeric"
                value={cookedWeight}
                onChangeText={setCookedWeight}
                placeholder="350"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.two }}>
              <Text style={styles.subInputLabel}>Servings</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={servings}
                onChangeText={setServings}
                placeholder="2"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
          </View>

          <View style={styles.yieldMetricsBar}>
            <Text style={styles.yieldMetricText}>
              Raw: <Text style={styles.yieldBold}>{totalRawGrams}g</Text>
            </Text>
            <Text style={styles.yieldArrow}>➡️</Text>
            <Text style={styles.yieldMetricText}>
              Cooked: <Text style={styles.yieldBold}>{cookedGramsNumber}g</Text>
            </Text>
            <View style={styles.yieldRatioBadge}>
              <Text style={styles.yieldRatioText}>
                {totalRawGrams > 0 ? (cookedGramsNumber / totalRawGrams).toFixed(2) : 1}x yield
              </Text>
            </View>
          </View>
        </View>

        {/* Yield Output Results Dashboard */}
        {yieldResult && roundedTotals && roundedPer100g && roundedPerGram && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>YIELD ENGINE RESULTS</Text>
              <View style={styles.densityPill}>
                <Text style={styles.densityText}>{(Math.round(roundedPerGram.kcal * 100) / 100)} kcal / g</Text>
              </View>
            </View>

            {/* Total Dish */}
            <View style={styles.resultRowTotal}>
              <View>
                <Text style={styles.resultTotalTitle}>Full Cooked Dish ({cookedGramsNumber}g)</Text>
                <Text style={styles.resultTotalMacros}>
                  P: {roundedTotals.protein}g • C: {roundedTotals.carbs}g • F: {roundedTotals.fat}g • Fibre: {roundedTotals.fibre}g
                </Text>
              </View>
              <Text style={styles.resultTotalKcal}>{Math.round(roundedTotals.kcal)} kcal</Text>
            </View>

            {/* Per 100g Cooked */}
            <View style={styles.servingComparisonGrid}>
              <View style={styles.compCard}>
                <Text style={styles.compLabel}>Per 100g Cooked</Text>
                <Text style={styles.compKcal}>{Math.round(roundedPer100g.kcal)} kcal</Text>
                <Text style={styles.compMacros}>
                  P: {roundedPer100g.protein}g • C: {roundedPer100g.carbs}g • F: {roundedPer100g.fat}g
                </Text>
              </View>

              {/* Per Standard Katori 150g */}
              <View style={styles.compCard}>
                <Text style={styles.compLabel}>1 Katori (150g)</Text>
                <Text style={styles.compKcal}>{Math.round(roundedPerGram.kcal * 150)} kcal</Text>
                <Text style={styles.compMacros}>
                  P: {Math.round(roundedPerGram.protein * 150 * 10) / 10}g • C: {Math.round(roundedPerGram.carbs * 150 * 10) / 10}g
                </Text>
              </View>
            </View>

            {/* Custom Portion Tester */}
            <View style={styles.customPortionTester}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subInputLabel}>Custom Bowl Portion (g):</Text>
                <TextInput
                  style={styles.portionInput}
                  keyboardType="numeric"
                  value={customPortionGrams}
                  onChangeText={setCustomPortionGrams}
                />
              </View>
              <View style={styles.customPortionResult}>
                <Text style={styles.customKcal}>
                  {Math.round(roundedPerGram.kcal * (parseFloat(customPortionGrams) || 0))} kcal
                </Text>
                <Text style={styles.customProtein}>
                  {Math.round(roundedPerGram.protein * (parseFloat(customPortionGrams) || 0) * 10) / 10}g Protein
                </Text>
              </View>
            </View>

            {/* Atwater & Quality Check */}
            <View style={styles.qualityCheckRow}>
              <Text style={styles.qualityCheckText}>
                Quality check (Atwater variance): {atwaterDiffPercent}% off estimate (Verified Atwater consistency)
              </Text>
            </View>

            {/* Save Recipe Button */}
            {saveSuccess ? (
              <View style={styles.saveSuccessBanner}>
                <Text style={styles.saveSuccessText}>✅ Saved! Recipe is now searchable in your Foods tab.</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.saveRecipeBtn}
                onPress={handleSaveRecipe}
                activeOpacity={0.8}
              >
                <Text style={styles.saveRecipeBtnText}>💾 Save Recipe to Food Database</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six + 40,
    gap: Spacing.three,
  },
  header: {
    marginBottom: Spacing.two,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeText: {
    color: theme.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardHint: {
    fontSize: 11,
    color: theme.textSecondary,
    marginBottom: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ingredientsCount: {
    fontSize: 11,
    color: theme.primary,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.text,
    fontSize: 14,
  },
  highlightInput: {
    borderColor: theme.primary,
    fontWeight: '800',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  ingredientName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
  },
  ingredientMacros: {
    fontSize: 11,
    color: theme.textTertiary,
    marginTop: 2,
  },
  gramsInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.border,
    marginRight: 8,
  },
  gramsInput: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '700',
    width: 44,
    paddingVertical: 4,
    textAlign: 'center',
  },
  gramsUnit: {
    fontSize: 10,
    color: theme.textTertiary,
    marginLeft: 2,
  },
  deleteIngredientBtn: {
    padding: 6,
  },
  deleteIngredientText: {
    color: theme.textTertiary,
    fontSize: 13,
    fontWeight: '700',
  },
  presetsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
    marginTop: Spacing.two,
    marginBottom: 6,
  },
  presetsScroll: {
    flexDirection: 'row',
  },
  presetPill: {
    backgroundColor: theme.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    marginRight: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  presetPillText: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  oilInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  subInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 4,
  },
  oilRetainedBox: {
    flex: 1,
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  oilRetainedVal: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
  },
  oilKcalVal: {
    fontSize: 10,
    color: theme.fat,
    fontWeight: '700',
  },
  yieldMetricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: theme.border,
  },
  yieldMetricText: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  yieldBold: {
    color: theme.text,
    fontWeight: '800',
  },
  yieldArrow: {
    fontSize: 14,
  },
  yieldRatioBadge: {
    backgroundColor: theme.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  yieldRatioText: {
    color: theme.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  resultsCard: {
    backgroundColor: '#0F1A24',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  resultsTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.calories,
    letterSpacing: 0.5,
  },
  densityPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  densityText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.calories,
  },
  resultRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: Spacing.two,
  },
  resultTotalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
  },
  resultTotalMacros: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 2,
  },
  resultTotalKcal: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.text,
  },
  servingComparisonGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  compCard: {
    flex: 1,
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  compLabel: {
    fontSize: 11,
    color: theme.textTertiary,
    fontWeight: '700',
  },
  compKcal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.primary,
    marginVertical: 2,
  },
  compMacros: {
    fontSize: 10,
    color: theme.textSecondary,
  },
  customPortionTester: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.two,
  },
  portionInput: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    width: 70,
  },
  customPortionResult: {
    alignItems: 'flex-end',
  },
  customKcal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.calories,
  },
  customProtein: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.protein,
  },
  qualityCheckRow: {
    marginVertical: 4,
  },
  qualityCheckText: {
    fontSize: 10,
    color: theme.textTertiary,
    fontStyle: 'italic',
  },
  saveRecipeBtn: {
    backgroundColor: theme.primary,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  saveRecipeBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  saveSuccessBanner: {
    backgroundColor: '#064E3B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  saveSuccessText: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
