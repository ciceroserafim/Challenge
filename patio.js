import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

export default function Patio() {
  const [motos, setMotos] = useState([
    { id: '1', placa: 'ABC-1234', modelo: 'Honda CG 160', localizacao: 'Bloco A - Vaga 1', status: 'DISPONIVEL', setor: 'Setor A' },
  { id: '2', placa: 'DEF-5678', modelo: 'Yamaha Factor 125', localizacao: 'Bloco B - Vaga 3', status: 'RESERVADA', setor: 'Setor B' },
  { id: '3', placa: 'GHI-9012', modelo: 'Mottu Sport 110i', localizacao: 'Bloco C - Vaga 5', status: 'MANUTENCAO', setor: 'Setor C' },
  { id: '4', placa: 'JKL-3456', modelo: 'Honda Biz 110i', localizacao: 'Bloco D - Vaga 2', status: 'DANOS_ESTRUTURAIS', setor: 'Setor F' },
  { id: '5', placa: 'MNO-7890', modelo: 'Yamaha NEO 125', localizacao: 'Bloco E - Vaga 2', status: 'FALTA_PECA', setor: 'Setor D' },
  { id: '6', placa: 'PQR-2345', modelo: 'Honda Pop 110i', localizacao: 'Bloco F - Vaga 2', status: 'INDISPONIVEL', setor: 'Setor E' },
  { id: '7', placa: 'STU-6789', modelo: 'Shineray XY 125', localizacao: 'Bloco G - Vaga 2', status: 'SINISTRO', setor: 'Setor G' },
  { id: '8', placa: 'VWX-1122', modelo: 'Suzuki Yes 125', localizacao: 'Bloco A - Vaga 2', status: 'DISPONIVEL', setor: 'Setor A' },
  { id: '9', placa: 'YZA-3344', modelo: 'Haojue DK 150', localizacao: 'Bloco B - Vaga 4', status: 'RESERVADA', setor: 'Setor B' },
  { id: '10', placa: 'BCD-5566', modelo: 'Honda PCX 150', localizacao: 'Bloco C - Vaga 1', status: 'MANUTENCAO', setor: 'Setor C' },
  { id: '11', placa: 'EFG-7788', modelo: 'Yamaha Fazer 250', localizacao: 'Bloco D - Vaga 4', status: 'FALTA_PECA', setor: 'Setor D' },
  { id: '12', placa: 'HIJ-9900', modelo: 'Honda XRE 190', localizacao: 'Bloco E - Vaga 3', status: 'INDISPONIVEL', setor: 'Setor E' },
]);

const statusColors = {
  DISPONIVEL: 'green',
  RESERVADA: 'blue',
  MANUTENCAO: 'yellow',
  FALTA_PECA: 'purple',
  INDISPONIVEL: 'gray',
  DANOS_ESTRUTURAIS: 'red',
  SINISTRO: 'black',
};

  const renderItem = ({ item }) => {
  const statusColor = statusColors[item.status] || 'gray';

  return (
    <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: statusColor }]}>
      <Text style={styles.text}>Placa: {item.placa}</Text>
      <Text style={styles.text}>Modelo: {item.modelo}</Text>
      <Text style={styles.text}>Localização: {item.localizacao}</Text>
      <Text style={styles.text}>Setor: {item.setor}</Text>
      <Text style={[styles.text, { color: statusColor }]}>Status: {item.status}</Text>
      <Button title="Detalhes" onPress={() => alert(`Moto ${item.placa}`)} />
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motos no Pátio</Text>
      <FlatList
        data={motos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
