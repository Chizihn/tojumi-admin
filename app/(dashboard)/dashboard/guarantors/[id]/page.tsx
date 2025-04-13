"use client";

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar, formatDate } from "@/utils";
import client from "@/lib/client";

import { GET_GUARANTOR, GET_GUARANTORS } from "@/graphql/queries";
import { toast } from "react-toastify";
// import Button from "@/components/ui/Button";
import { Guarantor, Status } from "@/types/user";
import { ACCEPT_GUARANTOR, REJECT_GUARANTOR } from "@/graphql/mutations";
import Button from "@/components/ui/Button";
import { ApolloError } from "@apollo/client";

export default function GuarantorDetail({
  params,
}: {
  params: { id: string };
}) {
  const [guarantor, setGuarantor] = useState<Guarantor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchGuarantor = async () => {
      try {
        setLoading(true);
        const response = await client.query({
          query: GET_GUARANTOR,
          variables: { id: params.id },
        });

        if (response?.data?.getGuarantor) {
          setGuarantor(response.data.getGuarantor);
        }
      } catch (error) {
        console.error("Error fetching guarantor:", error);
        toast.error("Failed to load guarantor details");
      } finally {
        setLoading(false);
      }
    };

    fetchGuarantor();
  }, [params.id]);

  const handleVerifyGuarantor = async () => {
    try {
      setButtonLoading(true);
      setActionType("verify");
      const response = await client.mutate({
        mutation: ACCEPT_GUARANTOR,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_GUARANTOR, variables: { id: params.id } },
          { query: GET_GUARANTORS },
        ],
      });
      if (response?.data?.acceptGuarantor) {
        toast.success("Guarantor verified successfully!");
        // Update local state
        setGuarantor({
          ...guarantor,
          verified: Status.APPROVED,
        } as Guarantor);
      }
    } catch (error: unknown) {
      const errorMessage = (error as ApolloError).message;
      toast.error(capitalizeFirstChar(errorMessage));
      console.error("Error verifying guarantor:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  const handleRejectGuarantor = async () => {
    try {
      setButtonLoading(true);
      setActionType("reject");
      const response = await client.mutate({
        mutation: REJECT_GUARANTOR,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_GUARANTOR, variables: { id: params.id } },
          { query: GET_GUARANTORS },
        ],
      });
      if (response?.data?.rejectGuarantor) {
        toast.success("Guarantor rejected successfully!");
        // Update local state
        setGuarantor({
          ...guarantor,
          verified: Status.REJECTED,
        } as Guarantor);
      }
    } catch (error: unknown) {
      const errorMessage = (error as ApolloError).message;
      toast.error(capitalizeFirstChar(errorMessage));
      console.error("Error rejecting guarantor:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/dashboard/guarantors")}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Guarantors
      </button>

      {loading ? (
        <Loader />
      ) : guarantor ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-6">
              {/* <div className="w-24 h-24 relative">
                <Image
                  src={guarantor.passport || DEFAULT_PROFILE_IMAGE_URL}
                  alt={`${guarantor.firstName} ${guarantor.lastName}'s profile`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  priority
                />
              </div> */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {guarantor.firstName} {guarantor.lastName}
                </h1>
                <p className="text-gray-600">
                  Occupation:{" "}
                  <span className="capitalize">
                    {capitalizeFirstChar(guarantor.occupation)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p>{guarantor.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p>{guarantor.phoneNo || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p>{guarantor.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Verification Status</p>
                    <p className="capitalize">
                      {capitalizeFirstChar(guarantor.verified) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date Added</p>
                    <p>{formatDate(guarantor.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">ID</p>
                    <p className="font-mono text-sm">{guarantor.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Student Name</p>
                <p>
                  {guarantor.student?.user?.firstName}{" "}
                  {guarantor.student?.user?.lastName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Student Email</p>
                <p>{guarantor.student?.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Verification Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Verification Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">BVN</p>
                <p>{guarantor.bvn || "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Verification Status</p>
                <p className="capitalize">
                  {capitalizeFirstChar(guarantor.verified) || "N/A"}
                </p>

                {/* Show actions based on status */}
                {(() => {
                  switch (guarantor.verified) {
                    case Status.PENDING:
                      return (
                        <div className="flex items-center my-4 gap-5">
                          <Button
                            variant="primary"
                            type="button"
                            loading={buttonLoading && actionType === "verify"}
                            disabled={buttonLoading}
                            onClick={handleVerifyGuarantor}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="danger"
                            type="button"
                            loading={buttonLoading && actionType === "reject"}
                            disabled={buttonLoading}
                            onClick={handleRejectGuarantor}
                          >
                            Reject
                          </Button>
                        </div>
                      );
                    case Status.REJECTED:
                      return (
                        <div className="my-4">
                          <Button variant="secondary" disabled>
                            Rejected
                          </Button>
                        </div>
                      );
                    case Status.APPROVED:
                    default:
                      return null;
                  }
                })()}
              </div>

              <div className="my-2">
                Visit the specific student profile to verify guarantor.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>Guarantor not found</p>
        </div>
      )}
    </div>
  );
}
