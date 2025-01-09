"use client";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import Image from "next/image";
import React, { useState } from "react";

const mockStudents = [
  {
    id: 1,
    name: "Jane Doe",
    status: "approved",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-05-12",
  },
  {
    id: 2,
    name: "Alice Johnson",
    status: "paused",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-03-20",
  },
  {
    id: 3,
    name: "Chris Lee",
    status: "rejected",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-07-15",
  },
  {
    id: 4,
    name: "David Brown",
    status: "approved",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-02-10",
  },
  {
    id: 5,
    name: "Emily Davis",
    status: "paused",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-09-08",
  },
];

export default function StudentsPage() {
  const [filter, setFilter] = useState("all");

  const filteredStudents =
    filter === "all"
      ? mockStudents
      : mockStudents.filter((student) => student.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-primary text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "approved" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "paused" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("paused")}
        >
          Paused
        </button>
      </div>

      {/* Students List */}
      <div className="bg-white shadow rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">#</th>
              <th className="py-2">Profile</th>
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">
                  <div className="w-10 h-10 relative">
                    <Image
                      src={student.profileImage}
                      alt={`${student.name}'s profile`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                      priority
                    />
                  </div>
                </td>
                <td className="py-2">{student.name}</td>
                <td className="py-2 capitalize">{student.status}</td>
                <td className="py-2">{student.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
