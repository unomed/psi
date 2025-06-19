
// ===== HOOK DE PAGINAÇÃO =====

import { useState, useMemo } from 'react';

export interface PaginationConfig {
  initialPage?: number;
  pageSize?: number;
  totalItems: number;
}

export function usePagination({ 
  initialPage = 1, 
  pageSize = 10, 
  totalItems 
}: PaginationConfig) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;
    
    return {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      startIndex,
      endIndex,
      canGoPrev,
      canGoNext,
      itemsOnCurrentPage: endIndex - startIndex
    };
  }, [currentPage, pageSize, totalItems]);

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, pagination.totalPages));
    setCurrentPage(clampedPage);
  };

  const goToPrevPage = () => {
    if (pagination.canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination.canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(pagination.totalPages);
  };

  const reset = () => {
    setCurrentPage(initialPage);
  };

  return {
    ...pagination,
    goToPage,
    goToPrevPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
    reset
  };
}
