import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - данные считаются свежими
      gcTime: 5 * 60 * 1000, // 5 minutes - время хранения в кэше
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 2; // Уменьшили количество попыток
      },
      refetchOnWindowFocus: false, // Не перезагружать при фокусе
      refetchOnReconnect: true, // Перезагружать при восстановлении соединения
      refetchOnMount: true, // Всегда загружать при монтировании
    },
    mutations: {
      retry: false,
    },
  },
});
