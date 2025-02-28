"use client";

import Loader from "@/components/Loader";
import { capitalizeFirstChar } from "@/utils";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";
import Link from "next/link";
import { useCarehomeStore } from "@/store/fetch/useCarehomes";
import { useEffect } from "react";

export default function CarehomesPage() {
  const { carehomes, loading, error, fetchCarehomes } = useCarehomeStore();

  useEffect(() => {
    fetchCarehomes();
  }, [fetchCarehomes]);

  // Use the pagination hook
  const {
    paginatedItems: paginatedCarehomes,
    currentPage,
    startIndex,
  } = usePagination(carehomes, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

  if (error)
    return (
      <>
        <p>Error: {error}</p>
      </>
    );

  if (!loading && carehomes.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Carehomes</h1>
        <div className="my-6">No carehome found</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Carehomes ({carehomes.length})
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {carehomes.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p>No carebusiness found for the selected filter.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Owner email</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCarehomes.map((carehome, index) => (
                    <tr
                      key={carehome.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-2">{startIndex + index + 1}</td>
                      <td className="py-2">{carehome?.name} </td>
                      <td className="py-2">
                        {carehome.careBusiness?.businessEmail}
                      </td>
                      <td className="py-2 capitalize">
                        {capitalizeFirstChar(carehome.isApproved)}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/dashboard/carehomes/${carehome.id}`}
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
                totalItems={carehomes.length}
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
