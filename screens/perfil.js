import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { MotiView, MotiText } from 'moti';

export default function Perfil({ navigation }) {
  const theme = useTheme();
  const { t } = useI18n();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    carregarUsuario();
    
    const unsubscribe = navigation.addListener('focus', () => {
      carregarUsuario();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarUsuario = async () => {
    try {
      const emailLogado = await AsyncStorage.getItem('@logado_email');
      if (emailLogado) {
        const userJSON = await AsyncStorage.getItem(`@usuario_${emailLogado}`);
        if (userJSON) {
          const user = JSON.parse(userJSON);
          setUsuario(user);
          setNome(user.nome);
          setCpf(user.cpf);
          setEmail(user.email);
          setSenha('');
          setConfirmarSenha('');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      Alert.alert('Erro', t('profile.errors.loadError'));
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleSalvar = async () => {
    if (!nome || !cpf || !email) {
      Alert.alert('Erro', t('profile.errors.fillFields'));
      return;
    }

    if (senha && senha !== confirmarSenha) {
      Alert.alert('Erro', t('register.errors.passwordsNoMatch'));
      return;
    }

    if (cpf.length !== 11 || isNaN(Number(cpf))) {
      Alert.alert('Erro', t('register.errors.invalidCpf'));
      return;
    }

    try {
      const emailLogado = await AsyncStorage.getItem('@logado_email');
      if (!emailLogado) {
        Alert.alert('Erro', t('profile.errors.noUser'));
        return;
      }

      // Se o email foi alterado, precisamos atualizar a chave no AsyncStorage
      const usuarioAtualizado = {
        nome,
        cpf,
        email,
        senha: senha || usuario.senha, // Mantém a senha antiga se não foi alterada
      };

      // Se o email mudou, remove o antigo e cria um novo
      if (email !== emailLogado) {
        await AsyncStorage.removeItem(`@usuario_${emailLogado}`);
        await AsyncStorage.setItem(`@usuario_${email}`, JSON.stringify(usuarioAtualizado));
        await AsyncStorage.setItem('@logado_email', email);
      } else {
        // Se o email não mudou, apenas atualiza
        await AsyncStorage.setItem(`@usuario_${email}`, JSON.stringify(usuarioAtualizado));
      }

      setUsuario(usuarioAtualizado);
      setEditando(false);
      setSenha('');
      setConfirmarSenha('');
      Alert.alert('Sucesso', t('profile.success.update'));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      Alert.alert('Erro', t('profile.errors.updateError'));
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    if (usuario) {
      setNome(usuario.nome);
      setCpf(usuario.cpf);
      setEmail(usuario.email);
      setSenha('');
      setConfirmarSenha('');
    }
  };

  const handleExcluir = () => {
    Alert.alert(t('profile.confirmDelete'), t('profile.confirmDeleteMessage'), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('settings.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            const emailLogado = await AsyncStorage.getItem('@logado_email');
            if (emailLogado) {
              await AsyncStorage.removeItem(`@usuario_${emailLogado}`);
              await AsyncStorage.removeItem('@logado_email');
              Alert.alert(t('profile.accountDeleted'), t('profile.accountDeletedMessage'));
              navigation.replace('Login');
            } else {
              Alert.alert('Erro', t('profile.errors.noUser'));
            }
          } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Alert.alert('Erro', t('profile.errors.deleteError'));
          }
        },
      },
    ]);
  };

  if (!usuario) {
    return (
      <View style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
        <Text style={[styles.loadingText, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
          {t('profile.loading')}
        </Text>
      </View>
    );
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff',
      borderColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32',
      color: theme.modoEscuro ? '#fff' : '#222',
    },
  ];

  const placeholderColor = theme.modoEscuro ? '#888' : '#666';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.modoEscuro ? '#121212' : '#f2f2f2' }]}>
      <MotiText
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[styles.title, { color: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
      >
        {t('profile.title')}
      </MotiText>

      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000, delay: 300 }}
        style={[styles.card, { backgroundColor: theme.modoEscuro ? '#1E1E1E' : '#fff' }]}
      >
        <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#222' }]}>{t('register.name')}</Text>
        <TextInput
          style={inputStyle}
          placeholderTextColor={placeholderColor}
          value={nome}
          onChangeText={setNome}
          editable={editando}
          placeholder={t('register.name')}
        />

        <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#222' }]}>{t('register.cpf')}</Text>
        <TextInput
          style={inputStyle}
          placeholderTextColor={placeholderColor}
          value={cpf}
          onChangeText={setCpf}
          editable={editando}
          keyboardType="numeric"
          maxLength={11}
          placeholder={t('register.cpf')}
        />

        <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#222' }]}>{t('register.email')}</Text>
        <TextInput
          style={inputStyle}
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          editable={editando}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t('register.email')}
        />

        {editando && (
          <>
            <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
              {t('register.password')} {t('profile.optional')}
            </Text>
            <TextInput
              style={inputStyle}
              placeholderTextColor={placeholderColor}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder={t('register.password')}
            />

            {senha ? (
              <>
                <Text style={[styles.label, { color: theme.modoEscuro ? '#fff' : '#222' }]}>
                  {t('register.confirmPassword')}
                </Text>
                <TextInput
                  style={inputStyle}
                  placeholderTextColor={placeholderColor}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                  placeholder={t('register.confirmPassword')}
                />
              </>
            ) : null}
          </>
        )}

        <View style={styles.buttonContainer}>
          {!editando ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.editButton, { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
                onPress={handleEditar}
              >
                <Text style={styles.buttonText}>{t('profile.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, { backgroundColor: '#F44336' }]}
                onPress={handleExcluir}
              >
                <Text style={styles.buttonText}>{t('profile.delete')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: theme.modoEscuro ? '#00FF7F' : '#2E7D32' }]}
                onPress={handleSalvar}
              >
                <Text style={styles.buttonText}>{t('profile.save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: '#9E9E9E' }]}
                onPress={handleCancelar}
              >
                <Text style={styles.buttonText}>{t('profile.cancel')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 50,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  editButton: {},
  deleteButton: {},
  saveButton: {},
  cancelButton: {},
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

