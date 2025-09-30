import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Login({ navigation }) {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Tentativa de login com:', username, password);
    navigation.navigate('Escolha');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
            textShadowColor: theme.modoEscuro ? 'rgba(0,255,127,0.4)' : 'rgba(46,125,50,0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          },
        ]}
      >
        Bem-vindo!
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
            color: theme.modoEscuro ? '#fff' : '#222',
            backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff',
          },
        ]}
        placeholder="Usuário"
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
            color: theme.modoEscuro ? '#fff' : '#222',
            backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff',
          },
        ]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={theme.modoEscuro ? '#aaa' : '#888'}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' },
        ]}
        activeOpacity={0.8}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('Esqueceu a senha?')}>
        <Text
          style={[
            styles.link,
            {
              color: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
              textDecorationLine: 'underline',
            },
          ]}
        >
          Esqueceu a senha?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text
          style={[
            styles.link,
            {
              color: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
              textDecorationLine: 'underline',
            },
          ]}
        >
          Não tem cadastro? Cadastre-se aqui
        </Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 15,
  },
});
