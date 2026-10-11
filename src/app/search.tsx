import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useNutrition } from '@/context/NutritionContext';
import { FoodItem, FoodPortion } from '@/data/placeholderFoods';

const theme = Colors.dark;

type Language = 'all' | 'english' | 'tamil' | 'hindi' | 'telugu';

export default function SearchScreen() {
  const { foods, addLog } = useNutrition();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Selected food for portion modal
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<FoodPortion | null>(null);
  const [customGrams, setCustomGrams] = useState<string>('150');
  const [targetMeal, setTargetMeal] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Dal & Curries', 'Breads & Grains', 'High Protein', 'Dairy & Snacks'];

  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Query filter across all languages
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const tamilMatch = item.regionalNames.tamil?.toLowerCase().includes(q) ?? false;
      const hindiMatch = item.regionalNames.hindi?.toLowerCase().includes(q) ?? false;
      const teluguMatch = item.regionalNames.telugu?.toLowerCase().includes(q) ?? false;

      if (selectedLanguage === 'tamil') return tamilMatch || nameMatch;
      if (selectedLanguage === 'hindi') return hindiMatch || nameMatch;
      if (selectedLanguage === 'telugu') return teluguMatch || nameMatch;
      if (selectedLanguage === 'english') return nameMatch;

      return nameMatch || tamilMatch || hindiMatch || teluguMatch;
    });
  }, [foods, searchQuery, selectedLanguage, selectedCategory]);

  const handleOpenPortionModal = (food: FoodItem) => {
    setActiveFood(food);
    const defaultPortion = food.portions[food.defaultPortionIndex] || food.portions[0];
    setSelectedPortion(defaultPortion);
    setCustomGrams(defaultPortion.grams.toString());
  };

  const getEffectiveGrams = (): number => {
    const val = parseFloat(customGrams);
    return isNaN(val) || val <= 0 ? 100 : val;
  };

  const calculateActiveNutrition = (food: FoodItem, grams: number) => {
    const factor = grams / 100;
    const round1 = (n: number) => Math.round(n * 10) / 10;
    return {
      kcal: Math.round(food.per100g.kcal * factor),
      protein: round1(food.per100g.protein * factor),
      carbs: round1(food.per100g.carbs * factor),
      fat: round1(food.per100g.fat * factor),
      fiber: round1(food.per100g.fiber * factor),
    };
  };

  const handleConfirmLog = () => {
    if (!activeFood || !selectedPortion) return;
    const grams = getEffectiveGrams();
    const nutrition = calculateActiveNutrition(activeFood, grams);

    addLog({
      foodId: activeFood.id,
      name: activeFood.name,
      mealType: targetMeal,
      portionLabel: `${selectedPortion.label} (${grams}g)`,
      grams,
      kcal: nutrition.kcal,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      source: activeFood.source,
    });

    const loggedName = activeFood.name;
    setActiveFood(null);
    setToastMessage(`Added ${loggedName} to ${targetMeal.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Indian Food Database</Text>
          <Text style={styles.subtitle}>
            Offline-first database with authentic regional portions & yield metrics
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dal, phulka, sambar, சாம்பார், दाल..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Regional Language Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langPillsScroll} contentContainerStyle={styles.langPillsContent}>
          <Text style={styles.langLabel}>Language:</Text>
          {[
            { id: 'all', label: 'All' },
            { id: 'english', label: 'English' },
            { id: 'tamil', label: 'தமிழ் (Tamil)' },
            { id: 'hindi', label: 'हिंदी (Hindi)' },
            { id: 'telugu', label: 'తెలుగు (Telugu)' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={[styles.langPill, selectedLanguage === lang.id && styles.langPillActive]}
              onPress={() => setSelectedLanguage(lang.id as Language)}
            >
              <Text style={[styles.langPillText, selectedLanguage === lang.id && styles.langPillTextActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catPillsScroll} contentContainerStyle={styles.catPillsContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Toast Alert */}
        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>✅ {toastMessage}</Text>
          </View>
        )}

        {/* Food Items List */}
        <ScrollView style={styles.foodList} contentContainerStyle={styles.foodListContent} showsVerticalScrollIndicator={false}>
          {filteredFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔎</Text>
              <Text style={styles.emptyStateTitle}>No Foods Found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try adjusting your search query or language filter. You can also build a custom recipe in the Yield Engine!
              </Text>
            </View>
          ) : (
            filteredFoods.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.foodCard}
                onPress={() => handleOpenPortionModal(item)}
                activeOpacity={0.75}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleCol}>
                    <Text style={styles.cardFoodName}>{item.name}</Text>
                    {item.regionalNames.tamil && (
                      <Text style={styles.regionalSubText}>{item.regionalNames.tamil}</Text>
                    )}
                    {item.regionalNames.hindi && !item.regionalNames.tamil && (
                      <Text style={styles.regionalSubText}>{item.regionalNames.hindi}</Text>
                    )}
                  </View>
                  <View style={[styles.sourceBadge, item.source === 'own_measurement' ? styles.sourceYieldBadge : styles.sourceUsdaBadge]}>
                    <Text style={styles.sourceBadgeText}>
                      {item.source === 'own_measurement' ? 'Yield Cooked' : item.source.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Portions Available Preview */}
                <View style={styles.portionsRow}>
                  {item.portions.slice(0, 3).map((p, idx) => (
                    <View key={idx} style={styles.portionChip}>
                      <Text style={styles.portionChipText}>{p.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Macro Strip */}
                <View style={styles.cardFooter}>
                  <View style={styles.cardMacros}>
                    <Text style={styles.cardKcal}>{item.per100g.kcal} kcal/100g</Text>
                    <Text style={styles.cardMacroItem}>• P: <Text style={{ color: theme.protein }}>{item.per100g.protein}g</Text></Text>
                    <Text style={styles.cardMacroItem}>• C: <Text style={{ color: theme.carbs }}>{item.per100g.carbs}g</Text></Text>
                    <Text style={styles.cardMacroItem}>• F: <Text style={{ color: theme.fat }}>{item.per100g.fat}g</Text></Text>
                  </View>
                  <View style={styles.addBtnSmall}>
                    <Text style={styles.addBtnSmallText}>+ Log</Text>
                  </View>
                </View>

                {item.verifiedNote && (
                  <Text style={styles.verifiedNoteText}>💡 {item.verifiedNote}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Portion & Meal Selection Modal */}
      <Modal visible={activeFood !== null} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {activeFood && (
              <>
                <View style={styles.sheetHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sheetFoodName}>{activeFood.name}</Text>
                    <Text style={styles.sheetCategory}>{activeFood.category} • Source: {activeFood.source}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveFood(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.closeSheetText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Target Meal Selector */}
                <Text style={styles.sheetSectionTitle}>Select Meal</Text>
                <View style={styles.mealPillsRow}>
                  {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.mealPill, targetMeal === m && styles.mealPillActive]}
                      onPress={() => setTargetMeal(m)}
                    >
                      <Text style={[styles.mealPillText, targetMeal === m && styles.mealPillTextActive]}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Portion Selector (Katori, Grams, etc.) */}
                <Text style={styles.sheetSectionTitle}>Household Measure / Serving</Text>
                <View style={styles.portionsGrid}>
                  {activeFood.portions.map((portion, idx) => {
                    const isSelected = selectedPortion?.label === portion.label;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.portionSelectBtn, isSelected && styles.portionSelectBtnActive]}
                        onPress={() => {
                          setSelectedPortion(portion);
                          setCustomGrams(portion.grams.toString());
                        }}
                      >
                        <Text style={[styles.portionSelectBtnText, isSelected && styles.portionSelectBtnTextActive]}>
                          {portion.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Exact Grams Input */}
                <View style={styles.gramsInputRow}>
                  <Text style={styles.gramsInputLabel}>Weighed Weight (g):</Text>
                  <TextInput
                    style={styles.gramsInput}
                    keyboardType="numeric"
                    value={customGrams}
                    onChangeText={setCustomGrams}
                  />
                  <Text style={styles.gramsUnit}>grams</Text>
                </View>

                {/* Live Nutrition Calculation Box */}
                {(() => {
                  const g = getEffectiveGrams();
                  const calc = calculateActiveNutrition(activeFood, g);
                  return (
                    <View style={styles.liveCalculationBox}>
                      <Text style={styles.liveCalcTitle}>PORTION TOTAL ({g}g)</Text>
                      <View style={styles.liveCalcStats}>
                        <View style={styles.liveStatItem}>
                          <Text style={styles.liveStatNum}>{calc.kcal}</Text>
                          <Text style={styles.liveStatLabel}>kcal</Text>
                        </View>
                        <View style={styles.liveStatItem}>
                          <Text style={[styles.liveStatNum, { color: theme.protein }]}>{calc.protein}g</Text>
                          <Text style={styles.liveStatLabel}>Protein</Text>
                        </View>
                        <View style={styles.liveStatItem}>
                          <Text style={[styles.liveStatNum, { color: theme.carbs }]}>{calc.carbs}g</Text>
                          <Text style={styles.liveStatLabel}>Carbs</Text>
                        </View>
                        <View style={styles.liveStatItem}>
                          <Text style={[styles.liveStatNum, { color: theme.fat }]}>{calc.fat}g</Text>
                          <Text style={styles.liveStatLabel}>Fat</Text>
                        </View>
                        <View style={styles.liveStatItem}>
                          <Text style={[styles.liveStatNum, { color: theme.fiber }]}>{calc.fiber}g</Text>
                          <Text style={styles.liveStatLabel}>Fibre</Text>
                        </View>
                      </View>
                    </View>
                  );
                })()}

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.confirmLogBtn}
                  onPress={handleConfirmLog}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmLogBtnText}>Confirm & Log to {targetMeal.toUpperCase()}</Text>
                </TouchableOpacity>
              </>
            )}
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
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  header: {
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginVertical: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.text,
    fontSize: 14,
  },
  clearSearchText: {
    color: theme.textTertiary,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  langPillsScroll: {
    maxHeight: 38,
    marginBottom: 6,
  },
  langPillsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langLabel: {
    fontSize: 11,
    color: theme.textTertiary,
    fontWeight: '700',
    marginRight: 2,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border,
  },
  langPillActive: {
    backgroundColor: theme.primaryMuted,
    borderColor: theme.primary,
  },
  langPillText: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  langPillTextActive: {
    color: theme.primary,
    fontWeight: '800',
  },
  catPillsScroll: {
    maxHeight: 38,
    marginBottom: Spacing.two,
  },
  catPillsContent: {
    flexDirection: 'row',
    gap: 6,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  catPillActive: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.primary,
  },
  catPillText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  catPillTextActive: {
    color: theme.text,
    fontWeight: '700',
  },
  toastContainer: {
    backgroundColor: '#064E3B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  toastText: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  foodList: {
    flex: 1,
  },
  foodListContent: {
    paddingBottom: Spacing.six + 30,
    gap: Spacing.two,
  },
  foodCard: {
    backgroundColor: theme.surface,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  cardFoodName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  regionalSubText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceYieldBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  sourceUsdaBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  sourceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.text,
  },
  portionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  portionChip: {
    backgroundColor: theme.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  portionChipText: {
    fontSize: 11,
    color: theme.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardKcal: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.calories,
  },
  cardMacroItem: {
    fontSize: 11,
    color: theme.textTertiary,
  },
  addBtnSmall: {
    backgroundColor: theme.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  addBtnSmallText: {
    color: theme.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  verifiedNoteText: {
    fontSize: 11,
    color: theme.accent,
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  emptyStateIcon: {
    fontSize: 36,
    marginBottom: Spacing.two,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: theme.border,
    paddingBottom: Spacing.six,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  sheetFoodName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  sheetCategory: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  closeSheetText: {
    fontSize: 18,
    color: theme.textTertiary,
    padding: 4,
  },
  sheetSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  mealPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.three,
  },
  mealPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: theme.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  mealPillActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  mealPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  mealPillTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  portionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.three,
  },
  portionSelectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border,
  },
  portionSelectBtnActive: {
    backgroundColor: theme.primaryMuted,
    borderColor: theme.primary,
  },
  portionSelectBtnText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  portionSelectBtnTextActive: {
    color: theme.primary,
    fontWeight: '800',
  },
  gramsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
    gap: 8,
  },
  gramsInputLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  gramsInput: {
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: theme.text,
    fontSize: 15,
    fontWeight: '700',
    width: 80,
    textAlign: 'center',
  },
  gramsUnit: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  liveCalculationBox: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: Spacing.three,
  },
  liveCalcTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  liveCalcStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liveStatItem: {
    alignItems: 'center',
  },
  liveStatNum: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
  },
  liveStatLabel: {
    fontSize: 10,
    color: theme.textTertiary,
    marginTop: 2,
  },
  confirmLogBtn: {
    backgroundColor: theme.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmLogBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
});
