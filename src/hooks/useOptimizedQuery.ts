
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<T>;
  dependencies?: unknown[];
}

/**
 * Hook otimizado para queries com memoização automática
 */
export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  dependencies = [],
  ...options
}: OptimizedQueryOptions<T>) {
  // Memoizar a query key para evitar re-renders desnecessários
  const memoizedQueryKey = useMemo(() => {
    return [...queryKey, ...dependencies];
  }, [queryKey, dependencies]);

  // Memoizar a query function
  const memoizedQueryFn = useMemo(() => queryFn, dependencies);

  return useQuery({
    queryKey: memoizedQueryKey,
    queryFn: memoizedQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Hook para queries que dependem de parâmetros do usuário
 */
export function useUserDependentQuery<T>({
  queryKey,
  queryFn,
  userId,
  companyId,
  ...options
}: OptimizedQueryOptions<T> & {
  userId?: string;
  companyId?: string;
}) {
  return useOptimizedQuery({
    queryKey,
    queryFn,
    dependencies: [userId, companyId],
    enabled: !!(userId || companyId),
    ...options,
  });
}
