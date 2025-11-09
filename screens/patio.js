import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

export default function Patio() {
  const theme = useTheme();
  const { t } = useI18n();
  const [motos, setMotos] = useState([]);

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
    const carregarMotos = async () => {
      const motosSalvas = await AsyncStorage.getItem('@motos');
      if (motosSalvas) setMotos(JSON.parse(motosSalvas));
    };

    const focusListener = carregarMotos;
    carregarMotos();

    return focusListener;
  }, []);

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
      </View>
    );
  };

  const containerBg = theme.modoEscuro ? '#222' : '#fff';
  const titleColor = theme.modoEscuro ? '#00FF7F' : '#2E7D32';

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
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});
