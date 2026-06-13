import { COLORS, SPACING } from '../../../constants/theme';
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import GrievanceCard from '../../../components/officer/GrievanceCard';
import ResolutionModal from '../../../components/officer/ResolutionModal';

const SAFE_COLORS = {
  primary: COLORS?.primary || '#2563eb',
  background: COLORS?.background || '#f8fafc',
  textSecondary: COLORS?.textSecondary || '#475569',
};

const SAFE_SPACING = {
  md: SPACING?.md || 16,
};

const MOCK_GRIEVANCES = [
  {
    id: 1,
    ticketNumber: 'CIV-2026-001',
    title: 'Major Water Pipe Burst',
    address: '123 Main St, Zone 1',
    status: 'ASSIGNED',
    priority: 'CRITICAL',
    sla_deadline: new Date(Date.now() + 3600000).toISOString(),
    description: 'Huge water leak flooding the street. Immediate attention required.',
    citizen_photo_url: 'https://via.placeholder.com/400x300.png?text=Water+Leak',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: 2,
    ticketNumber: 'CIV-2026-002',
    title: 'Traffic Signal Failure',
    address: '456 Oak Rd, Zone 2',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    sla_deadline: new Date(Date.now() + 7200000).toISOString(),
    description: 'Main intersection signals are completely dead.',
    citizen_photo_url: 'https://via.placeholder.com/400x300.png?text=Traffic+Signal',
    latitude: 13.0850,
    longitude: 80.2750,
  },
  {
    id: 3,
    ticketNumber: 'CIV-2026-003',
    title: 'Street Light Outage',
    address: '789 Pine Ln, Zone 3',
    status: 'REOPENED_BY_CITIZEN',
    priority: 'MEDIUM',
    sla_deadline: new Date(Date.now() + 86400000).toISOString(),
    description: 'Lights are still out even after previous closure report.',
    citizen_photo_url: 'https://via.placeholder.com/400x300.png?text=Street+Light',
    latitude: 13.0900,
    longitude: 80.2800,
  }
];

export default function ActiveTasksTab() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: grievances, isLoading } = useQuery({
    queryKey: ['officerGrievances_active'],
    queryFn: async () => {
      // Mocking GET /api/v1/officer/grievances/assigned
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_GRIEVANCES), 600));
    },
    placeholderData: MOCK_GRIEVANCES,
  });

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const activeTasks = grievances?.filter(g => 
    ['ASSIGNED', 'IN_PROGRESS', 'REOPENED_BY_CITIZEN'].includes(g.status)
  ) || [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SAFE_COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activeTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <GrievanceCard item={item} onPress={() => handleOpenTask(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No active tasks assigned.</Text>}
      />
      <ResolutionModal 
        visible={modalVisible} 
        selectedTask={selectedTask} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAFE_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SAFE_COLORS.background,
  },
  listContent: {
    padding: SAFE_SPACING.md,
    gap: SAFE_SPACING.md,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: SAFE_COLORS.textSecondary,
  },
});
