import { COLORS, SPACING } from '../../constants/theme';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActiveTasksTab from './tabs/ActiveTasksTab';
import HistoryLogsTab from './tabs/HistoryLogsTab';
import ScorecardTab from './tabs/ScorecardTab';

const SAFE_COLORS = {
  primary: COLORS?.primary || '#2563eb',
  background: COLORS?.background || '#f8fafc',
  surface: COLORS?.surface || '#ffffff',
  text: COLORS?.text || '#0f172a',
  textSecondary: COLORS?.textSecondary || '#475569',
  border: COLORS?.border || '#e2e8f0',
};

const SAFE_SPACING = {
  xs: SPACING?.xs || 4,
  sm: SPACING?.sm || 8,
  md: SPACING?.md || 16,
};

export default function OfficerDashboard() {
  const [currentTab, setCurrentTab] = useState('ACTIVE'); // 'ACTIVE', 'LOGS', 'SCORECARD'

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Field Operations</Text>
      </View>

      {/* Tab Selectors */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, currentTab === 'ACTIVE' && styles.activeTabButton]}
          onPress={() => setCurrentTab('ACTIVE')}
        >
          <Ionicons name="briefcase" size={20} color={currentTab === 'ACTIVE' ? SAFE_COLORS.primary : SAFE_COLORS.textSecondary} />
          <Text style={[styles.tabText, currentTab === 'ACTIVE' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, currentTab === 'LOGS' && styles.activeTabButton]}
          onPress={() => setCurrentTab('LOGS')}
        >
          <Ionicons name="archive" size={20} color={currentTab === 'LOGS' ? SAFE_COLORS.primary : SAFE_COLORS.textSecondary} />
          <Text style={[styles.tabText, currentTab === 'LOGS' && styles.activeTabText]}>Logs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, currentTab === 'SCORECARD' && styles.activeTabButton]}
          onPress={() => setCurrentTab('SCORECARD')}
        >
          <Ionicons name="bar-chart" size={20} color={currentTab === 'SCORECARD' ? SAFE_COLORS.primary : SAFE_COLORS.textSecondary} />
          <Text style={[styles.tabText, currentTab === 'SCORECARD' && styles.activeTabText]}>Scorecard</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {currentTab === 'ACTIVE' && <ActiveTasksTab />}
        {currentTab === 'LOGS' && <HistoryLogsTab />}
        {currentTab === 'SCORECARD' && <ScorecardTab />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAFE_COLORS.background,
  },
  header: {
    padding: SAFE_SPACING.md,
    backgroundColor: SAFE_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: SAFE_COLORS.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: SAFE_COLORS.surface,
    paddingHorizontal: SAFE_SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SAFE_SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: SAFE_SPACING.xs,
  },
  activeTabButton: {
    borderBottomColor: SAFE_COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: SAFE_COLORS.textSecondary,
  },
  activeTabText: {
    color: SAFE_COLORS.primary,
  },
  contentArea: {
    flex: 1,
  },
});
