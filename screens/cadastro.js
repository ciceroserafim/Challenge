import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { MotiText, MotiView } from 'moti';

export default function CadastroUsuario({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', t('register.errors.fillFields'));
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', t('register.errors.passwordsNoMatch'));
      return;
    }
    if (cpf.length !== 11 || isNaN(Number(cpf))) {
      Alert.alert('Erro', t('register.errors.invalidCpf'));
      return;
    }

    try {
      // Salva o usuário localmente
      const usuario = { nome, cpf, email, senha };
      await AsyncStorage.setItem(`@usuario_${email}`, JSON.stringify(usuario));

      Alert.alert('Sucesso', t('register.success', { name }));
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', t('register.errors.registerError'));
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff', borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32', color: theme.modoEscuro ? '#fff' : '#222' }
  ];

  const placeholderColor = theme.modoEscuro ? '#fff' : '#222';

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
      >
        {t('register.title')}
      </MotiText>

      <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 1000, delay: 300 }}>
        <TextInput placeholder={t('register.name')} style={inputStyle} placeholderTextColor={placeholderColor} value={nome} onChangeText={setNome} />
        <TextInput placeholder={t('register.cpf')} style={inputStyle} placeholderTextColor={placeholderColor} value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={11} />
        <TextInput placeholder={t('register.email')} style={inputStyle} placeholderTextColor={placeholderColor} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder={t('register.password')} style={inputStyle} placeholderTextColor={placeholderColor} value={senha} onChangeText={setSenha} secureTextEntry />
        <TextInput placeholder={t('register.confirmPassword')} style={inputStyle} placeholderTextColor={placeholderColor} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
      </MotiView>

      <MotiView from={{ scale: 1 }} animate={{ scale: 1.05 }} transition={{ loop: true, type: 'timing', duration: 2000 }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]} onPress={handleCadastro} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{t('register.register')}</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  button: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
