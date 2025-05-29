import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { Audio } from 'expo-av';

const ResultScreen = ({ route, navigation }) => {
  const { qrData } = route.params || { qrData: { rawData: 'Dados inválidos' } };
  const [sound, setSound] = useState();
  const [guestInfo, setGuestInfo] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Simula processamento dos dados do QR code
  useEffect(() => {
    // Em uma implementação real, aqui faria uma requisição ao backend
    // para validar o QR code e obter informações do convidado
    
    // Simulação de dados para demonstração
    try {
      // Verifica se é um QR code válido do sistema
      if (qrData.guestId || qrData.name) {
        // Simula dados do convidado
        setGuestInfo({
          name: qrData.name || 'Guilherme Cruz',
          phone: qrData.phone || '(11) 99999-9999',
          status: qrData.status || 'authorized',
          eventName: qrData.eventName || 'Evento Teste',
        });
        
        setIsAuthorized(qrData.status !== 'denied');
        
        // Feedback sonoro e tátil de sucesso
        playSound(true);
        Vibration.vibrate(isAuthorized ? 200 : [100, 100, 100, 100, 100]);
      } else {
        // QR code inválido
        setGuestInfo(null);
        setIsAuthorized(false);
        
        // Feedback sonoro e tátil de erro
        playSound(false);
        Vibration.vibrate([100, 100, 100, 100, 100]);
      }
    } catch (error) {
      console.error('Erro ao processar QR code:', error);
      setGuestInfo(null);
      setIsAuthorized(false);
      playSound(false);
      Vibration.vibrate([100, 100, 100, 100, 100]);
    }
  }, [qrData]);

  // Função para tocar som de sucesso ou erro
  async function playSound(success) {
    const soundFile = success 
      ? require('../assets/success.mp3') 
      : require('../assets/error.mp3');
      
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  }

  // Limpa o som quando a tela é desmontada
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Função para lidar com a confirmação de entrada
  const handleConfirmEntry = () => {
    // Em uma implementação real, aqui registraria a entrada no backend
    
    // Feedback de confirmação
    Vibration.vibrate(100);
    
    // Volta para a tela de scanner
    navigation.replace('Scanner');
  };

  // Função para escanear outro QR code
  const handleScanAgain = () => {
    navigation.replace('Scanner');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.resultContainer, 
        isAuthorized ? styles.authorizedContainer : styles.deniedContainer
      ]}>
        <Text style={styles.statusText}>
          {isAuthorized ? 'AUTORIZADO' : 'NÃO AUTORIZADO'}
        </Text>
        
        {guestInfo ? (
          <View style={styles.guestInfoContainer}>
            <Text style={styles.nameText}>{guestInfo.name}</Text>
            <Text style={styles.phoneText}>{guestInfo.phone}</Text>
            <Text style={styles.eventText}>{guestInfo.eventName}</Text>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>QR Code inválido</Text>
            <Text style={styles.errorDetailText}>
              O QR code escaneado não é válido ou não pertence ao sistema.
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        {isAuthorized && guestInfo && (
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirmEntry}
          >
            <Text style={styles.confirmButtonText}>CONFIRMAR ENTRADA</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={handleScanAgain}
        >
          <Text style={styles.scanAgainButtonText}>
            {isAuthorized ? 'ESCANEAR PRÓXIMO' : 'TENTAR NOVAMENTE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'space-between',
  },
  resultContainer: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
  },
  authorizedContainer: {
    backgroundColor: 'rgba(0, 166, 81, 0.2)',
    borderColor: '#00A651',
  },
  deniedContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: '#FF0000',
  },
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  guestInfoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  eventText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorDetailText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#00A651',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    backgroundColor: '#333333',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
