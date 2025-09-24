import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const desenvolvedores = [
  { id: '1', nome: 'Cicero Serafim', rm: '556996', foto: require('../images/cicero.jpeg') },
  { id: '2', nome: 'Eduardo Monteiro', rm: '555871', foto: require('../images/eduardo.jpeg') },
  { id: '3', nome: 'Murillo Sant Anna', rm: '557183', foto: require('../images/murillo.jpg') },
];

export default function Desenvolvedores() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.titulo, { color: theme.colors.text }]}>
        🏍️ Desenvolvedores do Projeto 💨
      </Text>
      <FlatList
        data={desenvolvedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
            <Image source={item.foto} style={styles.foto} />
            <View style={styles.textoContainer}>
              <Text style={[styles.nome, { color: theme.colors.text }]}>{item.nome}</Text>
              <Text style={[styles.rm, { color: theme.colors.text }]}>RM: {item.rm}</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#66BB6A',
  },
  foto: {
    width: 90,
    height: 90,
    borderRadius: 70,
    marginRight: 25,
  },
  textoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 25,
    fontWeight: '700',
  },
  rm: {
    fontSize: 20,
    marginTop: 5,
  },
});
