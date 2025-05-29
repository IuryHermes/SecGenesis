import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Importar telas
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditSettingsScreen from './src/screens/EditSettingsScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createStackNavigator();

// Definição das cores do tema SecGenesis
const theme = {
  colors: {
    primary: '#00A651', // Verde
    secondary: '#000000', // Preto
    background: '#121212', // Fundo escuro
    card: '#1E1E1E', // Cartões escuros
    text: '#FFFFFF', // Texto branco
    border: '#333333', // Bordas escuras
    notification: '#00A651', // Notificações em verde
  }
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.secondary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'SecGenesis',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen} 
          options={{ 
            title: 'Escanear QR Code',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ 
            title: 'Resultado',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            title: 'Configurações',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="EditSettings" 
          component={EditSettingsScreen} 
          options={{ 
            title: 'Editar Configurações',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen} 
          options={{ 
            title: 'Ajuda',
            headerTitleAlign: 'center'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
