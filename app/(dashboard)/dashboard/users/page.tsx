"use client";

import Loader from "@/components/Loader";
import { useFetchDataStore } from "@/store/useFetchData";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import Link from "next/link";

export default function AllUsers() {
  const { totalUsers, loading, initialized, fetchTotalUsers } =
    useFetchDataStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTotalUsers();
  }, [fetchTotalUsers]);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const filter = searchParams.get("filter") || "all";

  // Memoize handleFilterChange since it's passed to multiple buttons
  const handleFilterChange = useCallback(
    (newFilter: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("filter", newFilter);
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Memoize filtered users since it's an expensive operation
  const filteredUsers = useMemo(
    () =>
      filter === "all"
        ? totalUsers
        : totalUsers.filter(
            (user) => user.accountType?.toLowerCase() === filter.toLowerCase()
          ),
    [totalUsers, filter]
  );

  // Memoize pagination calculations
  const { totalPages, paginatedUsers, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return { totalPages, paginatedUsers, startIndex };
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Memoize page change handler
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
      setCurrentPage(page);
    },
    [searchParams, router]
  );

  // Memoize page numbers generation
  const pageNumbers = useMemo(() => {
    const numbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [currentPage, totalPages]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        All Users ({filteredUsers.length})
      </h1>

      <div className="flex gap-4 mb-6">
        {["all", "family", "provider", "student"].map((filterType) => (
          <button
            key={filterType}
            className={`px-4 py-2 rounded ${
              filter === filterType ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => handleFilterChange(filterType)}
          >
            {filterType === "all"
              ? "All Users"
              : capitalizeFirstChar(filterType)}
          </button>
        ))}
      </div>

      {!initialized || loading ? (
        <Loader />
      ) : totalUsers.length > 0 ? (
        <div className="w-full bg-white shadow rounded-lg p-6">
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="border-b">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Account Type</th>
                <th className="py-2">Verified</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-2">{startIndex + index + 1}</td>
                  <td className="py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-2">
                    {capitalizeFirstChar(user.accountType)}
                  </td>
                  <td className="py-2">
                    {user.isApproved ? "Verified" : "Not verified"}
                  </td>
                  <td className="py-2">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="flex items-center gap-1 text-secondaryHover font-semibold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>There are no users</p>
        </div>
      )}
    </div>
  );
}
