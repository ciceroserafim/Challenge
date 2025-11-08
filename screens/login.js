import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // ✅ Checa login automático ao abrir
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const loggedEmail = await AsyncStorage.getItem('@logado_email');
        if (loggedEmail) {
          // Usuário já está logado
          navigation.replace('Escolha');
        }
      } catch (error) {
        console.error('Erro ao checar login:', error);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      // Busca usuário localmente
      const usuarioJSON = await AsyncStorage.getItem(`@usuario_${email}`);
      if (!usuarioJSON) {
        Alert.alert('Erro', 'Usuário inválido ou não cadastrado.');
        return;
      }

      const usuario = JSON.parse(usuarioJSON);
      if (usuario.senha !== senha) {
        Alert.alert('Erro', 'Senha incorreta.');
        return;
      }

      // Login válido: salva email logado
      await AsyncStorage.setItem('@logado_email', email);

      navigation.replace('Escolha'); // Vai para a tela principal
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 900 }}>
        <MotiText from={{ scale: 0.9, opacity: 0.7 }} animate={{ scale: 1.05, opacity: 1 }} transition={{ loop: true, type: 'timing', duration: 1600 }} style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
          Bem-vindo!
        </MotiText>
      </MotiView>

      <TextInput
        style={[styles.input, { borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32', color: theme.modoEscuro ? '#fff' : '#222', backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}
        placeholder="Email"
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32', color: theme.modoEscuro ? '#fff' : '#222', backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
        <Text style={[styles.link, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32', textDecorationLine: 'underline' }]}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={[styles.link, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32', textDecorationLine: 'underline' }]}>Não tem cadastro? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1.5, marginBottom: 20, paddingHorizontal: 15, borderRadius: 12, fontSize: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  button: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  link: { textAlign: 'center', marginVertical: 8, fontSize: 15 },
});
