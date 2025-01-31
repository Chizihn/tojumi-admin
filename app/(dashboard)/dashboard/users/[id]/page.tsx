"use client";

import Loader from "@/components/Loader";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import { useFetchDataStore } from "@/store/useFetchData";
import Image from "next/image";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCarebusinessStore } from "@/store/fetch/useCarebusiness";
import { useStudentStore } from "@/store/fetch/useStudent";
import { capitalizeFirstChar } from "@/utils";

export default function UserDetail({ params }: { params: { id: string } }) {
  const {
    currentUser,
    loading: userLoading,
    fetchCurrentUser,
  } = useFetchDataStore();
  const {
    carebusiness,
    loading: providerLoading,
    fetchCarebusiness,
  } = useCarebusinessStore();
  const { student, loading: studentLoading, fetchStudent } = useStudentStore();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser(params.id);
  }, [params.id, fetchCurrentUser]);

  useEffect(() => {
    if (currentUser?.accountType === "PROVIDER") {
      fetchCarebusiness(params.id);
    } else if (currentUser?.accountType === "STUDENT") {
      fetchStudent(params.id);
    }
  }, [currentUser?.accountType, params.id, fetchCarebusiness, fetchStudent]);

  const loading =
    userLoading ||
    (currentUser?.accountType === "PROVIDER" && providerLoading) ||
    (currentUser?.accountType === "STUDENT" && studentLoading);

  const renderBusinessInfo = () => {
    if (!currentUser) return null;

    if (currentUser.accountType === "PROVIDER" && carebusiness) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Business Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Business Email</p>
              <p>{carebusiness.businessEmail}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Description</p>
              <p className="whitespace-pre-wrap">{carebusiness.description}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Care Homes</p>
              <p>{carebusiness.homes.length} registered homes</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Documents</p>
              <ul className="list-disc pl-5 text-sm">
                <li>CAC Registration</li>
                <li>Memorandum of Association</li>
                <li>Other Certificates</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Business approved?:</p>
              <p>{carebusiness.isApproved || "N/A"} registered homes</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentUser.accountType === "STUDENT" && student) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Professional Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Care Experience</p>
              <p>{student.careExperienceLength}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Documents</p>
              <ul className="list-disc pl-5 text-sm">
                <li>ID Card</li>
                <li>Certificates</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Access to jobs?::</p>
              <p>{student.isApproved || "N/A"} registered homes</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Users
      </button>

      {loading ? (
        <Loader />
      ) : currentUser ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 relative">
                <Image
                  src={DEFAULT_PROFILE_IMAGE_URL}
                  alt={`${currentUser.firstName} ${currentUser.lastName}'s profile`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="text-gray-600">
                  Account Type:{" "}
                  <span className="capitalize">
                    {capitalizeFirstChar(currentUser.accountType)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p>{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p>{currentUser.phoneNo || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date Joined</p>
                    <p>N/A</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="capitalize">
                      {currentUser.isApproved ? "Verified" : "Not verified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Last Login</p>
                    <p>N/A</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">ID</p>
                    <p className="font-mono text-sm">{currentUser.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          {renderBusinessInfo()}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>User not found</p>
        </div>
      )}
    </div>
  );
}
