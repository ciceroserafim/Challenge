import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView, MotiText } from 'moti';

export default function Escolha({ navigation }) {
  const { modoEscuro, setModoEscuro } = useTheme(); // pega direto do contexto
  const { t } = useI18n();
  const [temaAtivo, setTemaAtivo] = useState(modoEscuro);

  useEffect(() => {
    const carregarTema = async () => {
      const temaSalvo = await AsyncStorage.getItem('modoEscuro');
      if (temaSalvo !== null) {
        const modoSalvo = JSON.parse(temaSalvo);
        setTemaAtivo(modoSalvo);
        setModoEscuro(modoSalvo); // sincroniza com o contexto global
      }
    };
    carregarTema();
  }, []);

  useEffect(() => {
    setTemaAtivo(modoEscuro);
  }, [modoEscuro]);

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const cards = [
    { label: t('choice.patio'), screen: 'Patio', color: '#4CAF50', desc: t('choice.patioDesc') },
    { label: t('choice.form'), screen: 'Formulario', color: '#388E3C', desc: t('choice.formDesc') },
    { label: t('choice.developers'), screen: 'Desenvolvedores', color: '#43A047', desc: t('choice.developersDesc') },
    { label: t('choice.settings'), screen: 'Configuracao', color: '#2E7D32', desc: t('choice.settingsDesc') },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: temaAtivo ? '#111' : '#fefefe' },
      ]}
    >
      {/* Cabeçalho */}
      <MotiView
        from={{ opacity: 0, translateY: -40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[
          styles.headerContainer,
          { backgroundColor: temaAtivo ? '#1e1e1e' : '#C8E6C9' },
        ]}
      >
        <MotiText
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={[
            styles.title,
            { color: temaAtivo ? '#00FF7F' : '#2E7D32' },
          ]}
        >
          {t('choice.title')}
        </MotiText>

        <Text
          style={[
            styles.subtitle,
            { color: temaAtivo ? '#7FFFD4' : '#2E7D32' },
          ]}
        >
          {t('choice.subtitle')}
        </Text>
      </MotiView>

      {/* Cards */}
      <ScrollView
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card, index) => (
          <MotiView
            key={card.screen}
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 700,
              delay: 500 + index * 150,
            }}
          >
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: temaAtivo ? '#1a1a1a' : '#E8F5E9',
                  borderColor: card.color,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => navigateTo(card.screen)}
            >
              <Text style={[styles.cardTitle, { color: card.color }]}>
                {card.label}
              </Text>
              <Text
                style={[
                  styles.cardDesc,
                  { color: temaAtivo ? '#ccc' : '#444' },
                ]}
              >
                {card.desc}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    width: '90%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  cardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    width: 320,
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    textAlign: 'center',
  },
});
