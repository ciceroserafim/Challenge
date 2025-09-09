import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';

export default function Configuracao({ navigation }) {
  const theme = useTheme();
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);

  const toggleNotificacoes = () => {
    setNotificacoesAtivadas(prev => !prev);
    console.log('Notificações:', !notificacoesAtivadas ? 'Ativadas' : 'Desativadas');
  };

  const handleSair = () => {
    console.log('Usuário deslogado!');
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Configurações</Text>

      {/* Notificações */}
      <View style={[styles.optionRow, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.optionText, { color: theme.colors.text }]}>Receber Notificações</Text>
        <Switch
          onValueChange={toggleNotificacoes}
          value={notificacoesAtivadas}
          trackColor={{ false: "#767577", true: "#e4ccccff" }}
          thumbColor={notificacoesAtivadas ? "#dd495dff" : "#f4f3f4"}
        />
      </View>

      {/* Modo Escuro */}
      <View style={[styles.optionRow, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.optionText, { color: theme.colors.text }]}>Modo Escuro</Text>
        <Switch
          onValueChange={theme.toggleModoEscuro}
          value={theme.modoEscuro}
          trackColor={{ false: "#60a8b4ff", true: theme.colors.switchTrack }}
          thumbColor={theme.modoEscuro ? theme.colors.switchThumb : "#d1cd90ff"}
        />
      </View>

      {/* Modo Mottu */}
      <View style={[styles.optionRow, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.optionText, { color: theme.colors.text }]}>Modo Mottu</Text>
        <Switch
          onValueChange={theme.toggleModoMottu}
          value={theme.modoMottu}
          trackColor={{ false: "#86c95aff", true: theme.colors.switchTrack }}
          thumbColor={theme.modoMottu ? theme.colors.switchThumb : "#f4f3f4"}
        />
      </View>

      {/* Botão Sair */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.logoutButton }]} onPress={handleSair}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  logoutButton: {
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
