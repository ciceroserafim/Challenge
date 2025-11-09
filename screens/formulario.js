import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { registrarNotificacoes, enviarNotificacaoLocal } from '../utils/notifications';
import { MotoApi, PatioApi } from '../services/api';
import { buildStatusOptions, getSetorPreview } from '../utils/statusMetadata';

export default function Formulario({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('');
  const [patioSelecionado, setPatioSelecionado] = useState('');
  const [patios, setPatios] = useState([]);
  const [carregandoPatios, setCarregandoPatios] = useState(true);
  const [submetendo, setSubmetendo] = useState(false);
  const [errors, setErrors] = useState({});
  const [patiosError, setPatiosError] = useState(null);

  const statusOptions = useMemo(() => buildStatusOptions(t), [t]);

  useEffect(() => {
    const verificarPermissoes = async () => {
      await registrarNotificacoes();
    };
    verificarPermissoes();
  }, []);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const normalizePatioList = useCallback((data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.content)) return data.content;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.patios)) return data.patios;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.results)) return data.results;
    }
    return [];
  }, []);

  const carregarPatios = useCallback(async () => {
    setCarregandoPatios(true);
    setPatiosError(null);
    try {
      const dados = await PatioApi.list();
      const listaPatios = normalizePatioList(dados);
      if (isMountedRef.current) {
        setPatios(listaPatios);
        if (listaPatios.length > 0) {
          setPatioSelecionado((prev) => prev || listaPatios[0].nome);
        } else {
          setPatioSelecionado('');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pátios:', error);
      if (!isMountedRef.current) return;

      if (error.code === 'NETWORK_ERROR') {
        setPatiosError(t('form.errors.network'));
        return;
      }

      if (error.code === 'AUTH_TOKEN_MISSING') {
        Alert.alert(
          t('form.errors.authTitle'),
          t('form.errors.authMessage'),
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
      } else {
        setPatiosError(
          error.body?.message || error.message || t('form.errors.loadPatiosGeneric')
        );
      }
    } finally {
      if (isMountedRef.current) {
        setCarregandoPatios(false);
      }
    }
  }, [navigation, t, normalizePatioList]);

  useEffect(() => {
    carregarPatios();
  }, [carregarPatios]);

  const setorPreview = getSetorPreview(status);

  const limparFormulario = () => {
    setModelo('');
    setPlaca('');
    setDescricao('');
    setStatus('');
    setErrors({});
  };

  const validar = () => {
    const novosErros = {};
    const modeloTrim = modelo.trim();
    const placaNormalizada = placa.trim().toUpperCase();
    const descricaoTrim = descricao.trim();

    if (!modeloTrim) {
      novosErros.modelo = t('form.errors.modelRequired');
    }
    if (!placaNormalizada) {
      novosErros.placa = t('form.errors.plateRequired');
    } else if (!/^[A-Z0-9]{7}$/.test(placaNormalizada)) {
      novosErros.placa = t('form.errors.plateFormat');
    }
    if (!status) {
      novosErros.status = t('form.errors.statusRequired');
    }
    if (!patioSelecionado) {
      novosErros.patio = t('form.errors.patioRequired');
    }
    if (!descricaoTrim) {
      novosErros.descricao = t('form.errors.descriptionRequired');
    }

    setErrors(novosErros);

    return {
      valido: Object.keys(novosErros).length === 0,
      placaNormalizada,
      modeloTrim,
      descricaoTrim,
    };
  };

  const handleSalvar = async () => {
    const { valido, modeloTrim, placaNormalizada, descricaoTrim } = validar();
    if (!valido) return;

    setSubmetendo(true);

    try {
      await MotoApi.create({
        modelo: modeloTrim,
        placa: placaNormalizada,
        status,
        descricao: descricaoTrim,
        nomePatio: patioSelecionado,
      });

      try {
        await enviarNotificacaoLocal(
          t('form.notification.title'),
          t('form.notification.body', {
            model: modeloTrim,
            plate: placaNormalizada,
            patio: patioSelecionado,
          })
        );
      } catch (notifError) {
        console.log('Erro ao enviar notificação:', notifError);
      }

      Alert.alert('Sucesso', t('form.success'));
      limparFormulario();
      navigation.navigate('Patio');
    } catch (error) {
      console.error('Erro ao salvar moto:', error);
      if (error.code === 'AUTH_TOKEN_MISSING') {
        Alert.alert(
          t('form.errors.authTitle'),
          t('form.errors.authMessage'),
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      if (error.code === 'NETWORK_ERROR') {
        Alert.alert('Erro', t('form.errors.network'));
        return;
      }

      const mensagens = [];
      if (error.body) {
        if (Array.isArray(error.body.errors)) {
          mensagens.push(...error.body.errors.map((e) => e.defaultMessage || e.message));
        }
        if (error.body.message) {
          mensagens.push(error.body.message);
        }
      }

      Alert.alert(
        'Erro',
        mensagens.length > 0 ? mensagens.join('\n') : t('form.errors.saveError')
      );
    } finally {
      setSubmetendo(false);
    }
  };

  const themeColors = {
    background: theme.modoEscuro ? '#171717' : '#FFFFFF',
    card: theme.modoEscuro ? '#252525' : '#F2F2F2',
    text: theme.modoEscuro ? '#FFFFFF' : '#1E1E1E',
    border: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
    placeholder: theme.modoEscuro ? '#B0B0B0' : '#666666',
    error: '#F44336',
    buttonBackground: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
    buttonText: '#FFFFFF',
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        {t('form.title')}
      </Text>

      <View style={[styles.fieldContainer, { borderColor: themeColors.border }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          {t('form.model')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.card,
              color: themeColors.text,
              borderColor: errors.modelo ? themeColors.error : themeColors.border,
            },
          ]}
          value={modelo}
          onChangeText={(value) => {
            setModelo(value);
            if (errors.modelo) setErrors((prev) => ({ ...prev, modelo: null }));
          }}
          placeholder={t('form.enterModel')}
          placeholderTextColor={themeColors.placeholder}
        />
        {!!errors.modelo && (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.modelo}</Text>
        )}
      </View>

      <View style={[styles.fieldContainer, { borderColor: themeColors.border }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          {t('form.plate')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.card,
              color: themeColors.text,
              borderColor: errors.placa ? themeColors.error : themeColors.border,
            },
          ]}
          value={placa}
          onChangeText={(value) => {
            setPlaca(value.toUpperCase());
            if (errors.placa) setErrors((prev) => ({ ...prev, placa: null }));
          }}
          autoCapitalize="characters"
          placeholder={t('form.enterPlate')}
          placeholderTextColor={themeColors.placeholder}
          maxLength={7}
        />
        {!!errors.placa && (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.placa}</Text>
        )}
      </View>

      <View style={[styles.fieldContainer, { borderColor: themeColors.border }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          {t('form.description')}
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: themeColors.card,
              color: themeColors.text,
              borderColor: errors.descricao ? themeColors.error : themeColors.border,
            },
          ]}
          value={descricao}
          onChangeText={(value) => {
            setDescricao(value);
            if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: null }));
          }}
          placeholder={t('form.descriptionPlaceholder')}
          placeholderTextColor={themeColors.placeholder}
          multiline
          numberOfLines={4}
        />
        {!!errors.descricao && (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.descricao}</Text>
        )}
      </View>

      <View style={[styles.fieldContainer, { borderColor: themeColors.border }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>
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
                  borderColor: status === option.value ? '#FFFFFF' : 'transparent',
                  borderWidth: status === option.value ? 3 : 1,
                },
              ]}
              onPress={() => {
                setStatus(option.value);
                if (errors.status) setErrors((prev) => ({ ...prev, status: null }));
              }}
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
        {!!errors.status && (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.status}</Text>
        )}
      </View>

      {setorPreview && (
        <View
          style={[
            styles.sectorCard,
            {
              backgroundColor: themeColors.card,
              borderColor: setorPreview.color,
            },
          ]}
        >
          <Text style={[styles.sectorTitle, { color: themeColors.text }]}>
            {t('form.sectorPreview.title')}
          </Text>
          <Text style={[styles.sectorLine, { color: themeColors.text }]}>
            {t('form.sectorPreview.setor', { setor: setorPreview.setor })}
          </Text>
          <Text style={[styles.sectorLine, { color: themeColors.text }]}>
            {t('form.sectorPreview.color', { color: setorPreview.corSetor })}
          </Text>
        </View>
      )}

      <View style={[styles.fieldContainer, { borderColor: themeColors.border }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          {t('form.patio')}
        </Text>
        {carregandoPatios ? (
          <ActivityIndicator size="small" color={themeColors.buttonBackground} />
        ) : patiosError ? (
          <View style={styles.patioErrorContainer}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>{patiosError}</Text>
            <TouchableOpacity
              onPress={carregarPatios}
            >
              <Text style={[styles.retryText, { color: themeColors.buttonBackground }]}>
                {t('form.retry')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor: themeColors.card,
                borderColor: errors.patio ? themeColors.error : themeColors.border,
              },
            ]}
          >
            <Picker
              selectedValue={patioSelecionado}
              onValueChange={(value) => {
                setPatioSelecionado(value);
                if (errors.patio) setErrors((prev) => ({ ...prev, patio: null }));
              }}
              dropdownIconColor={themeColors.text}
            >
              {patios.map((patio) => (
                <Picker.Item key={patio.id} label={patio.nome} value={patio.nome} color={themeColors.text} />
              ))}
            </Picker>
          </View>
        )}
        {!!errors.patio && (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errors.patio}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: themeColors.buttonBackground, opacity: submetendo ? 0.7 : 1 },
        ]}
        onPress={handleSalvar}
        disabled={submetendo}
      >
        {submetendo ? (
          <ActivityIndicator size="small" color={themeColors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {t('form.save')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectorCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectorLine: {
    fontSize: 14,
  },
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1.2,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  patioErrorContainer: {
    alignItems: 'flex-start',
  },
  retryText: {
    marginTop: 6,
    fontWeight: '600',
  },
});
