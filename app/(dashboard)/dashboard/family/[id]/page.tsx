"use client";

import Loader from "@/components/Loader";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import { useFamilyStore } from "@/store/fetch/useFamily";

export default function FamilyDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    familyUser: family,
    loading,
    error,
    fetchFamilyUser,
  } = useFamilyStore();

  useEffect(() => {
    fetchFamilyUser(params.id);
  }, [fetchFamilyUser, params.id]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/family")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Families
        </button>
        <div className=" flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/family")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Families
        </button>
        <div className="flex items-center justify-center">
          <p className="text-red-500">Error fetching family details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/dashboard/family")}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Families
      </button>

      {family ? (
        <div className="space-y-6">
          {/* User Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-2">
              {family.user.firstName} {family.user.lastName}
            </h1>
            <p className="text-gray-600">Email: {family.user.email}</p>
            <p className="text-gray-600">Phone: {family.user.phoneNo}</p>
            <p className="text-gray-600">
              Gender: {capitalizeFirstChar(family.user.gender || "N/A")}
            </p>
            <p className="text-gray-600">
              Date of Birth:{" "}
              {family.user.dob
                ? new Date(family.user.dob).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <p>Country: {family.user.country || "N/A"}</p>
            <p>State: {family.user.state || "N/A"}</p>
            <p>City: {family.user.city || "N/A"}</p>
            <p>Address: {family.user.address || "N/A"}</p>
          </div>

          {/* Approval Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Account Status</h2>
            <p className="capitalize">
              {family.user.isApproved ? "Approved" : "Pending Approval"}
            </p>
          </div>

          {/* Dependents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Dependents</h2>
            {family.dependents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {family.dependents.map((dependent) => (
                  <div key={dependent.id} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-bold">
                      {dependent.firstName} {dependent.lastName}
                    </h3>
                    <p>Phone: {dependent.phoneNo}</p>
                    <p>Relationship: {dependent.relationship}</p>
                    <p>Address: {dependent.address}</p>
                    <p>
                      Medical Concerns:{" "}
                      {dependent.medicalConcerns.length > 0
                        ? dependent.medicalConcerns.join(", ")
                        : "None"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No dependents listed.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>Family not found</p>
        </div>
      )}
    </div>
  );
}
