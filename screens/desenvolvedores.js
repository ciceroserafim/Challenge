import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

const desenvolvedores = [
  { id: '1', nome: 'Cicero Serafim', rm: '556996', foto: require('../images/cicero.jpeg') },
  { id: '2', nome: 'Eduardo Monteiro', rm: '555871', foto: require('../images/eduardo.jpeg') },
  { id: '3', nome: 'Murillo Sant Anna', rm: '557183', foto: require('../images/murillo.jpg') },
];

export default function Desenvolvedores() {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#222' : '#fefefe' }]}>
      <Text
        style={[
          styles.titulo,
          {
            color: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
            textShadowColor: theme.modoEscuro ? 'rgba(0,255,127,0.4)' : 'rgba(46,125,50,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 3,
          },
        ]}
      >
        {t('developers.title')}
      </Text>

      <FlatList
        data={desenvolvedores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.modoEscuro ? '#333' : '#fff',
                borderLeftColor: theme.modoEscuro ? '#00FF7F' : '#66BB6A',
              },
            ]}
          >
            <Image source={item.foto} style={styles.foto} />
            <View style={styles.textoContainer}>
              <Text style={[styles.nome, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {item.nome}
              </Text>
              <Text style={[styles.rm, { color: theme.modoEscuro ? '#ccc' : '#555' }]}>
                {t('developers.rm')}: {item.rm}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 45,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderLeftWidth: 6,
  },
  foto: {
    width: 97,
    height: 98,
    borderRadius: 45,
    marginRight: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  textoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 24,
    fontWeight: '700',
  },
  rm: {
    fontSize: 20,
    marginTop: 7,
  },
});
