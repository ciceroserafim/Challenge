import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function Configuracao({ navigation }) {
  const theme = useTheme();
  const [usuario, setUsuario] = useState(null);
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(theme.modoEscuro);

  useEffect(() => {
    const carregarUsuario = async () => {
      const email = await AsyncStorage.getItem('@logado_email');
      if (email) {
        const userJSON = await AsyncStorage.getItem(`@usuario_${email}`);
        if (userJSON) setUsuario(JSON.parse(userJSON));
      }
    };

    const carregarPreferencias = async () => {
      const temaSalvo = await AsyncStorage.getItem('@modo_escuro');
      if (temaSalvo !== null) setModoEscuro(JSON.parse(temaSalvo));
    };

    carregarUsuario();
    carregarPreferencias();
  }, []);

  const alternarTema = async () => {
    const novoTema = !modoEscuro;
    setModoEscuro(novoTema);
    theme.toggleTheme(); // muda o tema global do app
    await AsyncStorage.setItem('@modo_escuro', JSON.stringify(novoTema)); // salva preferência
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@logado_email');
    navigation.replace('Login');
  };

  const handleExcluirConta = async () => {
    Alert.alert('Confirmação', 'Tem certeza que deseja excluir sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const email = await AsyncStorage.getItem('@logado_email');
          if (email) {
            await AsyncStorage.removeItem(`@usuario_${email}`);
            await AsyncStorage.removeItem('@logado_email');
            Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
            navigation.replace('Login');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <Text style={[styles.title, { color: modoEscuro ? '#00FF7F' : '#2E7D32' }]}>Configurações</Text>

      {usuario ? (
        <View style={[styles.card, { backgroundColor: modoEscuro ? '#1E1E1E' : '#fff', borderColor: modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
          <Text style={[styles.infoText, { color: modoEscuro ? '#fff' : '#222' }]}>Nome: {usuario.nome}</Text>
          <Text style={[styles.infoText, { color: modoEscuro ? '#fff' : '#222' }]}>Email: {usuario.email}</Text>
          <Text style={[styles.infoText, { color: modoEscuro ? '#fff' : '#222' }]}>CPF: {usuario.cpf}</Text>
        </View>
      ) : (
        <Text style={{ color: modoEscuro ? '#fff' : '#222', marginBottom: 20 }}>Carregando usuário...</Text>
      )}

      <View style={[styles.optionRow, { backgroundColor: modoEscuro ? '#1E1E1E' : '#fff', borderColor: modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
        <Text style={[styles.optionText, { color: modoEscuro ? '#fff' : '#222' }]}>Modo Escuro</Text>
        <Switch
          value={modoEscuro}
          onValueChange={alternarTema}
          thumbColor={modoEscuro ? '#00FF7F' : '#fff'}
          trackColor={{ false: '#ccc', true: '#2E7D32' }}
        />
      </View>

      <View style={[styles.optionRow, { backgroundColor: modoEscuro ? '#1E1E1E' : '#fff', borderColor: modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
        <Text style={[styles.optionText, { color: modoEscuro ? '#fff' : '#222' }]}>Notificações</Text>
        <Switch
          value={notificacoesAtivadas}
          onValueChange={() => setNotificacoesAtivadas(!notificacoesAtivadas)}
          thumbColor={notificacoesAtivadas ? '#00FF7F' : '#fff'}
          trackColor={{ false: '#ccc', true: '#2E7D32' }}
        />
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: modoEscuro ? '#00FF7F' : '#2E7D32' }]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: modoEscuro ? '#000' : '#fff' }]}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#FF4C4C' }]} onPress={handleExcluirConta}>
        <Text style={styles.logoutButtonText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 15, borderWidth: 1.5, borderRadius: 12, marginBottom: 25 },
  infoText: { fontSize: 18, marginBottom: 8 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderWidth: 1.5, borderRadius: 12, marginBottom: 20 },
  optionText: { fontSize: 18 },
  logoutButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  deleteButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
