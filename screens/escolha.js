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
      style={[styles.container, { backgroundColor: theme.modoEscuro ? '#222' : '#fefefe' }]}
    >
      
      <View style={[styles.headerContainer, { backgroundColor: theme.modoEscuro ? '#333' : '#A5D6A7' }]}>
        <Text style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
          Escolha uma Opção
        </Text>
        <Text style={[styles.subtitle, { color: theme.modoEscuro ? '#7FFFD4' : '#fff' }]}>
          Navegue pelas seções do aplicativo
        </Text>
      </View>

      {[
        { label: '📍 Ir para Pátio', screen: 'Patio', color: '#4CAF50' },
        { label: '👥 Desenvolvedores', screen: 'Desenvolvedores', color: '#4CAF50' },
        { label: '📝 Preencher Formulário', screen: 'Formulario', color: '#4CAF50' },
        { label: '⚙️ Configurações', screen: 'Configuracao', color: '#4CAF50' },
      ].map((btn) => (
        <TouchableOpacity
          key={btn.screen}
          style={[styles.button, { backgroundColor: btn.color }]}
          activeOpacity={0.8}
          onPress={() => navigateTo(btn.screen)}
        >
          <Text style={styles.buttonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
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
  headerContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,255,127,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 23,
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(127,255,212,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 11,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
