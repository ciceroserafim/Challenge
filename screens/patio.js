import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

export default function Patio({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [motos, setMotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [motoEditando, setMotoEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [status, setStatus] = useState('');

  const statusColors = {
    DISPONIVEL: '#4CAF50',
    RESERVADA: '#2196F3',
    MANUTENCAO: '#FFC107',
    FALTA_PECA: '#9C27B0',
    INDISPONIVEL: '#9E9E9E',
    DANOS_ESTRUTURAIS: '#F44336',
    SINISTRO: '#000',
  };

  const getStatusTranslation = (status) => {
    const translations = {
      DISPONIVEL: t('patio.status.available'),
      RESERVADA: t('patio.status.reserved'),
      MANUTENCAO: t('patio.status.maintenance'),
      FALTA_PECA: t('patio.status.missingPart'),
      INDISPONIVEL: t('patio.status.unavailable'),
      DANOS_ESTRUTURAIS: t('patio.status.structuralDamage'),
      SINISTRO: t('patio.status.accident'),
    };
    return translations[status] || status;
  };

  useEffect(() => {
    carregarMotos();
    const unsubscribe = navigation.addListener('focus', () => {
      carregarMotos();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarMotos = async () => {
    const motosSalvas = await AsyncStorage.getItem('@motos');
    if (motosSalvas) setMotos(JSON.parse(motosSalvas));
  };

  const statusOptions = [
    { label: t('form.statusOptions.available'), value: 'DISPONIVEL', color: '#4CAF50' },
    { label: t('form.statusOptions.reserved'), value: 'RESERVADA', color: '#005ca7ff' },
    { label: t('form.statusOptions.maintenance'), value: 'MANUTENCAO', color: '#FFEB3B' },
    { label: t('form.statusOptions.structuralDamage'), value: 'DANOS_ESTRUTURAIS', color: '#F44336' },
    { label: t('form.statusOptions.unavailable'), value: 'INDISPONIVEL', color: '#9E9E9E' },
    { label: t('form.statusOptions.accident'), value: 'SINISTRO', color: '#000' },
    { label: t('form.statusOptions.missingPart'), value: 'FALTA_PECA', color: '#a91afcff' },
  ];

  const handleEditar = (moto) => {
    setMotoEditando(moto);
    setNome(moto.nome);
    setPlaca(moto.placa);
    setModelo(moto.modelo);
    setLocalizacao(moto.localizacao);
    setStatus(moto.status);
    setModalVisible(true);
  };

  const handleExcluir = (moto) => {
    Alert.alert(t('patio.confirmDelete'), t('patio.confirmDeleteMessage'), [
      { text: t('patio.cancel'), style: 'cancel' },
      {
        text: t('patio.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            const motosSalvas = await AsyncStorage.getItem('@motos');
            if (motosSalvas) {
              const lista = JSON.parse(motosSalvas);
              const novaLista = lista.filter((m) => m.id !== moto.id);
              await AsyncStorage.setItem('@motos', JSON.stringify(novaLista));
              setMotos(novaLista);
              Alert.alert('Sucesso', t('patio.deleteSuccess'));
            }
          } catch (error) {
            console.error('Erro ao excluir moto:', error);
            Alert.alert('Erro', t('patio.errors.deleteError'));
          }
        },
      },
    ]);
  };

  const handleSalvarEdicao = async () => {
    if (!nome || !placa || !modelo || !localizacao || !status) {
      Alert.alert('Erro', t('patio.errors.fillFields'));
      return;
    }

    try {
      const motosSalvas = await AsyncStorage.getItem('@motos');
      if (motosSalvas) {
        const lista = JSON.parse(motosSalvas);
        const novaLista = lista.map((m) =>
          m.id === motoEditando.id
            ? { ...m, nome, placa, modelo, localizacao, status }
            : m
        );
        await AsyncStorage.setItem('@motos', JSON.stringify(novaLista));
        setMotos(novaLista);
        setModalVisible(false);
        setMotoEditando(null);
        Alert.alert('Sucesso', t('patio.editSuccess'));
      }
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      Alert.alert('Erro', t('patio.errors.updateError'));
    }
  };

  const handleCancelarEdicao = () => {
    setModalVisible(false);
    setMotoEditando(null);
    setNome('');
    setPlaca('');
    setModelo('');
    setLocalizacao('');
    setStatus('');
  };

  const renderItem = ({ item }) => {
    const statusColor = statusColors[item.status] || '#9E9E9E';
    const cardBackground = theme.modoEscuro ? '#444' : '#f9f9f9';
    const textColor = theme.modoEscuro ? '#fff' : '#222';
    const statusText = getStatusTranslation(item.status);

    return (
      <View style={[styles.card, { backgroundColor: cardBackground, borderLeftColor: statusColor }]}>
        <Text style={[styles.text, { color: textColor, fontWeight: 'bold' }]}>{item.modelo}</Text>
        <Text style={[styles.text, { color: textColor }]}>{t('patio.plate')}: {item.placa}</Text>
        <Text style={[styles.text, { color: textColor }]}>{t('patio.responsible')}: {item.nome}</Text>
        <Text style={[styles.text, { color: textColor }]}>{t('patio.location')}: {item.localizacao}</Text>

        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton, { backgroundColor: '#2196F3' }]}
            onPress={() => handleEditar(item)}
          >
            <Text style={styles.actionButtonText}>{t('patio.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleExcluir(item)}
          >
            <Text style={styles.actionButtonText}>{t('patio.delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const containerBg = theme.modoEscuro ? '#222' : '#fff';
  const titleColor = theme.modoEscuro ? '#00FF7F' : '#2E7D32';

  const inputStyle = [
    styles.modalInput,
    {
      backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff',
      borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
      color: theme.modoEscuro ? '#fff' : '#222',
    },
  ];

  const placeholderColor = theme.modoEscuro ? '#888' : '#666';

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <Text style={[styles.title, { color: titleColor }]}>{t('patio.title')}</Text>
      {motos.length === 0 ? (
        <Text style={[styles.text, { color: titleColor, textAlign: 'center', marginTop: 20 }]}>
          {t('patio.noMotos')}
        </Text>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelarEdicao}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}>
                {t('patio.edit')} {t('patio.plate')}
              </Text>

              <Text style={[styles.modalLabel, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {t('form.responsibleName')}
              </Text>
              <TextInput
                style={inputStyle}
                placeholderTextColor={placeholderColor}
                value={nome}
                onChangeText={setNome}
                placeholder={t('form.enterName')}
              />

              <Text style={[styles.modalLabel, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {t('form.plate')}
              </Text>
              <TextInput
                style={inputStyle}
                placeholderTextColor={placeholderColor}
                value={placa}
                onChangeText={setPlaca}
                placeholder={t('form.enterPlate')}
              />

              <Text style={[styles.modalLabel, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {t('form.model')}
              </Text>
              <TextInput
                style={inputStyle}
                placeholderTextColor={placeholderColor}
                value={modelo}
                onChangeText={setModelo}
                placeholder={t('form.enterModel')}
              />

              <Text style={[styles.modalLabel, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {t('form.location')}
              </Text>
              <TextInput
                style={inputStyle}
                placeholderTextColor={placeholderColor}
                value={localizacao}
                onChangeText={setLocalizacao}
                placeholder={t('form.locationPlaceholder')}
              />

              <Text style={[styles.modalLabel, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                {t('form.status')}
              </Text>
              <View style={styles.statusContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: option.color,
                        borderWidth: status === option.value ? 3 : 0,
                        borderColor: '#fff',
                      },
                    ]}
                    onPress={() => setStatus(option.value)}
                  >
                    <Text
                      style={{
                        color: option.value === 'MANUTENCAO' ? '#000' : '#fff',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: '#4CAF50' }]}
                  onPress={handleSalvarEdicao}
                >
                  <Text style={styles.modalButtonText}>{t('patio.save')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { backgroundColor: '#9E9E9E' }]}
                  onPress={handleCancelarEdicao}
                >
                  <Text style={styles.modalButtonText}>{t('patio.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, marginTop: 50, textAlign: 'center' },
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    elevation: 5,
  },
  text: { fontSize: 16, marginBottom: 4 },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
    minWidth: '30%',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {},
  cancelButton: {},
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
