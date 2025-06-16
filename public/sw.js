
const CACHE_NAME = 'psi-unomed-v2';
const urlsToCache = [
  '/',
  '/employee-portal',
  '/auth/employee',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache recursos essenciais
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto, adicionando recursos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Recursos cached com sucesso');
        // Força a ativação imediata do novo SW
        return self.skipWaiting();
      })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker ativado');
      // Toma controle de todas as abas imediatamente
      return self.clients.claim();
    })
  );
});

// Fetch event - estratégia cache first para recursos estáticos
self.addEventListener('fetch', (event) => {
  // Skip para requests que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip para requests de API externa
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('api.')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrou no cache, retorna
        if (response) {
          console.log('[SW] Servindo do cache:', event.request.url);
          return response;
        }

        // Se não encontrou, busca na rede
        console.log('[SW] Buscando na rede:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Se falhou na rede, tenta servir uma página offline básica
            if (event.request.destination === 'document') {
              return new Response(
                '<html><body><h1>PSI Unomed</h1><p>Você está offline. Conecte-se à internet para acessar o sistema.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
          });
      }
    )
  );
});

// Evento para notificações push (futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  // Implementar notificações push no futuro
});

// Log de instalação bem-sucedida
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker PSI Unomed carregado');
