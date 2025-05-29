import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Componente para exibir um cartão de informação
const InfoCard = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00A651',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default InfoCard;
