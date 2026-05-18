const APP_URL = '/construction-site-tracker/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', event => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: '工程管理系統', body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || '工程管理系統', {
      body: data.body || '',
      icon: APP_URL + 'icon-192.png',
      badge: APP_URL + 'icon-192.png',
      data: { url: data.url || APP_URL },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || APP_URL;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('construction-site-tracker') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
