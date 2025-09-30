import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Patio() {
  const theme = useTheme();
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
    DISPONIVEL: '#4CAF50',
    RESERVADA: '#2196F3',
    MANUTENCAO: '#FFC107',
    FALTA_PECA: '#9C27B0',
    INDISPONIVEL: '#9E9E9E',
    DANOS_ESTRUTURAIS: '#F44336',
    SINISTRO: '#000',
  };

  const renderItem = ({ item }) => {
    const statusColor = statusColors[item.status] || '#9E9E9E';
    const cardBackground = theme.modoEscuro ? '#444' : '#f9f9f9';
    const textColor = theme.modoEscuro ? '#fff' : '#222';

    return (
      <View style={[styles.card, { backgroundColor: cardBackground, borderLeftColor: statusColor }]}>
        <Text style={[styles.text, { color: textColor, fontWeight: 'bold' }]}>{item.modelo}</Text>
        <Text style={[styles.text, { color: textColor }]}>Placa: {item.placa}</Text>
        <Text style={[styles.text, { color: textColor }]}>Localização: {item.localizacao}</Text>
        <Text style={[styles.text, { color: textColor }]}>Setor: {item.setor}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#1B5E20' }]}
          activeOpacity={0.7}
          onPress={() => alert(`Moto ${item.placa}`)}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>🔍 Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const containerBg = theme.modoEscuro ? '#222' : '#fff';
  const titleColor = theme.modoEscuro ? '#00FF7F' : '#2E7D32';

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <Text style={[styles.title, { color: titleColor }]}>Motos no Pátio</Text>
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
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,255,127,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
