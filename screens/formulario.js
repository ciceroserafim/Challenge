import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { registrarNotificacoes, enviarNotificacaoPush } from '../utils/notifications';

export default function Formulario({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');
  const [expoToken, setExpoToken] = useState(null);

  const statusOptions = [
    { label: t('form.statusOptions.available'), value: 'DISPONIVEL', color: '#4CAF50' },
    { label: t('form.statusOptions.reserved'), value: 'RESERVADA', color: '#005ca7ff' },
    { label: t('form.statusOptions.maintenance'), value: 'MANUTENCAO', color: '#FFEB3B' },
    { label: t('form.statusOptions.structuralDamage'), value: 'DANOS_ESTRUTURAIS', color: '#F44336' },
    { label: t('form.statusOptions.unavailable'), value: 'INDISPONIVEL', color: '#9E9E9E' },
    { label: t('form.statusOptions.accident'), value: 'SINISTRO', color: '#000' },
    { label: t('form.statusOptions.missingPart'), value: 'FALTA_PECA', color: '#a91afcff' },
  ];

  // 🟢 Registrar token push ao abrir o formulário
  useEffect(() => {
    const registrarToken = async () => {
      let token = await AsyncStorage.getItem('@expo_push_token');
      if (!token) {
        token = await registrarNotificacoes();
        if (token) await AsyncStorage.setItem('@expo_push_token', token);
      }
      setExpoToken(token);
    };
    registrarToken();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !placa || !modelo || !localizacao || !status) {
      Alert.alert('Erro', t('form.errors.fillFields'));
      return;
    }

    try {
      const novaMoto = {
        id: Date.now().toString(),
        nome,
        placa,
        modelo,
        localizacao,
        status,
      };

      const motosSalvas = await AsyncStorage.getItem('@motos');
      const lista = motosSalvas ? JSON.parse(motosSalvas) : [];
      const novaLista = [...lista, novaMoto];
      await AsyncStorage.setItem('@motos', JSON.stringify(novaLista));

      // ✅ Enviar push real
      if (expoToken) {
        await enviarNotificacaoPush(
          expoToken,
          t('form.notification.title'),
          t('form.notification.body', { model: modelo, plate: placa, name: nome })
        );
      }

      Alert.alert('Sucesso', t('form.success'));
      setNome('');
      setPlaca('');
      setModelo('');
      setLocalizacao('');
      setStatus('');
      navigation.navigate('Patio');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', t('form.errors.saveError'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#333' : '#fff' }]}>
      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('form.responsibleName')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={nome}
        onChangeText={setNome}
        placeholder={t('form.enterName')}
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('form.plate')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={placa}
        onChangeText={setPlaca}
        placeholder={t('form.enterPlate')}
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('form.model')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={modelo}
        onChangeText={setModelo}
        placeholder={t('form.enterModel')}
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('form.location')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.modoEscuro ? '#555' : '#f2f2f2' }]}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder={t('form.locationPlaceholder')}
        placeholderTextColor={theme.modoEscuro ? '#ccc' : '#999'}
      />

      <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#000' }]}>{t('form.status')}</Text>
      <View style={styles.statusContainer}>
        {statusOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              { backgroundColor: option.color, borderWidth: status === option.value ? 3 : 0 }
            ]}
            onPress={() => setStatus(option.value)}
          >
            <Text style={{ color: option.value === 'MANUTENCAO' ? '#000' : '#fff', fontWeight: 'bold' }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>{t('form.save')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { marginBottom: 5, fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 15, width: '100%' },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
    minWidth: '30%',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#A5D6A7',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 13,
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
