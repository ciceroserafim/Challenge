import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from './ThemeContext';

const theme = useTheme();
const desenvolvedores = [
  { id: '1', nome: 'Cicero Serafim', rm: '556996', foto: require('./assets/cicero.jpeg') },
  { id: '2', nome: 'Eduardo Monteiro', rm: '555871', foto: require('./assets/eduardo.jpeg') },
  { id: '2', nome: 'Murillo Sant Anna', rm: '557183', foto: require('./assets/murillo.jpg') },
];

export default function Desenvolvedores() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}> 🏍️ Desenvolvedores do Projeto 💨</Text>
      <FlatList
        data={desenvolvedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.foto} style={styles.foto} />
            <View style={styles.textoContainer}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.rm}>RM: {item.rm}</Text>
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
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2E7D32',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
    color: '#2E7D32',
  },
  rm: {
    fontSize: 20,
    color: '#444',
    marginTop: 5,
  },
});
