"use client";

import Loader from "@/components/Loader";
import { Status } from "@/types/user";
import { capitalizeFirstChar } from "@/utils";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/app/hooks/usePagination";
import Link from "next/link";
import { useStudentStore } from "@/store/fetch/useStudent";

export default function StudentsPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const { studentUsers, loading, error, fetchStudentUsers } = useStudentStore();

  useEffect(() => {
    fetchStudentUsers();
  }, [fetchStudentUsers]);

  const filteredProviders =
    filter === "all"
      ? studentUsers
      : studentUsers.filter((student) => student.isApproved === filter);

  // Use the pagination hook
  const {
    paginatedItems: paginatedProviders,
    currentPage,
    startIndex,
  } = usePagination(filteredProviders, {
    itemsPerPage: 50,
    useQueryParams: true,
  });

  if (error)
    return (
      <>
        <p>Error: {error}</p>
      </>
    );

  if (!loading && studentUsers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Students</h1>
        <div className="my-6">No student found</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Students ({filteredProviders.length})
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            {["all", Status.APPROVED, Status.REJECTED, Status.PENDING].map(
              (status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded ${
                    filter === status
                      ? status === Status.APPROVED
                        ? "bg-green-500 text-white"
                        : status === Status.REJECTED
                        ? "bg-red-500 text-white"
                        : status === Status.PENDING
                        ? "bg-yellow-500 text-white"
                        : "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFilter(status as Status | "all")}
                >
                  {status === "all"
                    ? "All"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              )
            )}
          </div>

          {filteredProviders.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p>No students found for the selected filter.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Level</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProviders.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-2">{startIndex + index + 1}</td>
                      <td className="py-2">
                        {student?.user?.firstName} {student?.user?.lastName}{" "}
                      </td>
                      <td className="py-2">{student.user?.email}</td>
                      <td className="py-2">
                        {capitalizeFirstChar(student.level)}
                      </td>
                      <td className="py-2 capitalize">
                        {capitalizeFirstChar(student.isApproved)}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/dashboard/students/${student.id}`}
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
                totalItems={filteredProviders.length}
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
