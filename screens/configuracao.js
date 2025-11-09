// screens/configuracao.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function Configuracao({ navigation }) {
  const { modoEscuro, modoMottu, toggleModoEscuro, toggleModoMottu, colors } = useTheme();

  const [usuario, setUsuario] = useState(null);
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [temaLocal, setTemaLocal] = useState(modoEscuro); // controle local para UI imediata

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const email = await AsyncStorage.getItem('@logado_email');
        if (email) {
          const userJSON = await AsyncStorage.getItem(`@usuario_${email}`);
          if (userJSON) setUsuario(JSON.parse(userJSON));
        }

        // carrega preferências se existirem (compatibilidade com chave que você usa)
        const temaSalvo = await AsyncStorage.getItem('@modo_escuro');
        if (temaSalvo !== null) setTemaLocal(JSON.parse(temaSalvo));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  // Sincroniza tema local quando contexto muda
  useEffect(() => {
    setTemaLocal(modoEscuro);
  }, [modoEscuro]);

  // alternar tema (usa o toggle do contexto e salva em storage para persistência)
  const alternarTema = async () => {
    try {
      toggleModoEscuro(); // altera no contexto global
      const novo = !temaLocal;
      setTemaLocal(novo);
      await AsyncStorage.setItem('@modo_escuro', JSON.stringify(novo));
    } catch (error) {
      console.error('Erro ao alternar tema:', error);
    }
  };

  const alternarModoMottu = async () => {
    try {
      toggleModoMottu();
      // se você quiser persistir aussi, crie outra chave; aqui mantive só no contexto
    } catch (error) {
      console.error('Erro ao alternar modo Mottu:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@logado_email');
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const handleExcluirConta = () => {
    Alert.alert('Confirmação', 'Tem certeza que deseja excluir sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const email = await AsyncStorage.getItem('@logado_email');
            if (email) {
              await AsyncStorage.removeItem(`@usuario_${email}`);
              await AsyncStorage.removeItem('@logado_email');
              Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
              navigation.replace('Login');
            } else {
              Alert.alert('Erro', 'Nenhum usuário logado encontrado.');
            }
          } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Alert.alert('Erro', 'Não foi possível excluir a conta.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>

      {usuario ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.text }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>Nome: {usuario.nome}</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>Email: {usuario.email}</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>CPF: {usuario.cpf}</Text>
        </View>
      ) : (
        <Text style={{ color: colors.text, marginBottom: 20 }}>Carregando usuário...</Text>
      )}

      <View style={[styles.optionRow, { backgroundColor: colors.card, borderColor: colors.text }]}>
        <Text style={[styles.optionText, { color: colors.text }]}>Modo Escuro</Text>
        <Switch
          value={temaLocal}
          onValueChange={alternarTema}
          thumbColor={temaLocal ? colors.switchThumb : '#fff'}
          trackColor={{ false: '#ccc', true: colors.switchTrack }}
        />
      </View>

      <View style={[styles.optionRow, { backgroundColor: colors.card, borderColor: colors.text }]}>
        <Text style={[styles.optionText, { color: colors.text }]}>Modo Mottu</Text>
        <Switch
          value={modoMottu}
          onValueChange={alternarModoMottu}
          thumbColor={modoMottu ? colors.switchThumb : '#fff'}
          trackColor={{ false: '#ccc', true: colors.switchTrack }}
        />
      </View>

      <View style={[styles.optionRow, { backgroundColor: colors.card, borderColor: colors.text }]}>
        <Text style={[styles.optionText, { color: colors.text }]}>Notificações</Text>
        <Switch
          value={notificacoesAtivadas}
          onValueChange={() => setNotificacoesAtivadas(prev => !prev)}
          thumbColor={notificacoesAtivadas ? colors.switchThumb : '#fff'}
          trackColor={{ false: '#ccc', true: colors.switchTrack }}
        />
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.logoutButton }]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: colors.text }]}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteButton]} onPress={handleExcluirConta}>
        <Text style={[styles.logoutButtonText]}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 50, textAlign: 'center' },
  card: { padding: 15, borderWidth: 1.5, borderRadius: 12, marginBottom: 25 },
  infoText: { fontSize: 18, marginBottom: 8 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 20,
  },
  optionText: { fontSize: 18 },
  logoutButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  deleteButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, backgroundColor: '#FF4C4C' },
  logoutButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
