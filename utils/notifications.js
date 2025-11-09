import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura como as notificações aparecem quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicita permissão e retorna o token
export async function registrarNotificacoes() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão para notificações negada!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

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

// Dispara uma notificação local (já existente)
export async function enviarNotificacaoLocal(titulo, corpo) {
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo, sound: true },
    trigger: null,
  });
}

// **Envia notificação push via Expo**
export async function enviarPush(token, titulo, corpo) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: token, title: titulo, body: corpo, sound: 'default' }),
  });
}
