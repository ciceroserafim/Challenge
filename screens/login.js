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
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Login</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text, backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]}
        placeholder="Usuário"
        placeholderTextColor={theme.colors.text}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text, backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={theme.colors.text}
        value={password}
        onChangeText={setPassword}
      />

      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.modoEscuro ? '#228b22' : '#228b22' }]} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('EsqueceuSenha')}>
        <Text style={[styles.link, { color: theme.colors.text }]}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={[styles.link, { color: theme.colors.text }]}>Não tem cadastro? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
