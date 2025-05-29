import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import LoadingOverlay from '../components/LoadingOverlay';

// Configurações do aplicativo
const SettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Carrega as configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);
  
  // Função para carregar configurações
  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Carrega configurações do AsyncStorage
      const savedServerUrl = await AsyncStorage.getItem('serverUrl');
      const savedApiKey = await AsyncStorage.getItem('apiKey');
      const savedOfflineMode = await AsyncStorage.getItem('offlineMode');
      
      if (savedServerUrl) setServerUrl(savedServerUrl);
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedOfflineMode) setOfflineMode(savedOfflineMode === 'true');
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as configurações.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para salvar configurações
  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Salva configurações no AsyncStorage
      await AsyncStorage.setItem('serverUrl', serverUrl);
      await AsyncStorage.setItem('apiKey', apiKey);
      await AsyncStorage.setItem('offlineMode', offlineMode.toString());
      
      Alert.alert('Sucesso', 'Configurações salvas com sucesso.');
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para limpar todas as configurações
  const clearSettings = async () => {
    try {
      Alert.alert(
        'Confirmar Redefinição',
        'Tem certeza que deseja redefinir todas as configurações?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Redefinir', 
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              
              // Remove todas as configurações do AsyncStorage
              await AsyncStorage.removeItem('serverUrl');
              await AsyncStorage.removeItem('apiKey');
              await AsyncStorage.removeItem('offlineMode');
              
              // Redefine os estados
              setServerUrl('');
              setApiKey('');
              setOfflineMode(false);
              
              Alert.alert('Sucesso', 'Configurações redefinidas com sucesso.');
              setLoading(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao redefinir configurações:', error);
      Alert.alert('Erro', 'Não foi possível redefinir as configurações.');
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} message="Processando..." />
      
      <InfoCard title="Modo de Operação">
        <Text style={styles.infoText}>
          O aplicativo está configurado para operar em modo 
          {offlineMode ? ' offline' : ' online'}.
        </Text>
        <Text style={styles.infoText}>
          {offlineMode 
            ? 'No modo offline, os QR codes são validados localmente sem conexão com o servidor.'
            : 'No modo online, os QR codes são validados em tempo real com o servidor.'}
        </Text>
      </InfoCard>
      
      <InfoCard title="Configurações de Servidor">
        <Text style={styles.labelText}>URL do Servidor:</Text>
        <Text style={styles.valueText}>{serverUrl || 'Não configurado'}</Text>
        
        <Text style={styles.labelText}>Chave de API:</Text>
        <Text style={styles.valueText}>{apiKey ? '••••••••' : 'Não configurada'}</Text>
      </InfoCard>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Editar Configurações" 
          onPress={() => navigation.navigate('EditSettings', {
            serverUrl,
            apiKey,
            offlineMode,
            onSave: (newSettings) => {
              setServerUrl(newSettings.serverUrl);
              setApiKey(newSettings.apiKey);
              setOfflineMode(newSettings.offlineMode);
              saveSettings();
            }
          })}
          type="primary"
        />
        
        <Button 
          title="Redefinir Configurações" 
          onPress={clearSettings}
          type="danger"
        />
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>SecGenesis v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  labelText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 10,
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  versionContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    color: '#666666',
    fontSize: 14,
  },
});

export default SettingsScreen;
