import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function Formulario() {
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');

  const handleSalvar = () => {
    console.log({ nome, placa, modelo, localizacao, status });
    // Aqui você pode adicionar lógica para salvar os dados
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Responsável</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Placa da Moto</Text>
      <TextInput
        style={styles.input}
        value={placa}
        onChangeText={setPlaca}
        placeholder="Digite a placa"
      />

      <Text style={styles.label}>Modelo da Moto</Text>
      <TextInput
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
        placeholder="Digite o modelo"
      />

      <Text style={styles.label}>Localização no Pátio</Text>
      <TextInput
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder="Digite a localização"
      />

      <Text style={styles.label}>Status da Moto</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Digite o status"
      />

      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
});
