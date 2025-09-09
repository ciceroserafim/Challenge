import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Escolha({ navigation }) {
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
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
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2E7D32', 
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#A5D6A7', 
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
