import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function Configuracao({ navigation }) {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [modoEscuroAtivado, setModoEscuroAtivado] = useState(false);

  const toggleNotificacoes = () => {
    setNotificacoesAtivadas(previousState => !previousState);
    // Adicione lógica para salvar a preferência do usuário
    console.log('Notificações:', !notificacoesAtivadas ? 'Ativadas' : 'Desativadas');
  };

  const toggleModoEscuro = () => {
    setModoEscuroAtivado(previousState => !previousState);
    // Adicione lógica para aplicar o modo escuro globalmente
    console.log('Modo Escuro:', !modoEscuroAtivado ? 'Ativado' : 'Desativado');
  };

  const handleSair = () => {
    // Lógica para deslogar o usuário
    console.log('Usuário deslogado!');
    // Exemplo: navegar de volta para a tela de Login ou Primeira
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Receber Notificações</Text>
        <Switch
          onValueChange={toggleNotificacoes}
          value={notificacoesAtivadas}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificacoesAtivadas ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Modo Escuro</Text>
        <Switch
          onValueChange={toggleModoEscuro}
          value={modoEscuroAtivado}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={modoEscuroAtivado ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSair}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    color: '#34495e',
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // Vermelho para o botão de sair
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
