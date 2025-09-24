import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Escolha({ navigation }) {
  const theme = useTheme();
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]} // Cor do fundo da tela
    >
      <Text style={styles.title}>   Escolha uma Opção  </Text>
      <Text style={styles.subtitle}>Navegue pelas seções do aplicativo</Text>

  

      <TouchableOpacity style={styles.button} onPress={() => navigateTo('Patio')}>
        <Text style={styles.buttonText}>📍 Ir para Pátio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateTo('Desenvolvedores')}>
        <Text style={styles.buttonText}>👥 Desenvolvedores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateTo('Formulario')}>
        <Text style={styles.buttonText}>📝 Preencher Formulário</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateTo('Configuracao')}>
        <Text style={styles.buttonText}>⚙️ Configurações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2E7D32', 
    shadowColor: '#000',
  },
  subtitle: {
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#A5D6A7', 
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 13,
    width: '85%',
    height: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    textAlign: 'center', 
    },
  buttonText: {
    color: '#1B5E20',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
