"use client";

import Loader from "@/components/Loader";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDependentStore } from "@/store/fetch/useDependents";

export default function DependentDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { dependent, loading, error, fetchDependent } = useDependentStore();

  useEffect(() => {
    fetchDependent(params.id);
  }, [fetchDependent, params.id]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/dependents")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Dependents
        </button>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/dependents")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Dependents
        </button>
        <div className="flex items-center justify-center">
          <p className="text-red-500">Error fetching dependent details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/dashboard/dependents")}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Dependents
      </button>

      {dependent ? (
        <div className="space-y-6">
          {/* Dependent Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-2">
              {dependent.firstName} {dependent.lastName}
            </h1>
            <p className="text-gray-600">Phone: {dependent.phoneNo}</p>
            <p className="text-gray-600">
              Relationship to Family: {dependent.relationship}
            </p>
            <p className="text-gray-600">
              Date of Birth:{" "}
              {dependent.dateOfBirth
                ? new Date(dependent.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-gray-600">
              Medical Concerns:{" "}
              {dependent.medicalConcerns.length > 0
                ? dependent.medicalConcerns.join(", ")
                : "None"}
            </p>
          </div>

          {/* Family Details */}
          {dependent.family && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Family Information</h2>
              <p>
                Guardian: {dependent.family.user.firstName}{" "}
                {dependent.family.user.lastName}
              </p>
              <p>Email: {dependent.family.user.email}</p>
              <p>Phone: {dependent.family.user.phoneNo}</p>
              <p>Address: {dependent.family.user.address}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>Dependent not found</p>
        </div>
      )}
    </div>
  );
}
