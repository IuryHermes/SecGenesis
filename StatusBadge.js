import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Componente para exibir o status do convidado (autorizado, negado, etc.)
const StatusBadge = ({ status, style }) => {
  // Define o estilo com base no status
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case 'authorized':
      case 'autorizado':
        return styles.authorizedBadge;
      case 'denied':
      case 'negado':
        return styles.deniedBadge;
      case 'pending':
      case 'pendente':
        return styles.pendingBadge;
      default:
        return styles.defaultBadge;
    }
  };

  // Define o texto a ser exibido com base no status
  const getStatusText = () => {
    switch (status.toLowerCase()) {
      case 'authorized':
      case 'autorizado':
        return 'AUTORIZADO';
      case 'denied':
      case 'negado':
        return 'ACESSO NEGADO';
      case 'pending':
      case 'pendente':
        return 'PENDENTE';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <View style={[styles.badge, getStatusStyle(), style]}>
      <Text style={styles.badgeText}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  authorizedBadge: {
    backgroundColor: '#00A651',
  },
  deniedBadge: {
    backgroundColor: '#FF3B30',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  defaultBadge: {
    backgroundColor: '#8E8E93',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default StatusBadge;
