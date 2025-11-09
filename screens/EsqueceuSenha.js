import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';

export default function EsqueciSenha({ navigation }) {
  const { t } = useI18n();
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handleRecuperarSenha = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', t('forgotPassword.errors.fillEmail'));
      return;
    }

    try {
      const usuarioJSON = await AsyncStorage.getItem(`@usuario_${email}`);
      if (!usuarioJSON) {
        Alert.alert('Erro', t('forgotPassword.errors.emailNotRegistered'));
        return;
      }

      const usuario = JSON.parse(usuarioJSON);
      Alert.alert(
        t('forgotPassword.recoveryTitle'),
        t('forgotPassword.recoveryMessage', { password: usuario.senha })
      );

      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', t('forgotPassword.errors.recoveryError'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('forgotPassword.title')}</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff', color: theme.modoEscuro ? '#fff' : '#000', borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
        placeholder={t('forgotPassword.email')}
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title={t('forgotPassword.send')} onPress={handleRecuperarSenha} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 20, borderRadius: 8 },
});
