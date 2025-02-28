"use client";

import Loader from "@/components/Loader";
import { useFetchDataStore } from "@/store/useFetchData";
import { useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";

export default function AllUsers() {
  const { totalUsers, loading, initialized, fetchTotalUsers } =
    useFetchDataStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTotalUsers();
  }, [fetchTotalUsers]);

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

  // Use the pagination hook
  const {
    paginatedItems: paginatedUsers,
    currentPage,
    startIndex,
  } = usePagination(filteredUsers, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

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
                <th className="py-2">Actions</th>
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

          <Pagination
            totalItems={filteredUsers.length}
            itemsPerPage={50}
            currentPage={currentPage}
            preserveParams={true}
          />
        </div>
      ) : (
        <div>
          <p>There are no users</p>
        </div>
      )}
    </div>
  );
}
