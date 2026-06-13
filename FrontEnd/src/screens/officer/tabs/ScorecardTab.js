import { COLORS, SPACING } from '../../../constants/theme';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

const SAFE_COLORS = {
  primary: COLORS?.primary || '#2563eb',
  background: COLORS?.background || '#f8fafc',
  surface: COLORS?.surface || '#ffffff',
  text: COLORS?.text || '#0f172a',
  textSecondary: COLORS?.textSecondary || '#475569',
  border: COLORS?.border || '#e2e8f0',
  success: COLORS?.success || '#22c55e',
  high: COLORS?.high || '#f59e0b',
  medium: COLORS?.medium || '#eab308',
  critical: COLORS?.critical || '#ef4444',
};

const SAFE_SPACING = {
  sm: SPACING?.sm || 8,
  md: SPACING?.md || 16,
};

const MOCK_SCORECARD = {
  totalComplaints: 342,
  slaCompliance: 94.5,
  reopenedRate: 2.1,
  warningLevel: 0,
};

export default function ScorecardTab() {
  const { data: scorecard, isLoading } = useQuery({
    queryKey: ['officerScorecard'],
    queryFn: async () => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_SCORECARD), 400));
    },
    placeholderData: MOCK_SCORECARD,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SAFE_COLORS.primary} />
      </View>
    );
  }

  if (!scorecard) return null;

  let warningColor = SAFE_COLORS.success;
  let warningText = 'Excellent';
  if (scorecard.warningLevel === 1) {
    warningColor = SAFE_COLORS.medium;
    warningText = 'Warning Level 1';
  } else if (scorecard.warningLevel === 2) {
    warningColor = SAFE_COLORS.critical;
    warningText = 'Critical Warning';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Performance Analytics</Text>
      
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Ionicons name="folder-open" size={28} color={SAFE_COLORS.primary} />
          <Text style={styles.gridValue}>{scorecard.totalComplaints}</Text>
          <Text style={styles.gridLabel}>Total Handled</Text>
        </View>
        
        <View style={styles.gridItem}>
          <Ionicons name="checkmark-circle" size={28} color={SAFE_COLORS.success} />
          <Text style={styles.gridValue}>{scorecard.slaCompliance}%</Text>
          <Text style={styles.gridLabel}>SLA Compliance</Text>
        </View>
        
        <View style={styles.gridItem}>
          <Ionicons name="refresh-circle" size={28} color={SAFE_COLORS.high} />
          <Text style={styles.gridValue}>{scorecard.reopenedRate}%</Text>
          <Text style={styles.gridLabel}>Reopened Rate</Text>
        </View>

        <View style={[styles.gridItem, { borderColor: warningColor, borderWidth: 2 }]}>
          <Ionicons name="warning" size={28} color={warningColor} />
          <Text style={[styles.gridValue, { color: warningColor }]}>{warningText}</Text>
          <Text style={styles.gridLabel}>Admin Status</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SAFE_COLORS.background,
  },
  container: {
    padding: SAFE_SPACING.md,
    backgroundColor: SAFE_COLORS.background,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
    marginBottom: SAFE_SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SAFE_SPACING.md,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SAFE_COLORS.surface,
    borderRadius: 12,
    padding: SAFE_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SAFE_COLORS.border,
  },
  gridValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
    marginTop: SAFE_SPACING.sm,
  },
  gridLabel: {
    fontSize: 12,
    color: SAFE_COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
