
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Formulario() {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');

  const statusOptions = [
    { label: 'Disponível', value: 'disponivel', color: '#4CAF50' },        
    { label: 'Reservada', value: 'reservada', color: '#005ca7ff' },          
    { label: 'Manutenção', value: 'manutencao', color: '#FFEB3B' },        
    { label: ' Com danos estruturais', value: 'danos_estruturais', color: '#F44336' }, 
    { label: 'Indisponível', value: 'indisponivel', color: '#9E9E9E' },   
    { label: 'Sinistro', value: 'sinistro', color: '#000' },               
    { label: 'Falta de peça', value: 'falta_peca', color: '#a91afcff'},
  ];

  const handleSalvar = () => {
    console.log({ nome, placa, modelo, localizacao, status });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]}>
      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Nome do Responsável</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#888' : '#ccc' }]}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Placa da Moto</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#888' : '#ccc' }]}
        value={placa}
        onChangeText={setPlaca}
        placeholder="Digite a placa"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Modelo da Moto</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#888' : '#ccc' }]}
        value={modelo}
        onChangeText={setModelo}
        placeholder="Digite o modelo"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Localização no Pátio</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#888' : '#ccc' }]}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder="Digite a localização"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Status da Moto</Text>
      <View style={styles.statusContainer}>
        {statusOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              { backgroundColor: option.color, borderWidth: status === option.value ? 3 : 0 }
            ]}
            onPress={() => setStatus(option.value)}
          >
            <Text style={{ color: option.value === 'manutencao' ? '#000' : '#fff', fontWeight: 'bold' }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  label: { marginBottom: 5, fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 15, width: '100%' },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
    minWidth: '30%',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#A5D6A7', 
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 13,
    width: '85%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
