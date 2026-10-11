import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useNutrition } from '@/context/NutritionContext';
import { LoggedFoodItem } from '@/data/placeholderFoods';

const theme = Colors.dark;

export default function TodayScreen() {
  const router = useRouter();
  const {
    logs,
    activeDayType,
    setActiveDayType,
    activeTarget,
    totals,
    streakDays,
    removeLog,
    copyYesterday,
    addLog,
  } = useNutrition();

  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickMeal, setQuickMeal] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('snack');
  const [quickName, setQuickName] = useState('');
  const [quickKcal, setQuickKcal] = useState('');
  const [quickProtein, setQuickProtein] = useState('');

  const mealTypes: Array<{ key: 'breakfast' | 'lunch' | 'snack' | 'dinner'; title: string; icon: string }> = [
    { key: 'breakfast', title: 'Breakfast', icon: '🌅' },
    { key: 'lunch', title: 'Lunch', icon: '☀️' },
    { key: 'snack', title: 'Evening / Pre-Workout', icon: '⚡' },
    { key: 'dinner', title: 'Dinner', icon: '🌙' },
  ];

  const handleQuickAdd = () => {
    const kcalNum = parseFloat(quickKcal);
    const proteinNum = parseFloat(quickProtein) || 0;
    if (!quickName.trim() || isNaN(kcalNum) || kcalNum <= 0) {
      Alert.alert('Invalid Entry', 'Please enter a food name and valid calories.');
      return;
    }
    addLog({
      foodId: 'quick-add',
      name: quickName.trim(),
      mealType: quickMeal,
      portionLabel: 'Quick Entry',
      grams: 100,
      kcal: Math.round(kcalNum),
      protein: Math.round(proteinNum * 10) / 10,
      carbs: 0,
      fat: 0,
      fiber: 0,
      source: 'label',
    });
    setQuickName('');
    setQuickKcal('');
    setQuickProtein('');
    setQuickAddVisible(false);
  };

  const calorieProgress = Math.min(1, totals.kcal / activeTarget.kcal);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <View style={styles.logoRow}>
              <Text style={styles.brandTitle}>MAXIII</Text>
              <View style={styles.betaBadge}>
                <Text style={styles.betaText}>YIELD ENGINE</Text>
              </View>
            </View>
            <Text style={styles.dateSubtitle}>Saturday, 10 Oct • Today</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streakDays}-day streak</Text>
          </View>
        </View>

        {/* Day Target Switcher (Training vs Rest) */}
        <View style={styles.daySwitchContainer}>
          <TouchableOpacity
            style={[styles.daySwitchBtn, activeDayType === 'training' && styles.daySwitchBtnActive]}
            onPress={() => setActiveDayType('training')}
            activeOpacity={0.8}
          >
            <Text style={[styles.daySwitchText, activeDayType === 'training' && styles.daySwitchTextActive]}>
              🏋️ Training Day (2,150 kcal)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.daySwitchBtn, activeDayType === 'rest' && styles.daySwitchBtnActive]}
            onPress={() => setActiveDayType('rest')}
            activeOpacity={0.8}
          >
            <Text style={[styles.daySwitchText, activeDayType === 'rest' && styles.daySwitchTextActive]}>
              🧘 Rest Day (1,850 kcal)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daily Calorie Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Daily Energy Budget</Text>
            <Text style={styles.summaryRemainingText}>
              <Text style={styles.summaryRemainingNum}>{totals.remainingKcal}</Text> kcal left
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${calorieProgress * 100}%` }]} />
          </View>

          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Target</Text>
              <Text style={styles.budgetValue}>{activeTarget.kcal}</Text>
            </View>
            <View style={styles.budgetDivider} />
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Eaten</Text>
              <Text style={[styles.budgetValue, { color: theme.calories }]}>{totals.kcal}</Text>
            </View>
            <View style={styles.budgetDivider} />
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Remaining</Text>
              <Text style={[styles.budgetValue, { color: theme.primary }]}>{totals.remainingKcal}</Text>
            </View>
          </View>
        </View>

        {/* Macro Nutrient Cards */}
        <View style={styles.macrosGrid}>
          {/* Protein Card (Primary for lifters) */}
          <View style={[styles.macroCard, styles.proteinHighlightCard]}>
            <View style={styles.macroCardHeader}>
              <Text style={styles.macroName}>PROTEIN</Text>
              <Text style={[styles.macroPercent, { color: theme.protein }]}>{totals.proteinPercent}%</Text>
            </View>
            <Text style={styles.macroAmount}>
              <Text style={[styles.macroAmountBold, { color: theme.protein }]}>{totals.protein}</Text>
              <Text style={styles.macroGoal}> / {activeTarget.protein}g</Text>
            </Text>
            <View style={styles.macroBarBg}>
              <View
                style={[
                  styles.macroBarFill,
                  { backgroundColor: theme.protein, width: `${Math.min(100, (totals.protein / activeTarget.protein) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.macroRemainingHint}>
              {Math.max(0, Math.round(activeTarget.protein - totals.protein))}g to hit target
            </Text>
          </View>

          {/* Carbs Card */}
          <View style={styles.macroCard}>
            <View style={styles.macroCardHeader}>
              <Text style={styles.macroName}>CARBS</Text>
              <Text style={[styles.macroPercent, { color: theme.carbs }]}>
                {Math.min(100, Math.round((totals.carbs / activeTarget.carbs) * 100))}%
              </Text>
            </View>
            <Text style={styles.macroAmount}>
              <Text style={[styles.macroAmountBold, { color: theme.carbs }]}>{totals.carbs}</Text>
              <Text style={styles.macroGoal}> / {activeTarget.carbs}g</Text>
            </Text>
            <View style={styles.macroBarBg}>
              <View
                style={[
                  styles.macroBarFill,
                  { backgroundColor: theme.carbs, width: `${Math.min(100, (totals.carbs / activeTarget.carbs) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.macroRemainingHint}>
              {Math.max(0, Math.round(activeTarget.carbs - totals.carbs))}g left
            </Text>
          </View>

          {/* Fats Card */}
          <View style={styles.macroCard}>
            <View style={styles.macroCardHeader}>
              <Text style={styles.macroName}>FATS</Text>
              <Text style={[styles.macroPercent, { color: theme.fat }]}>
                {Math.min(100, Math.round((totals.fat / activeTarget.fat) * 100))}%
              </Text>
            </View>
            <Text style={styles.macroAmount}>
              <Text style={[styles.macroAmountBold, { color: theme.fat }]}>{totals.fat}</Text>
              <Text style={styles.macroGoal}> / {activeTarget.fat}g</Text>
            </Text>
            <View style={styles.macroBarBg}>
              <View
                style={[
                  styles.macroBarFill,
                  { backgroundColor: theme.fat, width: `${Math.min(100, (totals.fat / activeTarget.fat) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.macroRemainingHint}>
              {Math.max(0, Math.round(activeTarget.fat - totals.fat))}g left
            </Text>
          </View>

          {/* Fiber Card */}
          <View style={styles.macroCard}>
            <View style={styles.macroCardHeader}>
              <Text style={styles.macroName}>FIBRE</Text>
              <Text style={[styles.macroPercent, { color: theme.fiber }]}>
                {Math.min(100, Math.round((totals.fiber / activeTarget.fiber) * 100))}%
              </Text>
            </View>
            <Text style={styles.macroAmount}>
              <Text style={[styles.macroAmountBold, { color: theme.fiber }]}>{totals.fiber}</Text>
              <Text style={styles.macroGoal}> / {activeTarget.fiber}g</Text>
            </Text>
            <View style={styles.macroBarBg}>
              <View
                style={[
                  styles.macroBarFill,
                  { backgroundColor: theme.fiber, width: `${Math.min(100, (totals.fiber / activeTarget.fiber) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.macroRemainingHint}>
              {Math.max(0, Math.round(activeTarget.fiber - totals.fiber))}g left
            </Text>
          </View>
        </View>

        {/* Action Shortcuts */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.primaryActionBtn]}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryActionBtnText}>🔍 Search & Log Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryActionBtn]}
            onPress={() => setQuickAddVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryActionBtnText}>⚡ Quick Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryActionBtn]}
            onPress={copyYesterday}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryActionBtnText}>📋 Copy Yesterday</Text>
          </TouchableOpacity>
        </View>

        {/* Meals Breakdown */}
        <Text style={styles.sectionHeading}>Today's Meals</Text>

        {mealTypes.map((meal) => {
          const mealLogs = logs.filter((l) => l.mealType === meal.key);
          const mealKcal = mealLogs.reduce((acc, curr) => acc + curr.kcal, 0);
          const mealProtein = Math.round(mealLogs.reduce((acc, curr) => acc + curr.protein, 0) * 10) / 10;

          return (
            <View key={meal.key} style={styles.mealSection}>
              <View style={styles.mealSectionHeader}>
                <View style={styles.mealTitleRow}>
                  <Text style={styles.mealIcon}>{meal.icon}</Text>
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                </View>
                <View style={styles.mealSummaryRow}>
                  <Text style={styles.mealKcalText}>{mealKcal} kcal</Text>
                  <Text style={styles.mealProteinText}>• {mealProtein}g P</Text>
                  <TouchableOpacity
                    style={styles.addMealIconBtn}
                    onPress={() => router.push('/search')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addMealIconText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {mealLogs.length === 0 ? (
                <View style={styles.emptyMealBox}>
                  <Text style={styles.emptyMealText}>No food logged for {meal.title.toLowerCase()} yet.</Text>
                </View>
              ) : (
                mealLogs.map((item) => (
                  <View key={item.id} style={styles.foodItemRow}>
                    <View style={styles.foodInfoCol}>
                      <View style={styles.foodTitleRow}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <View style={[styles.sourceTag, item.source === 'own_measurement' ? styles.sourceYield : styles.sourceUsda]}>
                          <Text style={styles.sourceTagText}>
                            {item.source === 'own_measurement' ? 'Cooked Yield' : item.source.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.portionLabel}>{item.portionLabel}</Text>
                      <Text style={styles.foodMacros}>
                        <Text style={{ color: theme.calories }}>{item.kcal} kcal</Text>
                        {'  '}P: <Text style={{ color: theme.protein }}>{item.protein}g</Text>
                        {'  '}C: <Text style={{ color: theme.carbs }}>{item.carbs}g</Text>
                        {'  '}F: <Text style={{ color: theme.fat }}>{item.fat}g</Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeLog(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          );
        })}

        {/* Health Disclaimer Banner */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚖️ Calculation Accuracy & Health Notice</Text>
          <Text style={styles.disclaimerText}>
            Nutrition values represent calculation accuracy when raw and cooked ingredients are weighed. Daily calorie floor is maintained at 1,600 kcal minimum for safe metabolic health. Not medical advice.
          </Text>
        </View>
      </ScrollView>

      {/* Quick Add Modal */}
      <Modal visible={quickAddVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚡ Quick Calorie & Protein Entry</Text>
            <Text style={styles.modalSubtitle}>Fast logging when you already know the macros</Text>

            <Text style={styles.inputLabel}>Meal</Text>
            <View style={styles.modalMealPicker}>
              {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modalMealPill, quickMeal === m && styles.modalMealPillActive]}
                  onPress={() => setQuickMeal(m)}
                >
                  <Text style={[styles.modalMealPillText, quickMeal === m && styles.modalMealPillTextActive]}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Food or Item Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Protein shake with almond milk"
              placeholderTextColor={theme.textTertiary}
              value={quickName}
              onChangeText={setQuickName}
            />

            <View style={styles.modalInputRow}>
              <View style={{ flex: 1, marginRight: Spacing.two }}>
                <Text style={styles.inputLabel}>Calories (kcal)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 250"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                  value={quickKcal}
                  onChangeText={setQuickKcal}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 24"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                  value={quickProtein}
                  onChangeText={setQuickProtein}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setQuickAddVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleQuickAdd}
              >
                <Text style={styles.modalSubmitText}>Add to Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.text,
    letterSpacing: -0.5,
  },
  betaBadge: {
    backgroundColor: theme.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  betaText: {
    color: theme.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: theme.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: theme.border,
  },
  streakText: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '700',
  },
  daySwitchContainer: {
    flexDirection: 'row',
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
  },
  daySwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  daySwitchBtnActive: {
    backgroundColor: theme.primary,
  },
  daySwitchText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  daySwitchTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: theme.surface,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.three,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.two,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRemainingText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  summaryRemainingNum: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginVertical: Spacing.two,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: Radius.pill,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: theme.textTertiary,
    marginBottom: 2,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  budgetDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.border,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  macroCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.surface,
    borderRadius: Radius.md,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
  },
  proteinHighlightCard: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: '#0F181B',
  },
  macroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroName: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.textTertiary,
    letterSpacing: 0.5,
  },
  macroPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  macroAmount: {
    marginTop: 4,
    marginBottom: 6,
  },
  macroAmountBold: {
    fontSize: 18,
    fontWeight: '800',
  },
  macroGoal: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  macroBarBg: {
    height: 6,
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  macroRemainingHint: {
    fontSize: 11,
    color: theme.textTertiary,
    marginTop: 6,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtn: {
    flex: 1.3,
    backgroundColor: theme.primary,
  },
  primaryActionBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryActionBtnText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.text,
    marginBottom: Spacing.two,
  },
  mealSection: {
    backgroundColor: theme.surface,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.three,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: Spacing.two,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  mealIcon: {
    fontSize: 16,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  mealSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealKcalText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.calories,
  },
  mealProteinText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.protein,
  },
  addMealIconBtn: {
    backgroundColor: theme.surfaceElevated,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  addMealIconText: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyMealBox: {
    paddingVertical: Spacing.two,
  },
  emptyMealText: {
    fontSize: 12,
    color: theme.textTertiary,
    fontStyle: 'italic',
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  foodInfoCol: {
    flex: 1,
  },
  foodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  sourceTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceYield: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  sourceUsda: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  sourceTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.text,
  },
  portionLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  foodMacros: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 3,
  },
  removeBtn: {
    padding: 6,
    marginLeft: 8,
  },
  removeBtnText: {
    color: theme.textTertiary,
    fontSize: 14,
    fontWeight: '700',
  },
  disclaimerBox: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: theme.border,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.accent,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: theme.textTertiary,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.surface,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: Spacing.three,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    marginBottom: 6,
  },
  modalMealPicker: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.three,
  },
  modalMealPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: theme.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalMealPillActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  modalMealPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  modalMealPillTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  modalInput: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.text,
    fontSize: 14,
    marginBottom: Spacing.three,
  },
  modalInputRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
  },
  modalCancelText: {
    color: theme.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  modalSubmitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: theme.primary,
  },
  modalSubmitText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
});
