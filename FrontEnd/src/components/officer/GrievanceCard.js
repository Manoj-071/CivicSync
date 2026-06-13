import { COLORS, SPACING } from '../../constants/theme';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAFE_COLORS = {
  primary: COLORS?.primary || '#2563eb',
  secondary: COLORS?.secondary || '#64748b',
  text: COLORS?.text || '#0f172a',
  textSecondary: COLORS?.textSecondary || '#475569',
  surface: COLORS?.surface || '#ffffff',
  border: COLORS?.border || '#e2e8f0',
  critical: COLORS?.critical || '#ef4444',
  high: COLORS?.high || '#f59e0b',
  medium: COLORS?.medium || '#eab308',
  low: COLORS?.low || '#94a3b8',
  white: '#ffffff',
};

const SAFE_SPACING = {
  xs: SPACING?.xs || 4,
  sm: SPACING?.sm || 8,
  md: SPACING?.md || 16,
};

const PriorityBadge = ({ priority }) => {
  let bgColor = SAFE_COLORS.low;
  switch (priority) {
    case 'CRITICAL': bgColor = SAFE_COLORS.critical; break;
    case 'HIGH': bgColor = SAFE_COLORS.high; break;
    case 'MEDIUM': bgColor = SAFE_COLORS.medium; break;
    case 'LOW': bgColor = SAFE_COLORS.low; break;
  }
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={styles.badgeText}>{priority}</Text>
    </View>
  );
};

const LiveCountdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(deadline).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft('SLA BREACHED');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isBreached = timeLeft === 'SLA BREACHED';

  return (
    <View style={styles.timerContainer}>
      <Ionicons name="time-outline" size={14} color={isBreached ? SAFE_COLORS.critical : SAFE_COLORS.textSecondary} />
      <Text style={[styles.timerText, isBreached && styles.breachedText]}>{timeLeft}</Text>
    </View>
  );
};

export default function GrievanceCard({ item, onPress }) {
  if (!item) return null;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.ticketNumber}>{item.ticketNumber}</Text>
        <PriorityBadge priority={item.priority} />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      
      <View style={styles.cardRow}>
        <Ionicons name="location-outline" size={16} color={SAFE_COLORS.textSecondary} />
        <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.statusText}>{item.status.replace(/_/g, ' ')}</Text>
        <LiveCountdown deadline={item.sla_deadline} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SAFE_COLORS.surface,
    borderRadius: 12,
    padding: SAFE_SPACING.md,
    borderWidth: 1,
    borderColor: SAFE_COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SAFE_SPACING.sm,
  },
  ticketNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: SAFE_COLORS.textSecondary,
  },
  badge: {
    paddingHorizontal: SAFE_SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SAFE_COLORS.white,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
    marginBottom: SAFE_SPACING.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SAFE_SPACING.md,
    gap: SAFE_SPACING.xs,
  },
  cardAddress: {
    fontSize: 14,
    color: SAFE_COLORS.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: SAFE_COLORS.border,
    paddingTop: SAFE_SPACING.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: SAFE_COLORS.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: SAFE_COLORS.textSecondary,
  },
  breachedText: {
    color: SAFE_COLORS.critical,
  },
});
