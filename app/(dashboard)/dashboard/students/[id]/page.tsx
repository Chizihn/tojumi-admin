"use client";

import Loader from "@/components/Loader";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import { GET_GUARANTORS_BY_ID } from "@/graphql/queries";
import Button from "@/components/ui/Button";
import { useStudentStore } from "@/store/fetch/useStudent";
import { Guarantor, Levels, Status } from "@/types/user";

import { useQuery } from "@apollo/client";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const router = useRouter();

  const {
    student,
    loading,
    fetchStudent,
    buttonLoading,
    actionType,
    approveStudent,
    rejectStudent,
  } = useStudentStore();

  const [selectedLevel, setSelectedLevel] = useState<Levels | null>(null);

  useEffect(() => {
    fetchStudent(params.id);
  }, [params.id, fetchStudent]);

  const currentUser = student?.user;

  const { data, loading: guarantorsLoading } = useQuery(GET_GUARANTORS_BY_ID, {
    variables: { studentId: params.id },
    skip: !params.id,
  });

  const handleApproveStudent = async (id: string, level: Levels) => {
    console.log("approve stud cll", {
      id,
      level,
    });

    await approveStudent(id, level);
  };

  const guarantors: Guarantor[] = data?.getGuarantorsByStudentId || [];

  const getFileType = (url: string) => {
    if (!url) return null;
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return null;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "image";
    } else if (extension === "pdf") {
      return "pdf";
    }
    return null;
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
                {student.level && (
                  <div>
                    <p className="text-gray-600 text-sm">Level</p>
                    <p>{capitalizeFirstChar(student.level)}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Documents</p>
                <div className="space-y-4">
                  {student.idCard && (
                    <div>
                      <p className="text-sm font-medium mb-1">ID Card</p>
                      <div className="border rounded-lg overflow-hidden">
                        {getFileType(student.idCard) === "image" ? (
                          <Image
                            src={student.idCard}
                            alt="ID Card"
                            width={300}
                            height={200}
                            className="object-contain w-full"
                          />
                        ) : (
                          <iframe
                            src={student.idCard}
                            className="w-full h-[300px]"
                            title="ID Card Preview"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {student.certificate && (
                    <div>
                      <p className="text-sm font-medium mb-1">Certificate</p>
                      <div className="border rounded-lg overflow-hidden">
                        {getFileType(student.certificate) === "image" ? (
                          <Image
                            src={student.certificate}
                            alt="Certificate"
                            width={300}
                            height={200}
                            className="object-contain w-full"
                          />
                        ) : (
                          <iframe
                            src={student.certificate}
                            className="w-full h-[300px]"
                            title="Certificate Preview"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                <div className="flex gap-4">
                  {guarantorsLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : guarantors && guarantors.length > 0 ? (
                    guarantors.map((guarantor) => (
                      <span key={guarantor.id}>
                        {guarantor.firstName} {guarantor.lastName}
                      </span>
                    ))
                  ) : (
                    <span>No guarantors found</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Approved for jobs?</p>
                <p>{capitalizeFirstChar(String(student?.isApproved))}</p>

                {student?.isApproved === Status.PENDING && (
                  <div className="mt-3">
                    <select
                      value={String(selectedLevel)}
                      onChange={(e) =>
                        setSelectedLevel(e.target.value as Levels)
                      }
                      className="border p-2 rounded py-2"
                    >
                      <option value="">Select Level</option>
                      {Object.values(Levels).map((level) => (
                        <option key={level} value={level}>
                          {capitalizeFirstChar(level)}
                        </option>
                      ))}
                    </select>
                    <div className="flex item-center my-4 gap-5">
                      <Button
                        variant="primary"
                        type="button"
                        loading={buttonLoading && actionType === "approve"}
                        disabled={buttonLoading || !selectedLevel}
                        onClick={() =>
                          handleApproveStudent(
                            student.id,
                            selectedLevel as Levels
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        type="button"
                        loading={buttonLoading && actionType === "reject"}
                        disabled={buttonLoading}
                        onClick={() => rejectStudent(student.id)}
                      >
                        Reject
                      </Button>
                    </div>
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
