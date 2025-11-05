import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '../context/ThemeContext';

export default function Primeira({ navigation }) {
  const theme = useTheme();
  const handleComecar = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {/* Animação do título */}
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 900 }}
        style={[styles.title, { color: theme.colors.text }]}
      >
        Bem-vindo ao App da Mottu
      </MotiText>

      {/* Animação da descrição */}
      <MotiText
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000, delay: 300 }}
        style={[styles.description, { color: theme.colors.text }]}
      >
        Este é um aplicativo de demonstração com funcionalidades como login, pátio, formulário e configurações.
      </MotiText>

      {/* Animação do botão */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 600, damping: 12 }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.modoEscuro ? '#228b22' : '#228b22' },
          ]}
          onPress={handleComecar}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
