"use client";

import Loader from "@/components/Loader";
import { DEFAULT_PROFILE_IMAGE_URL } from "@/constants/default";
import { useCarebusinessStore } from "@/store/fetch/useCarebusiness";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar } from "@/utils";
import client from "@/lib/client";
import { APPROVE_CAREBUSINESS, REJECT_CAREBUSINESS } from "@/graphql/mutations";
import { GET_CAREBUSINESS, GET_CAREBUSINESSES } from "@/graphql/queries";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import RightSideModal from "@/components/RightSideModal";
import { Status } from "@/types/user";
import Link from "next/link";

export default function UserDetail({ params }: { params: { id: string } }) {
  const { carebusiness, setCarebusiness, loading, fetchCarebusiness } =
    useCarebusinessStore();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const router = useRouter();

  const [viewHomes, setViewHomes] = useState<boolean>(false);

  useEffect(() => {
    fetchCarebusiness(params.id);
  }, [params.id, fetchCarebusiness]);

  const currentUser = carebusiness?.user;

  const handleApproveCarebusiness = async () => {
    try {
      setButtonLoading(true);
      setActionType("approve");
      const response = await client.mutate({
        mutation: APPROVE_CAREBUSINESS,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_CAREBUSINESS, variables: { id: params.id } },
          { query: GET_CAREBUSINESSES },
        ],
      });
      if (response?.data?.approveCareBusiness) {
        if (!carebusiness) {
          return;
        }
        setCarebusiness({ ...carebusiness, isApproved: Status.APPROVED });
        toast.success("Approved carebusiness!");
      }
    } catch (error) {
      toast.error("Failed to approve");
      console.error("Error approving care business:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  const handleRejectbusiness = async () => {
    try {
      setButtonLoading(true);
      setActionType("reject");
      const response = await client.mutate({
        mutation: REJECT_CAREBUSINESS,
        variables: { id: params.id },
        refetchQueries: [
          { query: GET_CAREBUSINESS, variables: { id: params.id } },
          { query: GET_CAREBUSINESSES },
        ],
      });
      if (response?.data?.rejectCareBusiness) {
        if (!carebusiness) {
          return;
        }
        setCarebusiness({ ...carebusiness, isApproved: Status.REJECTED });
        toast.success("Rejected carebusiness!");
      }
    } catch (error) {
      toast.error("Failed to reject");
      console.error("Error rejecting care business:", error);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/providers")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Providers
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
              <h2 className="text-xl font-bold mb-4">Business Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Business Email</p>
                  <p>{carebusiness?.businessEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="whitespace-pre-wrap">
                    {carebusiness?.description || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Care Homes</p>
                  <p>
                    {carebusiness?.homes?.length || 0} registered homes
                  </p>{" "}
                  {carebusiness?.homes?.length > 0 && (
                    <button onClick={() => setViewHomes(true)}>
                      View homes
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Business approved?</p>
                  <p>{capitalizeFirstChar(String(carebusiness?.isApproved))}</p>

                  {carebusiness?.isApproved === "PENDING" && (
                    <div className="flex item-center my-4 gap-5">
                      <Button
                        variant="primary"
                        type="button"
                        loading={buttonLoading && actionType === "approve"}
                        disabled={buttonLoading}
                        onClick={handleApproveCarebusiness}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        type="button"
                        loading={buttonLoading && actionType === "reject"}
                        disabled={buttonLoading}
                        onClick={handleRejectbusiness}
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

      <RightSideModal
        isOpen={viewHomes}
        setIsOpen={() => setViewHomes(false)}
        title="Carehomes"
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {carebusiness?.homes?.map((home) => (
              <div
                key={home.id}
                className="bg-white rounded-lg shadow p-6 mb-4"
              >
                <h3 className="text-xl font-bold mb-4">{home.name}</h3>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="mb-4">{home.location}</p>
                <p className="text-gray-600 text-sm">Description</p>
                <p className="mb-4">{home.description}</p>
                <p className="text-gray-600 text-sm">Number of Slots</p>
                <p className="mb-4">{home.availableSlots}</p>
                <p className="text-gray-600 text-sm">Number of Capacity</p>
                <p className="mb-4">{home.capacity}</p>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="mb-4">{home.isApproved}</p>

                <Link
                  href={`/dashboard/carehomes/${home.id}`}
                  target="_black"
                  className="text-secondary font-semibold"
                >
                  View home
                </Link>
              </div>
            ))}
          </>
        )}
      </RightSideModal>
    </>
  );
}
