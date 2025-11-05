import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView, MotiText } from 'moti';

export default function Escolha({ navigation }) {
  const theme = useTheme();

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const botoes = [
    { label: '📍 Ir para Pátio', screen: 'Patio', color: '#4CAF50' },
    { label: '👥 Desenvolvedores', screen: 'Desenvolvedores', color: '#4CAF50' },
    { label: '📝 Preencher Formulário', screen: 'Formulario', color: '#4CAF50' },
    { label: '⚙️ Configurações', screen: 'Configuracao', color: '#4CAF50' },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.modoEscuro ? '#222' : '#fefefe' }]}
    >
      <MotiView
        from={{ opacity: 0, translateY: -40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[
          styles.headerContainer,
          { backgroundColor: theme.modoEscuro ? '#333' : '#A5D6A7' },
        ]}
      >
        <MotiText
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
        >
          Escolha uma Opção
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 400 }}
          style={[styles.subtitle, { color: theme.modoEscuro ? '#7FFFD4' : '#fff' }]}
        >
          Navegue pelas seções do aplicativo
        </MotiText>
      </MotiView>

      {botoes.map((btn, index) => (
        <MotiView
          key={btn.screen}
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 700,
            delay: 600 + index * 150, // efeito cascata 💫
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: btn.color }]}
            activeOpacity={0.85}
            onPress={() => navigateTo(btn.screen)}
          >
            <MotiText
              from={{ opacity: 0.7, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ loop: true, duration: 2000, type: 'timing' }}
              style={styles.buttonText}
            >
              {btn.label}
            </MotiText>
          </TouchableOpacity>
        </MotiView>
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
