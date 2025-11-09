import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';

import pt from '../locales/pt.json';
import es from '../locales/es.json';

// Configura os idiomas suportados
const i18n = new I18n({
  pt,
  es,
});

// Define o idioma padrão
i18n.defaultLocale = 'pt';
i18n.enableFallback = true;

// Configura delimitadores para interpolação (usa {{}} ao invés de %{})
i18n.missingTranslation = (key) => key;

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('pt');

  // Carrega o idioma salvo ou detecta o idioma do dispositivo
  useEffect(() => {
    const carregarIdioma = async () => {
      try {
        const idiomaSalvo = await AsyncStorage.getItem('@idioma');
        if (idiomaSalvo) {
          setLocale(idiomaSalvo);
          i18n.locale = idiomaSalvo;
        } else {
          // Detecta o idioma do dispositivo
          const idiomaDispositivo = Localization.locale.split('-')[0];
          const idiomaSuportado = ['pt', 'es'].includes(idiomaDispositivo) ? idiomaDispositivo : 'pt';
          setLocale(idiomaSuportado);
          i18n.locale = idiomaSuportado;
          await AsyncStorage.setItem('@idioma', idiomaSuportado);
        }
      } catch (error) {
        console.error('Erro ao carregar idioma:', error);
        setLocale('pt');
        i18n.locale = 'pt';
      }
    };

    carregarIdioma();
  }, []);

  // Função para trocar o idioma
  const changeLocale = async (novoLocale) => {
    try {
      setLocale(novoLocale);
      i18n.locale = novoLocale;
      await AsyncStorage.setItem('@idioma', novoLocale);
    } catch (error) {
      console.error('Erro ao trocar idioma:', error);
    }
  };

  // Função de tradução
  const t = (key, params = {}) => {
    return i18n.t(key, params);
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de I18nProvider');
  }
  return context;
};

