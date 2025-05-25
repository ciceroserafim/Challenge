import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const desenvolvedores = [
  { id: '1', nome: 'Cicero', rm: '556996', foto: require('./assets/cicero.jpeg') },
  { id: '2', nome: 'Eduardo', rm: '555871', foto: require('./assets/eduardo.jpeg') },
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
    backgroundColor: '#E6F4EA',
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
    padding: 25,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  textoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  rm: {
    fontSize: 18,
    color: '#444',
    marginTop: 5,
  },
});
