import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EsqueciSenha({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRecuperarSenha = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail.');
      return;
    }

    try {
      const usuarioJSON = await AsyncStorage.getItem(`@usuario_${email}`);
      if (!usuarioJSON) {
        Alert.alert('Erro', 'E-mail não cadastrado.');
        return;
      }

      const usuario = JSON.parse(usuarioJSON);
      Alert.alert(
        'Recuperação de Senha',
        `Sua senha cadastrada é: ${usuario.senha}`
      );

      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível recuperar a senha.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Enviar" onPress={handleRecuperarSenha} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8 },
});
