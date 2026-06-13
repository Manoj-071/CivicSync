import { COLORS, SPACING } from '../../constants/theme';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Linking,
  Platform,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SAFE_COLORS = {
  primary: COLORS?.primary || '#2563eb',
  secondary: COLORS?.secondary || '#64748b',
  background: COLORS?.background || '#f8fafc',
  surface: COLORS?.surface || '#ffffff',
  text: COLORS?.text || '#0f172a',
  textSecondary: COLORS?.textSecondary || '#475569',
  border: COLORS?.border || '#e2e8f0',
  success: COLORS?.success || '#22c55e',
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
  lg: SPACING?.lg || 24,
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

export default function ResolutionModal({ visible, selectedTask, onClose }) {
  const [closureNotes, setClosureNotes] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setClosureNotes('');
    setProofImage(null);
    onClose();
  };

  const resolveMutation = useMutation({
    mutationFn: async (formData) => {
      // Mocking PUT /api/v1/officer/grievances/{id}/status
      return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    },
    onSuccess: () => {
      Alert.alert('Success', 'Work order resolved successfully.');
      queryClient.invalidateQueries({ queryKey: ['officerGrievances_active'] });
      queryClient.invalidateQueries({ queryKey: ['officerGrievances_history'] });
      handleClose();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to resolve work order. Please try again.');
    }
  });

  const navigateToSite = () => {
    if (!selectedTask?.latitude || !selectedTask?.longitude) return;
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${selectedTask.latitude},${selectedTask.longitude}`;
    const label = selectedTask.title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Maps application is not available.');
      }
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to capture proof.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0]);
    }
  };

  const submitResolution = () => {
    if (!closureNotes.trim()) {
      Alert.alert('Validation Error', 'Closure notes are required.');
      return;
    }
    if (!proofImage) {
      Alert.alert('Validation Error', 'Photographic proof is required.');
      return;
    }

    const formData = new FormData();
    formData.append('status', 'RESOLVED');
    formData.append('closure_notes', closureNotes);
    
    const uriParts = proofImage.uri.split('.');
    const fileType = uriParts[uriParts.length - 1] || 'jpeg';
    
    formData.append('completionProof', {
      uri: proofImage.uri,
      name: `proof_${selectedTask.id}.${fileType}`,
      type: `image/${fileType}`,
    });

    resolveMutation.mutate(formData);
  };

  if (!selectedTask) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{selectedTask.ticketNumber}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={SAFE_COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalScroll}>
          <View style={styles.modalSection}>
            <Text style={styles.detailTitle}>{selectedTask.title}</Text>
            <PriorityBadge priority={selectedTask.priority} />
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Citizen Description</Text>
            <Text style={styles.detailText}>{selectedTask.description}</Text>
          </View>

          {selectedTask.citizen_photo_url && (
            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Reported Proof</Text>
              <Image 
                source={{ uri: selectedTask.citizen_photo_url }} 
                style={styles.citizenPhoto} 
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.modalSection}>
            <Text style={styles.sectionLabel}>Location</Text>
            <Text style={styles.detailText}>{selectedTask.address}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={navigateToSite}>
              <Ionicons name="navigate" size={20} color={SAFE_COLORS.white} />
              <Text style={styles.actionButtonText}>Navigate to Site</Text>
            </TouchableOpacity>
          </View>

          {['ASSIGNED', 'IN_PROGRESS', 'REOPENED_BY_CITIZEN'].includes(selectedTask.status) && (
            <View style={[styles.modalSection, styles.resolutionSection]}>
              <Text style={styles.sectionLabel}>Resolve Work Order</Text>
              
              <TextInput
                style={styles.textInput}
                placeholder="Enter closure notes..."
                placeholderTextColor={SAFE_COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={closureNotes}
                onChangeText={setClosureNotes}
              />

              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color={SAFE_COLORS.primary} />
                <Text style={styles.secondaryButtonText}>
                  {proofImage ? 'Retake Photographic Proof' : 'Capture Resolution Proof'}
                </Text>
              </TouchableOpacity>

              {proofImage && (
                <Image source={{ uri: proofImage.uri }} style={styles.proofPreview} />
              )}

              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.resolveButton,
                  (!closureNotes.trim() || !proofImage) && styles.disabledButton
                ]} 
                onPress={submitResolution}
                disabled={resolveMutation.isPending || !closureNotes.trim() || !proofImage}
              >
                {resolveMutation.isPending ? (
                  <ActivityIndicator color={SAFE_COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark-done" size={20} color={SAFE_COLORS.white} />
                    <Text style={styles.actionButtonText}>Submit Resolution</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SAFE_SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SAFE_COLORS.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: SAFE_COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SAFE_SPACING.md,
    backgroundColor: SAFE_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: SAFE_COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
  },
  closeButton: {
    padding: SAFE_SPACING.xs,
  },
  modalScroll: {
    padding: SAFE_SPACING.md,
    gap: SAFE_SPACING.lg,
  },
  modalSection: {
    backgroundColor: SAFE_COLORS.surface,
    padding: SAFE_SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAFE_COLORS.border,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAFE_COLORS.text,
    marginBottom: SAFE_SPACING.sm,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SAFE_COLORS.textSecondary,
    marginBottom: SAFE_SPACING.sm,
  },
  detailText: {
    fontSize: 16,
    color: SAFE_COLORS.text,
    lineHeight: 24,
  },
  citizenPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: SAFE_COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: SAFE_COLORS.primary,
    padding: SAFE_SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SAFE_SPACING.md,
    gap: SAFE_SPACING.sm,
  },
  actionButtonText: {
    color: SAFE_COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resolutionSection: {
    borderColor: SAFE_COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#eff6ff', 
  },
  textInput: {
    backgroundColor: SAFE_COLORS.surface,
    borderWidth: 1,
    borderColor: SAFE_COLORS.border,
    borderRadius: 8,
    padding: SAFE_SPACING.md,
    fontSize: 16,
    color: SAFE_COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: SAFE_SPACING.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: SAFE_COLORS.surface,
    borderWidth: 1,
    borderColor: SAFE_COLORS.primary,
    padding: SAFE_SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SAFE_SPACING.md,
    gap: SAFE_SPACING.sm,
  },
  secondaryButtonText: {
    color: SAFE_COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  proofPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: SAFE_SPACING.md,
  },
  resolveButton: {
    backgroundColor: SAFE_COLORS.success,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
