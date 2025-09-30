import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CadastroUsuario() {
  const theme = useTheme();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = () => {
    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
    if (cpf.length !== 11 || isNaN(Number(cpf))) {
      Alert.alert('Erro', 'CPF inválido. Deve conter 11 números.');
      return;
    }
    Alert.alert('Sucesso', `Usuário ${nome} cadastrado com sucesso!`);
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff',
      borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
      color: theme.modoEscuro ? '#fff' : '#222', 
    },
  ];

  const placeholderColor = theme.modoEscuro ? '#fff' : '#222'; // Placeholder

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
            textShadowColor: theme.modoEscuro ? 'rgba(0,255,127,0.3)' : 'rgba(46,125,50,0.2)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 3,
          },
        ]}
      >
        Cadastro de Usuário
      </Text>

      <TextInput
        placeholder="Nome"
        style={inputStyle}
        placeholderTextColor={placeholderColor}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="CPF"
        style={inputStyle}
        placeholderTextColor={placeholderColor}
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        maxLength={11}
      />
      <TextInput
        placeholder="Email"
        style={inputStyle}
        placeholderTextColor={placeholderColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        style={inputStyle}
        placeholderTextColor={placeholderColor}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirmar Senha"
        style={inputStyle}
        placeholderTextColor={placeholderColor}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' },
        ]}
        onPress={handleCadastro}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
