import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView, MotiText } from 'moti';

export default function Escolha({ navigation }) {
  const theme = useTheme();

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const cards = [
    { label: '📍 Ir para Pátio', screen: 'Patio', color: '#4CAF50', desc: 'Gerencie o pátio e visualize as motos.' },
    { label: '👥 Desenvolvedores', screen: 'Desenvolvedores', color: '#43A047', desc: 'Conheça quem criou o aplicativo.' },
    { label: '📝 Preencher Formulário', screen: 'Formulario', color: '#388E3C', desc: 'Adicione novas informações facilmente.' },
    { label: '⚙️ Configurações', screen: 'Configuracao', color: '#2E7D32', desc: 'Ajuste o tema e preferências do app.' },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.modoEscuro ? '#111' : '#fefefe' },
      ]}
    >
      {/* Cabeçalho */}
      <MotiView
        from={{ opacity: 0, translateY: -40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[
          styles.headerContainer,
          { backgroundColor: theme.modoEscuro ? '#1e1e1e' : '#C8E6C9' },
        ]}
      >
        <MotiText
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={[
            styles.title,
            { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' },
          ]}
        >
          Escolha uma Opção
        </MotiText>

        <Text
          style={[
            styles.subtitle,
            { color: theme.modoEscuro ? '#7FFFD4' : '#2E7D32' },
          ]}
        >
          Navegue pelas seções do aplicativo
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
                  backgroundColor: theme.modoEscuro ? '#1a1a1a' : '#E8F5E9',
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
                  { color: theme.modoEscuro ? '#ccc' : '#444' },
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
    width: 300,
    height: 130,
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
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 15,
    textAlign: 'center',
  },
});
