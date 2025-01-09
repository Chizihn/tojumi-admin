"use client";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import Image from "next/image";
import React, { useState } from "react";

const mockProviders = [
  {
    id: 1,
    name: "Bob Smith",
    status: "approved",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-10-25",
  },
  {
    id: 2,
    name: "Ethan Hunt",
    status: "paused",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-07-10",
  },
  {
    id: 3,
    name: "John Doe",
    status: "rejected",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-09-15",
  },
  {
    id: 4,
    name: "Sara Connor",
    status: "approved",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-08-12",
  },
  {
    id: 5,
    name: "Alex Turner",
    status: "paused",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
    dateCreated: "2023-11-01",
  },
];

export default function ProvidersPage() {
  const [filter, setFilter] = useState("all");

  const filteredProviders =
    filter === "all"
      ? mockProviders
      : mockProviders.filter((provider) => provider.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Providers</h1>

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

      {/* Providers List */}
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
            {filteredProviders.map((provider, index) => (
              <tr
                key={provider.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">
                  <div className="w-10 h-10 relative">
                    <Image
                      src={provider.profileImage}
                      alt={`${provider.name}'s profile`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                      priority
                    />
                  </div>
                </td>
                <td className="py-2">{provider.name}</td>
                <td className="py-2 capitalize">{provider.status}</td>
                <td className="py-2">{provider.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
