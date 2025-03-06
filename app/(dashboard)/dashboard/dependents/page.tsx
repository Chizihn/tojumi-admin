"use client";

import Loader from "@/components/Loader";
import React, { useEffect } from "react";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";
import Link from "next/link";
import { useDependentStore } from "@/store/fetch/useDependents";

export default function DependentsPage() {
  const { dependents, loading, error, fetchDependents } = useDependentStore();

  useEffect(() => {
    fetchDependents();
  }, [fetchDependents]);

  // Use the pagination hook
  const {
    paginatedItems: paginatedDependents,
    currentPage,
    startIndex,
  } = usePagination(dependents, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

  if (error) return <p>Error: {error}</p>;

  if (!loading && dependents.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dependents</h1>
        <div className="my-6">No dependent found</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Dependent ({dependents.length})
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {dependents.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p>No dependent found for the selected filter.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Phone No</th>
                    <th className="py-2">Location</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDependents.map((dependent, index) => (
                    <tr
                      key={dependent.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-2">{startIndex + index + 1}</td>
                      <td className="py-2">
                        {dependent?.firstName} {dependent?.lastName}
                      </td>
                      <td className="py-2">{dependent?.phoneNo}</td>
                      <td className="py-2 capitalize">
                        {dependent.state} {dependent.country}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/dashboard/dependents/${dependent.id}`}
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
                totalItems={dependents.length}
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
