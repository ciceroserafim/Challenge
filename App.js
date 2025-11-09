import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';

import Primeira from './screens/primeira';
import Login from './screens/login';
import Escolha from './screens/escolha';
import Patio from './screens/patio';
import Configuracao from './screens/configuracao';
import Desenvolvedores from './screens/desenvolvedores';
import Cadastro from './screens/cadastro';
import Formulario from './screens/formulario';
import EsqueciSenha from './screens/EsqueceuSenha';

const Stack = createNativeStackNavigator();

// 🔔 Configura o comportamento das notificações (como serão exibidas)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Pede permissão para enviar notificações
      const pedirPermissao = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          // A mensagem será exibida na tela de login se necessário
        }
      };

    pedirPermissao();

    // (opcional) Escuta quando uma notificação é recebida
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificação recebida:', notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <I18nProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Primeira"
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 400,
            }}
          >
            <Stack.Screen name="Primeira" component={Primeira} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Escolha" component={Escolha} />
            <Stack.Screen name="Patio" component={Patio} />
            <Stack.Screen name="Formulario" component={Formulario} />
            <Stack.Screen name="Configuracao" component={Configuracao} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
            <Stack.Screen
              name="Desenvolvedores"
              component={Desenvolvedores}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </I18nProvider>
  );
}
