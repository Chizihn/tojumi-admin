"use client";

import Loader from "@/components/Loader";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import client from "@/lib/client";
import { APPROVE_STUDENT, REJECT_STUDENT } from "@/graphql/mutations";
import { GET_STUDENT, GET_STUDENTS } from "@/graphql/queries";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useStudentStore } from "@/store/fetch/useStudent";
import { Status } from "@/types/user";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const { student, loading, setStudent, fetchStudent } = useStudentStore();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchStudent(params.id);
  }, [params.id, fetchStudent]);

  const currentUser = student?.user;

  const handleApproveStudent = async () => {
    try {
      setButtonLoading(true);
      setActionType("approve");
      const response = await client.mutate({
        mutation: APPROVE_STUDENT,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_STUDENT, variables: { id: params.id } },
          { query: GET_STUDENTS },
        ],
      });
      if (response?.data?.approveStudent) {
        if (!student) {
          return;
        }
        setStudent({ ...student, isApproved: Status.APPROVED });
        toast.success("Approved student!");
      }
    } catch (error) {
      toast.error("Failed to approve");
      console.error("Error approving student:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  const handleRejectStudent = async () => {
    try {
      setButtonLoading(true);
      setActionType("reject");
      const response = await client.mutate({
        mutation: REJECT_STUDENT,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_STUDENT, variables: { id: params.id } },
          { query: GET_STUDENTS },
        ],
      });
      if (response?.data?.rejectStudent) {
        if (!student) {
          return;
        }
        setStudent({ ...student, isApproved: Status.REJECTED });
        toast.success("Rejected student!");
      }
    } catch (error) {
      toast.error("Failed to reject");
      console.error("Error rejecting student:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/dashboard/students")}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Students
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
                    <p className="text-gray-600 text-sm">ID</p>
                    <p className="font-mono text-sm">{currentUser.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
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
                <p className="text-gray-600 text-sm">Services:</p>
                <p>
                  {student.careServiceTypes?.map((service) => (
                    <span key={service.id}>{service.name}</span>
                  )) || "N/A"}{" "}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Guarantors:</p>
                <p>
                  {student.guarantors?.map((guarantor) => (
                    <span key={guarantor.id}>
                      {guarantor?.firstName} {guarantor?.lastName}
                    </span>
                  )) || "N/A"}{" "}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Approved for jobs?</p>
                <p>{capitalizeFirstChar(String(student?.isApproved))}</p>

                {student?.isApproved === "PENDING" && (
                  <div className="flex item-center my-4 gap-5">
                    <Button
                      variant="primary"
                      type="button"
                      loading={buttonLoading && actionType === "approve"}
                      disabled={buttonLoading}
                      onClick={handleApproveStudent}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      loading={buttonLoading && actionType === "reject"}
                      disabled={buttonLoading}
                      onClick={handleRejectStudent}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>User not found</p>
        </div>
      )}
    </div>
  );
}
