import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Alert } from 'react-native';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';

// Tela de edição de configurações
const EditSettingsScreen = ({ route, navigation }) => {
  // Recebe os valores atuais e a função de callback
  const { serverUrl: initialServerUrl, apiKey: initialApiKey, offlineMode: initialOfflineMode, onSave } = route.params || {};
  
  // Estados para os campos de configuração
  const [serverUrl, setServerUrl] = useState(initialServerUrl || '');
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [offlineMode, setOfflineMode] = useState(initialOfflineMode || false);
  
  // Função para salvar as configurações
  const handleSave = () => {
    // Validação básica
    if (!offlineMode && !serverUrl) {
      Alert.alert('Erro', 'URL do servidor é obrigatória no modo online.');
      return;
    }
    
    // Chama o callback com as novas configurações
    if (onSave) {
      onSave({
        serverUrl,
        apiKey,
        offlineMode
      });
    }
    
    // Volta para a tela anterior
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <InfoCard title="Modo de Operação">
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Modo Offline</Text>
          <Switch
            trackColor={{ false: '#333333', true: '#00A651' }}
            thumbColor={offlineMode ? '#FFFFFF' : '#CCCCCC'}
            onValueChange={setOfflineMode}
            value={offlineMode}
          />
        </View>
        <Text style={styles.helpText}>
          {offlineMode 
            ? 'No modo offline, os QR codes são validados localmente sem conexão com o servidor.'
            : 'No modo online, os QR codes são validados em tempo real com o servidor.'}
        </Text>
      </InfoCard>
      
      <InfoCard title="Configurações de Servidor" style={offlineMode ? styles.disabledCard : null}>
        <Text style={styles.inputLabel}>URL do Servidor:</Text>
        <TextInput
          style={[styles.input, offlineMode ? styles.disabledInput : null]}
          value={serverUrl}
          onChangeText={setServerUrl}
          placeholder="https://api.secgenesis.com"
          placeholderTextColor="#666666"
          editable={!offlineMode}
        />
        
        <Text style={styles.inputLabel}>Chave de API:</Text>
        <TextInput
          style={[styles.input, offlineMode ? styles.disabledInput : null]}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Insira sua chave de API"
          placeholderTextColor="#666666"
          secureTextEntry
          editable={!offlineMode}
        />
      </InfoCard>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Salvar Configurações" 
          onPress={handleSave}
          type="primary"
        />
        
        <Button 
          title="Cancelar" 
          onPress={() => navigation.goBack()}
          type="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  helpText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 5,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  disabledCard: {
    opacity: 0.6,
  },
  disabledInput: {
    backgroundColor: '#222222',
    color: '#666666',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default EditSettingsScreen;
