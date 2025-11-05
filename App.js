import 'react-native-reanimated';
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider} from './context/ThemeContext';

import Primeira from './screens/primeira';
import Login from './screens/login';
import Escolha from './screens/escolha';
import Patio from './screens/patio';
import Configuracao from './screens/configuracao';
import Desenvolvedores from './screens/desenvolvedores';
import Cadastro from './screens/cadastro';
import Formulario from './screens/formulario';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
   ata
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: 'purple'
  },
});

export default function App() {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Primeira"> 
        <Stack.Screen name="Escolha" component={Escolha} />
        <Stack.Screen name="Primeira" component={Primeira} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Patio" component={Patio} />
        <Stack.Screen name="Formulario" component={Formulario} />
        <Stack.Screen name="Configuracao" component={Configuracao} />
         <Stack.Screen name="Desenvolvedores" component={Desenvolvedores} />
         <Stack.Screen name="Cadastro" component={Cadastro} />
         

      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}