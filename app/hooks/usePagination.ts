"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UsePaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
  useQueryParams?: boolean;
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
) {
  const { itemsPerPage = 50, initialPage = 1, useQueryParams = true } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync current page with URL if using query params
  useEffect(() => {
    if (useQueryParams) {
      const page = Number(searchParams.get("page")) || initialPage;
      setCurrentPage(page);
    }
  }, [searchParams, initialPage, useQueryParams]);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalItems,
      totalPages,
      startIndex,
      paginatedItems,
      currentPage,
    };
  }, [items, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (useQueryParams) {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
      }
      setCurrentPage(page);
    },
    [searchParams, router, useQueryParams]
  );

  return {
    ...paginationData,
    setPage: handlePageChange,
    itemsPerPage,
  };
}
