import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Componente para botões padronizados do sistema
const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'normal',
  disabled = false,
  style
}) => {
  // Determina o estilo com base no tipo (primary, secondary, danger)
  const buttonTypeStyle = 
    type === 'primary' ? styles.primaryButton :
    type === 'secondary' ? styles.secondaryButton :
    type === 'danger' ? styles.dangerButton : styles.primaryButton;
  
  // Determina o tamanho do botão (small, normal, large)
  const buttonSizeStyle = 
    size === 'small' ? styles.smallButton :
    size === 'large' ? styles.largeButton : styles.normalButton;
  
  // Estilo para botão desabilitado
  const disabledStyle = disabled ? styles.disabledButton : null;
  
  return (
    <TouchableOpacity
      style={[styles.button, buttonTypeStyle, buttonSizeStyle, disabledStyle, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text 
        style={[
          styles.buttonText, 
          type === 'secondary' ? styles.secondaryButtonText : styles.primaryButtonText,
          size === 'small' ? styles.smallButtonText : null,
          size === 'large' ? styles.largeButtonText : null,
          disabled ? styles.disabledButtonText : null
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#00A651',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00A651',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#666666',
    borderColor: '#666666',
    opacity: 0.7,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  normalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#00A651',
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: '#CCCCCC',
  },
});

export default Button;
