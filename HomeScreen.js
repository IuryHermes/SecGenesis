import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SecGenesis</Text>
        <Text style={styles.subtitle}>Controle de Acesso com QR Code</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Bem-vindo ao sistema de controle de acesso SecGenesis.
        </Text>
        <Text style={styles.infoText}>
          Use este aplicativo para escanear os QR codes dos convidados na entrada do evento.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Text style={styles.scanButtonText}>INICIAR LEITURA</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00A651',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginVertical: 30,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#00A651',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
});

export default HomeScreen;
