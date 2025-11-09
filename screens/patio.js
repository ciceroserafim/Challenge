import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { MotoApi, PatioApi } from '../services/api';
import { buildStatusOptions, getStatusLabel, getSetorPreview } from '../utils/statusMetadata';

const VIEW_MODES = {
  MOTOS: 'motos',
  PATIOS: 'patios',
};

const INITIAL_MOTO_FORM = {
  id: null,
  modelo: '',
  placa: '',
  status: '',
  descricao: '',
  nomePatio: '',
};

const INITIAL_PATIO_FORM = {
  id: null,
  nome: '',
  endereco: '',
};

export default function Patio({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();

  const [viewMode, setViewMode] = useState(VIEW_MODES.MOTOS);
  const [motos, setMotos] = useState([]);
  const [patios, setPatios] = useState([]);
  const [loading, setLoading] = useState({ motos: true, patios: true });
  const [refreshing, setRefreshing] = useState(false);
  const [motoError, setMotoError] = useState(null);
  const [patioError, setPatioError] = useState(null);
  const [authAlertShown, setAuthAlertShown] = useState(false);

  const [motoModalVisible, setMotoModalVisible] = useState(false);
  const [patioModalVisible, setPatioModalVisible] = useState(false);
  const [motoForm, setMotoForm] = useState(INITIAL_MOTO_FORM);
  const [patioForm, setPatioForm] = useState(INITIAL_PATIO_FORM);
  const [motoFormErrors, setMotoFormErrors] = useState({});
  const [patioFormErrors, setPatioFormErrors] = useState({});
  const [isSubmittingMoto, setIsSubmittingMoto] = useState(false);
  const [isSubmittingPatio, setIsSubmittingPatio] = useState(false);

  const themeColors = {
    background: theme.modoEscuro ? '#111111' : '#F4F8F4',
    card: theme.modoEscuro ? '#1F1F1F' : '#FFFFFF',
    header: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
    text: theme.modoEscuro ? '#FFFFFF' : '#1F1F1F',
    mutedText: theme.modoEscuro ? '#BDBDBD' : '#5F5F5F',
    border: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
    error: '#F44336',
    success: '#4CAF50',
    accent: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
  };

  const statusOptions = useMemo(() => buildStatusOptions(t), [t]);

  const handleAuthError = useCallback(
    (error) => {
      if (
        !error ||
        authAlertShown ||
        (error.code !== 'AUTH_TOKEN_MISSING' &&
          error.status !== 401 &&
          error.status !== 403)
      ) {
        return false;
      }

      setAuthAlertShown(true);
      Alert.alert(
        t('patio.errors.authTitle'),
        t('patio.errors.authMessage'),
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
      return true;
    },
    [authAlertShown, navigation, t]
  );

  const loadMotos = useCallback(async () => {
    setMotoError(null);
    setLoading((prev) => ({ ...prev, motos: true }));

    try {
      const data = await MotoApi.list();
      setMotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar motos:', error);
      if (error.code === 'NETWORK_ERROR') {
        setMotoError(t('patio.errors.network'));
        return;
      }
      if (!handleAuthError(error)) {
        setMotoError(
          error.body?.message || error.message || t('patio.errors.loadMotos')
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, motos: false }));
    }
  }, [handleAuthError, t]);

  const loadPatios = useCallback(async () => {
    setPatioError(null);
    setLoading((prev) => ({ ...prev, patios: true }));

    try {
      const data = await PatioApi.list();
      setPatios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar pátios:', error);
      if (error.code === 'NETWORK_ERROR') {
        setPatioError(t('patio.errors.network'));
        return;
      }
      if (!handleAuthError(error)) {
        setPatioError(
          error.body?.message || error.message || t('patio.errors.loadPatios')
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, patios: false }));
    }
  }, [handleAuthError, t]);

  useFocusEffect(
    useCallback(() => {
      loadMotos();
      loadPatios();
    }, [loadMotos, loadPatios])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadMotos(), loadPatios()]);
    setRefreshing(false);
  }, [loadMotos, loadPatios]);

  const motoSections = useMemo(() => {
    if (!motos.length) return [];

    const grouped = motos.reduce((acc, moto) => {
      const patioName = moto.nomePatio || t('patio.unknownPatio');
      if (!acc[patioName]) acc[patioName] = [];
      acc[patioName].push(moto);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([patioName, items]) => ({
        title: patioName,
        data: items.sort((a, b) => (a.setor || '').localeCompare(b.setor || '')),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [motos, t]);

  const resetMotoForm = useCallback(() => {
    setMotoForm(INITIAL_MOTO_FORM);
    setMotoFormErrors({});
    setIsSubmittingMoto(false);
  }, []);

  const closeMotoModal = useCallback(() => {
    setMotoModalVisible(false);
    resetMotoForm();
  }, [resetMotoForm]);

  const openMotoModal = useCallback(
    async (motoId) => {
      setMotoFormErrors({});
      setIsSubmittingMoto(false);

      try {
        const detalhes = await MotoApi.getById(motoId);
        setMotoForm({
          id: detalhes.id,
          modelo: detalhes.modelo || '',
          placa: detalhes.placa || '',
          status: detalhes.status || '',
          descricao: detalhes.descricao || '',
          nomePatio: detalhes.patio?.nome || '',
        });
        setMotoModalVisible(true);
      } catch (error) {
        console.error('Erro ao carregar detalhes da moto:', error);
        if (error.code === 'NETWORK_ERROR') {
          Alert.alert(t('patio.errors.networkTitle'), t('patio.errors.network'));
          return;
        }
        if (!handleAuthError(error)) {
          Alert.alert(
            t('patio.errors.loadMotoDetailTitle'),
            error.body?.message || error.message || t('patio.errors.loadMotoDetail')
          );
        }
      }
    },
    [handleAuthError, t]
  );

  const resetPatioForm = useCallback(() => {
    setPatioForm(INITIAL_PATIO_FORM);
    setPatioFormErrors({});
    setIsSubmittingPatio(false);
  }, []);

  const closePatioModal = useCallback(() => {
    setPatioModalVisible(false);
    resetPatioForm();
  }, [resetPatioForm]);

  const validateMotoForm = useCallback(
    () => {
      const errors = {};
      const modeloTrim = motoForm.modelo.trim();
      const placaTrim = motoForm.placa.trim().toUpperCase();
      const descricaoTrim = motoForm.descricao.trim();
      const patioNome = motoForm.nomePatio.trim();

      if (!modeloTrim) errors.modelo = t('patio.errors.modelRequired');
      if (!placaTrim) {
        errors.placa = t('patio.errors.plateRequired');
      } else if (!/^[A-Z0-9]{7}$/.test(placaTrim)) {
        errors.placa = t('patio.errors.plateFormat');
      }
      if (!motoForm.status) errors.status = t('patio.errors.statusRequired');
      if (!patioNome) errors.nomePatio = t('patio.errors.patioRequired');
      if (!descricaoTrim) errors.descricao = t('patio.errors.descriptionRequired');

      setMotoFormErrors(errors);

      return {
        isValid: Object.keys(errors).length === 0,
        payload: {
          modelo: modeloTrim,
          placa: placaTrim,
          status: motoForm.status,
          descricao: descricaoTrim,
          nomePatio: patioNome,
        },
      };
    },
    [motoForm, t]
  );

  const handleSubmitMoto = useCallback(async () => {
    if (!motoForm.id) return;

    const { isValid, payload } = validateMotoForm();
    if (!isValid) return;

    setIsSubmittingMoto(true);
    try {
      await MotoApi.updateById(motoForm.id, payload);
      await loadMotos();
      Alert.alert('Sucesso', t('patio.messages.motoUpdated'));
      closeMotoModal();
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      if (error.code === 'NETWORK_ERROR') {
        Alert.alert(t('patio.errors.networkTitle'), t('patio.errors.network'));
        return;
      }
      if (!handleAuthError(error)) {
        Alert.alert(
          'Erro',
          error.body?.message || error.message || t('patio.errors.updateError')
        );
      }
    } finally {
      setIsSubmittingMoto(false);
    }
  }, [motoForm.id, validateMotoForm, loadMotos, t, closeMotoModal, handleAuthError]);

  const handleDeleteMoto = useCallback(
    (motoId, placa) => {
      Alert.alert(
        t('patio.confirmDelete'),
        t('patio.confirmDeleteMessage', { plate: placa }),
        [
          { text: t('patio.cancel'), style: 'cancel' },
          {
            text: t('patio.delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await MotoApi.deleteById(motoId);
                await loadMotos();
                Alert.alert('Sucesso', t('patio.deleteSuccess'));
              } catch (error) {
                console.error('Erro ao excluir moto:', error);
                if (error.code === 'NETWORK_ERROR') {
                  Alert.alert(t('patio.errors.networkTitle'), t('patio.errors.network'));
                  return;
                }
                if (!handleAuthError(error)) {
                  Alert.alert(
                    'Erro',
                    error.body?.message || error.message || t('patio.errors.deleteError')
                  );
                }
              }
            },
          },
        ]
      );
    },
    [handleAuthError, loadMotos, t]
  );

  const validatePatioForm = useCallback(() => {
    const errors = {};
    const nomeTrim = patioForm.nome.trim();
    const enderecoTrim = patioForm.endereco.trim();

    if (!nomeTrim) errors.nome = t('patio.errors.nameRequired');
    if (!enderecoTrim) errors.endereco = t('patio.errors.addressRequired');

    setPatioFormErrors(errors);

    return {
      isValid: Object.keys(errors).length === 0,
      payload: {
        nome: nomeTrim,
        endereco: enderecoTrim,
      },
    };
  }, [patioForm, t]);

  const handleSubmitPatio = useCallback(async () => {
    const { isValid, payload } = validatePatioForm();
    if (!isValid) return;

    setIsSubmittingPatio(true);
    try {
      if (patioForm.id) {
        await PatioApi.update(patioForm.id, payload);
        Alert.alert('Sucesso', t('patio.messages.patioUpdated'));
      } else {
        await PatioApi.create(payload);
        Alert.alert('Sucesso', t('patio.messages.patioCreated'));
      }
      await Promise.all([loadPatios(), loadMotos()]);
      closePatioModal();
    } catch (error) {
      console.error('Erro ao salvar pátio:', error);
      if (error.code === 'NETWORK_ERROR') {
        Alert.alert(t('patio.errors.networkTitle'), t('patio.errors.network'));
        return;
      }
      if (!handleAuthError(error)) {
        Alert.alert(
          'Erro',
          error.body?.message || error.message || t('patio.errors.savePatio')
        );
      }
    } finally {
      setIsSubmittingPatio(false);
    }
  }, [patioForm.id, validatePatioForm, loadPatios, loadMotos, closePatioModal, t, handleAuthError]);

  const handleDeletePatio = useCallback(
    (patioId, nome) => {
      Alert.alert(
        t('patio.confirmDeletePatio'),
        t('patio.confirmDeletePatioMessage', { name: nome }),
        [
          { text: t('patio.cancel'), style: 'cancel' },
          {
            text: t('patio.delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await PatioApi.remove(patioId);
                await Promise.all([loadPatios(), loadMotos()]);
                Alert.alert('Sucesso', t('patio.messages.patioDeleted'));
              } catch (error) {
                console.error('Erro ao excluir pátio:', error);
                if (error.code === 'NETWORK_ERROR') {
                  Alert.alert(t('patio.errors.networkTitle'), t('patio.errors.network'));
                  return;
                }
                if (!handleAuthError(error)) {
                  Alert.alert(
                    'Erro',
                    error.body?.message || error.message || t('patio.errors.deletePatio')
                  );
                }
              }
            },
          },
        ]
      );
    },
    [handleAuthError, loadMotos, loadPatios, t]
  );

  const renderMotoItem = ({ item }) => {
    const preview = getSetorPreview(item.status);
    const statusLabel = getStatusLabel(item.status, t);
    const setorLabel = item.setor || (preview ? `Setor ${preview.setor}` : '--');
    const corLabel = item.corSetor || preview?.corSetor || '--';

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.card,
            borderLeftColor: preview?.color || themeColors.accent,
            borderRightColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>{item.modelo}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: preview?.color || themeColors.accent },
            ]}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={[styles.cardLine, { color: themeColors.text }]}>
          <Text style={styles.cardLineLabel}>{t('patio.plate')}:</Text> {item.placa}
        </Text>
        <Text style={[styles.cardLine, { color: themeColors.text }]}>
          <Text style={styles.cardLineLabel}>{t('patio.setor')}:</Text> {setorLabel}
        </Text>
        <Text style={[styles.cardLine, { color: themeColors.text }]}>
          <Text style={styles.cardLineLabel}>{t('patio.cor')}:</Text> {corLabel}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => openMotoModal(item.id)}
          >
            <Text style={styles.actionButtonText}>{t('patio.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleDeleteMoto(item.id, item.placa)}
          >
            <Text style={styles.actionButtonText}>{t('patio.delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPatioItem = ({ item }) => (
    <View
      style={[
        styles.patioCard,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: themeColors.text }]}>{item.nome}</Text>
      <Text style={[styles.cardLine, { color: themeColors.mutedText }]}>
        {item.endereco}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={() => {
            setPatioForm({ id: item.id, nome: item.nome, endereco: item.endereco || '' });
            setPatioFormErrors({});
            setPatioModalVisible(true);
          }}
        >
          <Text style={styles.actionButtonText}>{t('patio.edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleDeletePatio(item.id, item.nome)}
        >
          <Text style={styles.actionButtonText}>{t('patio.delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMotoEmptyState = () => {
    if (loading.motos) {
      return <ActivityIndicator size="large" color={themeColors.accent} style={styles.loader} />;
    }

    if (motoError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: themeColors.error }]}>{motoError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMotos}>
            <Text style={[styles.retryText, { color: '#FFFFFF' }]}>{t('patio.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: themeColors.mutedText }]}>{t('patio.noMotos')}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: themeColors.accent }]}
          onPress={() => navigation.navigate('Formulario')}
        >
          <Text style={[styles.retryText, { color: '#FFFFFF' }]}>{t('patio.createFirstMoto')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPatioEmptyState = () => {
    if (loading.patios) {
      return <ActivityIndicator size="large" color={themeColors.accent} style={styles.loader} />;
    }

    if (patioError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: themeColors.error }]}>{patioError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPatios}>
            <Text style={[styles.retryText, { color: '#FFFFFF' }]}>{t('patio.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: themeColors.mutedText }]}>{t('patio.noPatios')}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: themeColors.accent }]}
          onPress={() => {
            resetPatioForm();
            setPatioModalVisible(true);
          }}
        >
          <Text style={[styles.retryText, { color: '#FFFFFF' }]}>{t('patio.createFirstPatio')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.header }]}>{t('patio.title')}</Text>

      <View style={[styles.segmentedControl, { borderColor: themeColors.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            {
              backgroundColor:
                viewMode === VIEW_MODES.MOTOS ? themeColors.accent : 'transparent',
            },
          ]}
          onPress={() => setViewMode(VIEW_MODES.MOTOS)}
        >
          <Text
            style={[
              styles.segmentText,
              { color: viewMode === VIEW_MODES.MOTOS ? '#FFFFFF' : themeColors.text },
            ]}
          >
            {t('patio.tabs.motos')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            {
              backgroundColor:
                viewMode === VIEW_MODES.PATIOS ? themeColors.accent : 'transparent',
            },
          ]}
          onPress={() => setViewMode(VIEW_MODES.PATIOS)}
        >
          <Text
            style={[
              styles.segmentText,
              { color: viewMode === VIEW_MODES.PATIOS ? '#FFFFFF' : themeColors.text },
            ]}
          >
            {t('patio.tabs.patios')}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === VIEW_MODES.MOTOS ? (
        <>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColors.accent }]}
            onPress={() => navigation.navigate('Formulario')}
          >
            <Text style={styles.primaryButtonText}>{t('patio.addMoto')}</Text>
          </TouchableOpacity>
          <SectionList
            sections={motoSections}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMotoItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={[styles.sectionHeader, { color: themeColors.text }]}>{title}</Text>
            )}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderMotoEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.accent}
                colors={[themeColors.accent]}
              />
            }
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColors.accent }]}
            onPress={() => {
              resetPatioForm();
              setPatioModalVisible(true);
            }}
          >
            <Text style={styles.primaryButtonText}>{t('patio.addPatio')}</Text>
          </TouchableOpacity>
          <FlatList
            data={patios}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderPatioItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderPatioEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.accent}
                colors={[themeColors.accent]}
              />
            }
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={motoModalVisible}
        onRequestClose={closeMotoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                {t('patio.editMoto')}
              </Text>

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('form.model')}
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor: motoFormErrors.modelo ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                value={motoForm.modelo}
                onChangeText={(value) => {
                  setMotoForm((prev) => ({ ...prev, modelo: value }));
                  if (motoFormErrors.modelo) setMotoFormErrors((prev) => ({ ...prev, modelo: null }));
                }}
                placeholder={t('form.enterModel')}
                placeholderTextColor={themeColors.mutedText}
              />
              {!!motoFormErrors.modelo && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{motoFormErrors.modelo}</Text>
              )}

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('form.plate')}
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor: motoFormErrors.placa ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                value={motoForm.placa}
                onChangeText={(value) => {
                  setMotoForm((prev) => ({ ...prev, placa: value.toUpperCase() }));
                  if (motoFormErrors.placa) setMotoFormErrors((prev) => ({ ...prev, placa: null }));
                }}
                autoCapitalize="characters"
                placeholder={t('form.enterPlate')}
                placeholderTextColor={themeColors.mutedText}
                maxLength={7}
              />
              {!!motoFormErrors.placa && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{motoFormErrors.placa}</Text>
              )}

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('form.status')}
              </Text>
              <View style={styles.statusOptionsContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOptionButton,
                      {
                        backgroundColor: option.color,
                        borderWidth: motoForm.status === option.value ? 3 : 1,
                        borderColor: motoForm.status === option.value ? '#FFFFFF' : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setMotoForm((prev) => ({ ...prev, status: option.value }));
                      if (motoFormErrors.status) setMotoFormErrors((prev) => ({ ...prev, status: null }));
                    }}
                  >
                    <Text
                      style={{
                        color: option.value === 'MANUTENCAO' ? '#000000' : '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!!motoFormErrors.status && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{motoFormErrors.status}</Text>
              )}

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('form.description')}
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalTextArea,
                  {
                    borderColor: motoFormErrors.descricao ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                value={motoForm.descricao}
                onChangeText={(value) => {
                  setMotoForm((prev) => ({ ...prev, descricao: value }));
                  if (motoFormErrors.descricao) setMotoFormErrors((prev) => ({ ...prev, descricao: null }));
                }}
                placeholder={t('form.descriptionPlaceholder')}
                placeholderTextColor={themeColors.mutedText}
                multiline
                numberOfLines={4}
              />
              {!!motoFormErrors.descricao && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{motoFormErrors.descricao}</Text>
              )}

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('form.patio')}
              </Text>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    borderColor: motoFormErrors.nomePatio ? themeColors.error : themeColors.border,
                    backgroundColor: themeColors.background,
                  },
                ]}
              >
                <Picker
                  selectedValue={motoForm.nomePatio}
                  onValueChange={(value) => {
                    setMotoForm((prev) => ({ ...prev, nomePatio: value }));
                    if (motoFormErrors.nomePatio) {
                      setMotoFormErrors((prev) => ({ ...prev, nomePatio: null }));
                    }
                  }}
                  dropdownIconColor={themeColors.text}
                >
                  {patios.map((patio) => (
                    <Picker.Item
                      key={patio.id}
                      label={patio.nome}
                      value={patio.nome}
                      color={themeColors.text}
                    />
                  ))}
                </Picker>
              </View>
              {!!motoFormErrors.nomePatio && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{motoFormErrors.nomePatio}</Text>
              )}

              {motoForm.status ? (
                <View
                  style={[
                    styles.sectorPreviewBox,
                    { borderColor: getSetorPreview(motoForm.status)?.color || themeColors.border },
                  ]}
                >
                  <Text style={[styles.sectorPreviewTitle, { color: themeColors.text }]}>
                    {t('form.sectorPreview.title')}
                  </Text>
                  <Text style={[styles.sectorPreviewLine, { color: themeColors.text }]}>
                    {t('form.sectorPreview.setor', {
                      setor: getSetorPreview(motoForm.status)?.setor || '-',
                    })}
                  </Text>
                  <Text style={[styles.sectorPreviewLine, { color: themeColors.text }]}>
                    {t('form.sectorPreview.color', {
                      color: getSetorPreview(motoForm.status)?.corSetor || '-',
                    })}
                  </Text>
                </View>
              ) : null}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: themeColors.accent, opacity: isSubmittingMoto ? 0.7 : 1 },
                  ]}
                  onPress={handleSubmitMoto}
                  disabled={isSubmittingMoto}
                >
                  {isSubmittingMoto ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>{t('patio.save')}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#9E9E9E' }]}
                  onPress={closeMotoModal}
                >
                  <Text style={styles.modalButtonText}>{t('patio.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={patioModalVisible}
        onRequestClose={closePatioModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                {patioForm.id ? t('patio.editPatio') : t('patio.createPatio')}
              </Text>

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('patio.fields.name')}
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor: patioFormErrors.nome ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                value={patioForm.nome}
                onChangeText={(value) => {
                  setPatioForm((prev) => ({ ...prev, nome: value }));
                  if (patioFormErrors.nome) setPatioFormErrors((prev) => ({ ...prev, nome: null }));
                }}
                placeholder={t('patio.fields.namePlaceholder')}
                placeholderTextColor={themeColors.mutedText}
              />
              {!!patioFormErrors.nome && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{patioFormErrors.nome}</Text>
              )}

              <Text style={[styles.modalLabel, { color: themeColors.text }]}>
                {t('patio.fields.address')}
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalTextArea,
                  {
                    borderColor: patioFormErrors.endereco ? themeColors.error : themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                value={patioForm.endereco}
                onChangeText={(value) => {
                  setPatioForm((prev) => ({ ...prev, endereco: value }));
                  if (patioFormErrors.endereco) setPatioFormErrors((prev) => ({ ...prev, endereco: null }));
                }}
                placeholder={t('patio.fields.addressPlaceholder')}
                placeholderTextColor={themeColors.mutedText}
                multiline
                numberOfLines={3}
              />
              {!!patioFormErrors.endereco && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{patioFormErrors.endereco}</Text>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: themeColors.accent, opacity: isSubmittingPatio ? 0.7 : 1 },
                  ]}
                  onPress={handleSubmitPatio}
                  disabled={isSubmittingPatio}
                >
                  {isSubmittingPatio ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>
                      {patioForm.id ? t('patio.update') : t('patio.save')}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#9E9E9E' }]}
                  onPress={closePatioModal}
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
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 60,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    elevation: 3,
  },
  patioCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardLine: {
    fontSize: 15,
    marginBottom: 4,
  },
  cardLineLabel: {
    fontWeight: 'bold',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  retryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  statusOptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectorPreviewBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  sectorPreviewTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sectorPreviewLine: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginBottom: 6,
  },
});

