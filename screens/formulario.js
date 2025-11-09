import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { registrarNotificacoes, enviarNotificacaoPush } from '../utils/notifications';

export default function Formulario({ navigation }) {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');
  const [expoToken, setExpoToken] = useState(null);

  const statusOptions = [
    { label: 'Disponível', value: 'DISPONIVEL', color: '#4CAF50' },
    { label: 'Reservada', value: 'RESERVADA', color: '#005ca7ff' },
    { label: 'Manutenção', value: 'MANUTENCAO', color: '#FFEB3B' },
    { label: 'Com danos estruturais', value: 'DANOS_ESTRUTURAIS', color: '#F44336' },
    { label: 'Indisponível', value: 'INDISPONIVEL', color: '#9E9E9E' },
    { label: 'Sinistro', value: 'SINISTRO', color: '#000' },
    { label: 'Falta de peça', value: 'FALTA_PECA', color: '#a91afcff' },
  ];

  // 🟢 Registrar token push ao abrir o formulário
  useEffect(() => {
    const registrarToken = async () => {
      let token = await AsyncStorage.getItem('@expo_push_token');
      if (!token) {
        token = await registrarNotificacoes();
        if (token) await AsyncStorage.setItem('@expo_push_token', token);
      }
      setExpoToken(token);
    };
    registrarToken();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !placa || !modelo || !localizacao || !status) {
      Alert.alert('Erro', 'Preencha todos os campos antes de salvar.');
      return;
    }

    try {
      const novaMoto = {
        id: Date.now().toString(),
        nome,
        placa,
        modelo,
        localizacao,
        status,
      };

      const motosSalvas = await AsyncStorage.getItem('@motos');
      const lista = motosSalvas ? JSON.parse(motosSalvas) : [];
      const novaLista = [...lista, novaMoto];
      await AsyncStorage.setItem('@motos', JSON.stringify(novaLista));

      // ✅ Enviar push real
      if (expoToken) {
        await enviarNotificacaoPush(
          expoToken,
          '🏍️ Nova moto adicionada!',
          `Modelo: ${modelo}\nPlaca: ${placa}\nResponsável: ${nome}`
        );
      }

      Alert.alert('Sucesso', 'Moto cadastrada com sucesso!');
      setNome('');
      setPlaca('');
      setModelo('');
      setLocalizacao('');
      setStatus('');
      navigation.navigate('Patio');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a moto.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]}>
      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Nome do Responsável</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Placa da Moto</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={placa}
        onChangeText={setPlaca}
        placeholder="Digite a placa"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Modelo da Moto</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={modelo}
        onChangeText={setModelo}
        placeholder="Digite o modelo"
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>Localização no Pátio</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder="Ex: Bloco A - Vaga 3"
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
            <Text style={{ color: option.value === 'MANUTENCAO' ? '#000' : '#fff', fontWeight: 'bold' }}>
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
  container: { flex: 1, padding: 20, justifyContent: 'center' },
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
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
