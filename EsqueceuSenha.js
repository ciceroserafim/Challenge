import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

export default function EsqueciSenha({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRecuperarSenha = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail.');
      return;
    }

    // Simula envio de recuperação
    Alert.alert(
      'Recuperação de Senha',
      `Se o e-mail ${email} estiver cadastrado, enviaremos instruções para redefinir sua senha.`
    );

    // Opcional: voltar para login
    navigation.navigate('Login');
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
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
});
