import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

export default function Primeira({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const handleComecar = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Fundo com gradiente animado */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1200 }}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={['#a8f0c6', '#7edfa3', '#4bc27b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>

      {/* Título animado */}
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 900 }}
        style={[styles.title, { color: '#084c24' }]}
      >
        {t('welcome.title')}
      </MotiText>

      {/* Descrição animada */}
      <MotiText
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000, delay: 300 }}
        style={[styles.description, { color: '#0c5e2c' }]}
      >
        {t('welcome.description')}
      </MotiText>

      {/* Botão com efeito pulse */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 600, damping: 12 }}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            type: 'timing',
            duration: 1500,
            loop: true,
            repeatReverse: true,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleComecar}
          >
            <Text style={styles.buttonText}>{t('welcome.start')}</Text>
          </TouchableOpacity>
        </MotiView>
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
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 6,
    backgroundColor: '#0c802a',
    shadowColor: '#084c24',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
