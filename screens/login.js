import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthCredentials } from '../services/api';

export default function Login({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // ✅ Login automático
  useEffect(() => {
    const checkLogin = async () => {
      const loggedEmail = await AsyncStorage.getItem('@logado_email');
      if (loggedEmail) navigation.replace('Escolha');
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', t('login.errors.fillFields'));
      return;
    }

    const usuarioJSON = await AsyncStorage.getItem(`@usuario_${email}`);
    if (!usuarioJSON) {
      Alert.alert('Erro', t('login.errors.invalidUser'));
      return;
    }

    const usuario = JSON.parse(usuarioJSON);
    if (usuario.senha !== senha) {
      Alert.alert('Erro', t('login.errors.incorrectPassword'));
      return;
    }

    try {
      await setAuthCredentials({ email, password: senha });
      await AsyncStorage.setItem('@logado_email', email);
      navigation.replace('Escolha');
    } catch (error) {
      console.error('Erro ao configurar credenciais da API:', error);
      Alert.alert(
        'Erro',
        t('login.errors.apiCredentials') ||
          'Não foi possível configurar as credenciais de acesso à API. Verifique usuário e senha.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }}>
        <MotiText
          from={{ scale: 0.9 }}
          animate={{ scale: 1.05 }}
          transition={{ loop: true, type: 'timing', duration: 1600 }}
          style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
        >
          {t('login.title')}
        </MotiText>
      </MotiView>

      <TextInput
        style={[styles.input, { borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32', color: theme.modoEscuro ? '#fff' : '#222', backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}
        placeholder={t('login.email')}
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32', color: theme.modoEscuro ? '#fff' : '#222', backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}
        placeholder={t('login.password')}
        secureTextEntry
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t('login.login')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
        <Text style={[styles.link, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}>{t('login.forgotPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={[styles.link, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}>{t('login.noAccount')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1.5, marginBottom: 20, paddingHorizontal: 15, borderRadius: 12 },
  button: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  link: { textAlign: 'center', marginVertical: 8, fontSize: 15, textDecorationLine: 'underline' },
});
