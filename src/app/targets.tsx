import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useNutrition } from '@/context/NutritionContext';

const theme = Colors.dark;

export default function TargetsScreen() {
  const { targets, activeDayType, setActiveDayType } = useNutrition();

  const [goalMode, setGoalMode] = useState<'cut' | 'maintain' | 'bulk'>('cut');
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Export Personal Nutrition Data',
      'Under India’s DPDP Act, you can download all your logged food weights, recipes, and body weight logs as a portable JSON/CSV archive.',
      [{ text: 'Download Archive', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete My Data (DPDP Act)',
      'This will permanently erase all local SQLite databases and synced cloud records. Your data will not be recoverable.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Permanently', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lifter Goals & Targets</Text>
          <Text style={styles.subtitle}>
            Adaptive targets tailored for gym-goers, lifters, and serious trackers
          </Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>🏋️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.two }}>
              <Text style={styles.profileName}>Arjun S. (Lifter)</Text>
              <Text style={styles.profileDetail}>Current: 74.0 kg • Target: 71.5 kg • Lean Cut</Text>
            </View>
            <View style={styles.trialPill}>
              <Text style={styles.trialText}>7-DAY TRIAL</Text>
            </View>
          </View>
        </View>

        {/* Goal Strategy Selector */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>GOAL STRATEGY</Text>
          <View style={styles.goalPillsRow}>
            {(['cut', 'maintain', 'bulk'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.goalPill, goalMode === mode && styles.goalPillActive]}
                onPress={() => setGoalMode(mode)}
              >
                <Text style={[styles.goalPillText, goalMode === mode && styles.goalPillTextActive]}>
                  {mode === 'cut' ? '✂️ Cut (-350 kcal)' : mode === 'maintain' ? '⚖️ Maintain' : '💪 Bulk (+250 kcal)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Protein Ratio Calculation */}
          <View style={styles.proteinRatioBox}>
            <View style={styles.proteinRatioLeft}>
              <Text style={styles.proteinRatioTitle}>Protein per kg Bodyweight</Text>
              <Text style={styles.proteinRatioDesc}>
                Set to 2.0g/kg bodyweight for optimal lean mass retention during a caloric deficit.
              </Text>
            </View>
            <View style={styles.proteinRatioBadge}>
              <Text style={styles.proteinRatioNum}>2.0 g/kg</Text>
              <Text style={styles.proteinTargetGrams}>148g / day</Text>
            </View>
          </View>
        </View>

        {/* Training vs Rest Day Targets Cycling */}
        <View style={styles.card}>
          <View style={styles.cyclingHeader}>
            <Text style={styles.cardLabel}>CALORIE & MACRO CYCLING</Text>
            <TouchableOpacity onPress={() => setActiveDayType(activeDayType === 'training' ? 'rest' : 'training')}>
              <Text style={styles.toggleActiveDayLink}>
                Switch Active ({activeDayType === 'training' ? 'Training' : 'Rest'})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.targetsTable}>
            {/* Training Day Row */}
            <View style={[styles.targetRow, activeDayType === 'training' && styles.targetRowActive]}>
              <View style={styles.dayCol}>
                <Text style={styles.dayColTitle}>🏋️ Training Day</Text>
                <Text style={styles.dayColSub}>Higher carbs for glycogen</Text>
              </View>
              <View style={styles.dayStatsCol}>
                <Text style={styles.targetKcal}>{targets.trainingDay.kcal} kcal</Text>
                <Text style={styles.targetMacros}>
                  P: {targets.trainingDay.protein}g • C: {targets.trainingDay.carbs}g • F: {targets.trainingDay.fat}g
                </Text>
              </View>
            </View>

            {/* Rest Day Row */}
            <View style={[styles.targetRow, activeDayType === 'rest' && styles.targetRowActive]}>
              <View style={styles.dayCol}>
                <Text style={styles.dayColTitle}>🧘 Rest Day</Text>
                <Text style={styles.dayColSub}>Reduced carbohydrates</Text>
              </View>
              <View style={styles.dayStatsCol}>
                <Text style={styles.targetKcal}>{targets.restDay.kcal} kcal</Text>
                <Text style={styles.targetMacros}>
                  P: {targets.restDay.protein}g • C: {targets.restDay.carbs}g • F: {targets.restDay.fat}g
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.safetyFloorBox}>
            <Text style={styles.safetyFloorText}>
              🛡️ Metabolic Safety Floor: 1,600 kcal minimum maintained. No crash diets.
            </Text>
          </View>
        </View>

        {/* RevenueCat Hard Paywall Preview */}
        <View style={styles.paywallCard}>
          <View style={styles.paywallHeader}>
            <Text style={styles.paywallTitle}>MAXIII Full Access Plan</Text>
            <View style={styles.paywallBadge}>
              <Text style={styles.paywallBadgeText}>REVENUECAT READY</Text>
            </View>
          </View>
          <Text style={styles.paywallSubtitle}>
            Hard paywall model with 7-day full access trial. Your saved food logs & custom recipes are permanently retained even if subscription lapses.
          </Text>

          <View style={styles.planOptionsRow}>
            <View style={[styles.planBox, styles.planBoxHighlighted]}>
              <Text style={styles.planTag}>BEST VALUE</Text>
              <Text style={styles.planDuration}>Annual</Text>
              <Text style={styles.planPrice}>₹1,499</Text>
              <Text style={styles.planPerMonth}>₹125 / month</Text>
            </View>
            <View style={styles.planBox}>
              <Text style={styles.planDuration}>Monthly</Text>
              <Text style={styles.planPrice}>₹199</Text>
              <Text style={styles.planPerMonth}>Billed monthly</Text>
            </View>
          </View>
        </View>

        {/* Offline SQLite & DPDP Act Data Privacy */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DATA PRIVACY & OFFLINE STORAGE</Text>
          <Text style={styles.dpdpNotice}>
            Compliant with India's Digital Personal Data Protection (DPDP) Act. Nutrition logs are saved on-device via SQLite for 100% offline access.
          </Text>

          <View style={styles.settingToggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>On-Device SQLite Cache</Text>
              <Text style={styles.settingDesc}>Allows instant food searches without cellular data</Text>
            </View>
            <Switch
              value={offlineSyncEnabled}
              onValueChange={setOfflineSyncEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={styles.dpdpActionsRow}>
            <TouchableOpacity style={styles.exportBtn} onPress={handleExportData}>
              <Text style={styles.exportBtnText}>📥 Export My Logs (JSON)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteData}>
              <Text style={styles.deleteBtnText}>🗑️ Delete All Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Disclaimer */}
        <View style={styles.legalBox}>
          <Text style={styles.legalText}>
            Disclaimer: MAXIII is an energy tracking calculation tool and does not provide medical diagnoses or dietary medical advice. Consult a certified nutritionist or physician for clinical health needs.
          </Text>
        </View>
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
    marginBottom: Spacing.two,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  avatarText: {
    fontSize: 20,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  profileDetail: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  trialPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  trialText: {
    color: theme.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  goalPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.three,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: theme.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  goalPillActive: {
    backgroundColor: theme.primaryMuted,
    borderColor: theme.primary,
  },
  goalPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  goalPillTextActive: {
    color: theme.primary,
    fontWeight: '800',
  },
  proteinRatioBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  proteinRatioLeft: {
    flex: 1,
    marginRight: 10,
  },
  proteinRatioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.text,
  },
  proteinRatioDesc: {
    fontSize: 11,
    color: theme.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  proteinRatioBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  proteinRatioNum: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.primary,
  },
  proteinTargetGrams: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text,
    marginTop: 2,
  },
  cyclingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  toggleActiveDayLink: {
    fontSize: 11,
    color: theme.primary,
    fontWeight: '700',
  },
  targetsTable: {
    gap: 8,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  targetRowActive: {
    borderColor: theme.primary,
    backgroundColor: '#0F181B',
  },
  dayCol: {
    flex: 1,
  },
  dayColTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
  },
  dayColSub: {
    fontSize: 11,
    color: theme.textTertiary,
    marginTop: 2,
  },
  dayStatsCol: {
    alignItems: 'flex-end',
  },
  targetKcal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.calories,
  },
  targetMacros: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 2,
  },
  safetyFloorBox: {
    marginTop: Spacing.two,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: Radius.sm,
    padding: 8,
  },
  safetyFloorText: {
    fontSize: 11,
    color: theme.accent,
    fontWeight: '600',
  },
  paywallCard: {
    backgroundColor: '#121A22',
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  paywallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paywallTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
  },
  paywallBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  paywallBadgeText: {
    color: theme.calories,
    fontSize: 9,
    fontWeight: '800',
  },
  paywallSubtitle: {
    fontSize: 11,
    color: theme.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.three,
  },
  planOptionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  planBox: {
    flex: 1,
    backgroundColor: theme.surfaceElevated,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  planBoxHighlighted: {
    borderColor: theme.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  planTag: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 2,
  },
  planDuration: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.text,
    marginVertical: 4,
  },
  planPerMonth: {
    fontSize: 10,
    color: theme.textTertiary,
  },
  dpdpNotice: {
    fontSize: 11,
    color: theme.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.two,
  },
  settingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: Spacing.two,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
  },
  settingDesc: {
    fontSize: 11,
    color: theme.textTertiary,
    marginTop: 2,
  },
  dpdpActionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 4,
  },
  exportBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: theme.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text,
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.fat,
  },
  legalBox: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  legalText: {
    fontSize: 10,
    color: theme.textTertiary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
