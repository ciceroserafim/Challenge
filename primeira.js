import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';


export default function Primeira({ navigation }) {
  const theme = useTheme();
  const handleComecar = () => {
    navigation.navigate('Login');
  };

 return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Bem-vindo ao App da Mottu</Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        Este é um aplicativo de demonstração com funcionalidades como login, pátio, formulário e configurações.
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.modoEscuro ? '#228b22' : '#228b22' }]} onPress={handleComecar}>
        <Text style={styles.buttonText}>Começar</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
  },
  button: {
    backgroundColor: '#',
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
