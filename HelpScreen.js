import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InfoCard from '../components/InfoCard';
import Button from '../components/Button';

// Tela de ajuda com instruções para os seguranças
const HelpScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajuda e Instruções</Text>
      
      <InfoCard title="Como Escanear QR Codes">
        <Text style={styles.instructionText}>
          1. Na tela inicial, toque no botão "INICIAR LEITURA"
        </Text>
        <Text style={styles.instructionText}>
          2. Posicione o QR code do convidado dentro da área de leitura
        </Text>
        <Text style={styles.instructionText}>
          3. Aguarde a leitura automática do código
        </Text>
        <Text style={styles.instructionText}>
          4. Verifique o nome do convidado na tela de resultado
        </Text>
        <Text style={styles.instructionText}>
          5. Toque em "CONFIRMAR ENTRADA" para liberar o acesso
        </Text>
      </InfoCard>
      
      <InfoCard title="Problemas Comuns">
        <Text style={styles.sectionTitle}>QR Code não é lido:</Text>
        <Text style={styles.instructionText}>
          • Verifique se o código está limpo e sem danos
        </Text>
        <Text style={styles.instructionText}>
          • Ajuste a distância entre o celular e o QR code
        </Text>
        <Text style={styles.instructionText}>
          • Em ambientes escuros, use o botão "LIGAR FLASH"
        </Text>
        
        <Text style={styles.sectionTitle}>Convidado não autorizado:</Text>
        <Text style={styles.instructionText}>
          • Verifique se o nome corresponde ao documento de identidade
        </Text>
        <Text style={styles.instructionText}>
          • Consulte o organizador do evento para confirmação
        </Text>
        <Text style={styles.instructionText}>
          • Oriente o convidado a contatar quem enviou o convite
        </Text>
      </InfoCard>
      
      <InfoCard title="Modo Offline">
        <Text style={styles.instructionText}>
          Se estiver operando em modo offline, o aplicativo validará os QR codes localmente, sem necessidade de conexão com a internet.
        </Text>
        <Text style={styles.instructionText}>
          Neste modo, certifique-se de que a lista de convidados foi previamente sincronizada quando havia conexão disponível.
        </Text>
      </InfoCard>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Voltar para o Início" 
          onPress={() => navigation.navigate('Home')}
          type="primary"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A651',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#00A651',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default HelpScreen;
