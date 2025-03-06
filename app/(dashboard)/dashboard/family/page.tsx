"use client";

import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";
import Link from "next/link";
import { useFamilyStore } from "@/store/fetch/useFamily";

export default function FamiliesPage() {
  const [filter, setFilter] = useState<boolean | "all">("all");
  const { familyUsers, loading, error, fetchFamilyUsers } = useFamilyStore();

  useEffect(() => {
    fetchFamilyUsers();
  }, [fetchFamilyUsers]);

  // Apply filtering based on isApproved (boolean)
  const filteredFamily =
    filter === "all"
      ? familyUsers
      : familyUsers.filter((family) => family.user.isApproved === filter);

  // Use the pagination hook
  const {
    paginatedItems: paginatedFamily,
    currentPage,
    startIndex,
  } = usePagination(filteredFamily, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

  if (error) return <p>Error: {error}</p>;

  if (!loading && familyUsers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Family</h1>
        <div className="my-6">No family found</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Family ({filteredFamily.length})
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            {[
              { label: "All", value: "all" },
              { label: "Verified", value: true },
              { label: "Not Verified", value: false },
            ].map(({ label, value }) => (
              <button
                key={label}
                className={`px-4 py-2 rounded ${
                  filter === value
                    ? value === true
                      ? "bg-green-500 text-white"
                      : value === false
                      ? "bg-red-500 text-white"
                      : "bg-primary text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setFilter(value as boolean | "all")}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredFamily.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p>No family found for the selected filter.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFamily.map((family, index) => (
                    <tr
                      key={family.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-2">{startIndex + index + 1}</td>
                      <td className="py-2">
                        {family?.user?.firstName} {family?.user?.lastName}
                      </td>
                      <td className="py-2">{family?.user?.email}</td>
                      <td className="py-2 capitalize">
                        {family?.user?.isApproved ? "Verified" : "Not Verified"}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/dashboard/family/${family.id}`}
                          className="flex items-center gap-1 text-secondaryHover font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Component */}
              <Pagination
                totalItems={filteredFamily.length}
                itemsPerPage={50}
                currentPage={currentPage}
                preserveParams={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
