export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('AirGuard offline worker registered:', reg.scope))
        .catch((err) => console.debug('Worker offline registration bypassed:', err));
    });
  }
}
