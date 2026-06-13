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

const MOCK_HISTORY = [
  {
    id: 4,
    ticketNumber: 'CIV-2026-004',
    title: 'Pothole on High Street',
    address: 'High Street, Zone 3',
    status: 'RESOLVED',
    priority: 'LOW',
    sla_deadline: new Date(Date.now() - 3600000).toISOString(),
    description: 'Large pothole causing traffic slowdown.',
    citizen_photo_url: 'https://via.placeholder.com/400x300.png?text=Pothole',
    latitude: 13.0950,
    longitude: 80.2850,
  },
  {
    id: 5,
    ticketNumber: 'CIV-2026-005',
    title: 'Garbage Accumulation',
    address: 'Market Square, Zone 1',
    status: 'CLOSED',
    priority: 'MEDIUM',
    sla_deadline: new Date(Date.now() - 86400000).toISOString(),
    description: 'Garbage not collected for a week.',
    citizen_photo_url: 'https://via.placeholder.com/400x300.png?text=Garbage',
    latitude: 13.0800,
    longitude: 80.2700,
  }
];

export default function HistoryLogsTab() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: historyLogs, isLoading } = useQuery({
    queryKey: ['officerGrievances_history'],
    queryFn: async () => {
      // Mocking fetch history
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_HISTORY), 600));
    },
    placeholderData: MOCK_HISTORY,
  });

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const logs = historyLogs?.filter(g => 
    ['RESOLVED', 'CLOSED'].includes(g.status)
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
        data={logs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <GrievanceCard item={item} onPress={() => handleOpenTask(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No resolution logs found.</Text>}
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
