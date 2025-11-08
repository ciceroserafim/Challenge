import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura como as notificações são exibidas quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para solicitar permissão e pegar o token (caso queira push real futuramente)
export async function registrarNotificacoes() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão para notificações negada!');
    return null;
  }

  // Retorna o token do dispositivo (para uso com backend)
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Token:', token);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00FF7F',
    });
  }

  return token;
}

// Função para disparar uma notificação local
export async function enviarNotificacaoLocal(titulo, corpo) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
      sound: true,
      vibrate: [200, 100, 200],
    },
    trigger: null, // envia imediatamente
  });
}
