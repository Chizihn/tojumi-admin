"use client";

import Loader from "@/components/Loader";
import { Guarantor } from "@/types/user";
import { capitalizeFirstChar } from "@/utils";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";
import Link from "next/link";
import client from "@/lib/client";
import { GET_GUARANTORS } from "@/graphql/queries";

export default function GuarantorsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.query({
        query: GET_GUARANTORS,
      });

      const fetchedGuarantors = response?.data?.getGuarantors;

      if (!fetchedGuarantors) {
        setGuarantors([]);
      } else {
        setGuarantors(fetchedGuarantors);
      }
    } catch (error) {
      setError("Failed to fetch guarantors. Please try again.");
      console.error("Error fetching guarantors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Add dependency array to prevent infinite re-renders

  // Use the pagination hook
  const {
    paginatedItems: paginatedGuarantors,
    currentPage,
    startIndex,
  } = usePagination(guarantors, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Guarantors</h1>
        <div className="bg-white shadow rounded-lg p-6 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!loading && guarantors.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Guarantors</h1>
        <div className="bg-white shadow rounded-lg p-6 text-center my-6">
          No guarantors found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Guarantors ({guarantors.length})
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">#</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuarantors.map((guarantor, index) => (
                  <tr
                    key={guarantor.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-2">{startIndex + index + 1}</td>
                    <td className="py-2">
                      {guarantor.firstName} {guarantor.lastName}
                    </td>
                    <td className="py-2">{guarantor.email}</td>
                    <td className="py-2">{guarantor.phoneNo || "N/A"}</td>
                    <td className="py-2 capitalize">
                      {capitalizeFirstChar(guarantor.verified)}
                    </td>
                    <td className="py-2">
                      <Link
                        href={`/dashboard/guarantors/${guarantor.id}`}
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
              totalItems={guarantors.length}
              itemsPerPage={50}
              currentPage={currentPage}
              preserveParams={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
