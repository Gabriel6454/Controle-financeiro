import { Reminder } from '../types';
import { formatCurrency } from '../constants';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const checkAndSendNotifications = async (reminders: Reminder[]) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date();
  const currentDay = today.getDate();
  const lastNotifiedDate = localStorage.getItem('finance_last_notified');
  const todayStr = today.toISOString().split('T')[0];

  if (lastNotifiedDate === todayStr) return;

  const dueToday = reminders.filter(r => r.isActive && r.dueDate === currentDay);
  const dueTomorrow = reminders.filter(r => r.isActive && r.dueDate === currentDay + 1);

  let notified = false;

  const sendNotification = async (title: string, body: string) => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon: '/vite.svg',
          badge: '/vite.svg',
          data: window.location.origin
        });
      } catch (e) {
        new Notification(title, { body, icon: '/vite.svg' });
      }
    } else {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  };

  for (const r of dueToday) {
    await sendNotification('Conta Vencendo Hoje!', `${r.description} no valor de ${formatCurrency(r.amount)} vence hoje.`);
    notified = true;
  }

  for (const r of dueTomorrow) {
    await sendNotification('Conta Vence Amanhã', `${r.description} no valor de ${formatCurrency(r.amount)} vence amanhã.`);
    notified = true;
  }

  if (notified) {
    localStorage.setItem('finance_last_notified', todayStr);
  }
};
