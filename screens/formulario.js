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
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#888' : '#ccc' }]}
        value={status}
        onChangeText={setStatus}
        placeholder="Digite o status"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      
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
