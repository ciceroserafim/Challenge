import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';

import Primeira from './screens/primeira';
import Login from './screens/login';
import Escolha from './screens/escolha';
import Patio from './screens/patio';
import Configuracao from './screens/configuracao';
import Desenvolvedores from './screens/desenvolvedores';
import Cadastro from './screens/cadastro';
import Formulario from './screens/formulario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Primeira"
          screenOptions={{
            headerShown: false,
            animation: 'fade', // padrão global: transição suave
            animationDuration: 400,
          }}
        >
          <Stack.Screen name="Primeira" component={Primeira} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Escolha" component={Escolha} />
          <Stack.Screen name="Patio" component={Patio} />
          <Stack.Screen name="Formulario" component={Formulario} />
          <Stack.Screen name="Configuracao" component={Configuracao} />
          <Stack.Screen
            name="Desenvolvedores"
            component={Desenvolvedores}
            options={{
              animation: 'slide_from_bottom',
            }}
          />

          <Stack.Screen name="Cadastro" component={Cadastro} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
