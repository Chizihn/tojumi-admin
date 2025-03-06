"use client";

import Loader from "@/components/Loader";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Loader as ButtonLoader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCarehomeStore } from "@/store/fetch/useCarehomes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { capitalizeFirstChar, currencyFormatter } from "@/utils";
import { Currency } from "@/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Status } from "@/types/user";

export default function CarehomeDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    carehome,
    loading,
    error,
    fetchCarehome,
    actionType,
    buttonLoading,
    approveCarehome,
    rejectCarehome,
  } = useCarehomeStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchCarehome(params.id);
  }, [fetchCarehome, params.id]);

  // Gallery navigation functions
  const nextImage = () => {
    if (carehome && carehome.imagesVideos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === carehome.imagesVideos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (carehome && carehome.imagesVideos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? carehome.imagesVideos.length - 1 : prev - 1
      );
    }
  };

  // Handle media type (image or video)
  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const getStatusDisplay = (status: Status) => {
    switch (status) {
      case Status.APPROVED:
        return <span className="text-green-600 font-medium">Approved</span>;
      case Status.REJECTED:
        return <span className="text-red-600 font-medium">Rejected</span>;
      case Status.PENDING:
      default:
        return <span className="text-yellow-600 font-medium">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.push("/dashboard/carehomes")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Care Homes
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
          onClick={() => router.push("/dashboard/carehomes")}
          className="flex items-center gap-2 mb-6 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to Care Homes
        </button>
        <div className="flex items-center justify-center">
          <p className="text-red-500">Error fetching care home details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/dashboard/carehomes")}
        className="flex items-center gap-2 mb-6 hover:text-primary"
      >
        <ArrowLeft size={20} />
        Back to Care Homes
      </button>

      {carehome ? (
        <div className="space-y-6">
          {/* Image/Video Gallery */}
          {carehome.imagesVideos && carehome.imagesVideos.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Gallery</h2>
              <div className="relative rounded-lg overflow-hidden h-96 w-full">
                {isVideo(carehome.imagesVideos[currentImageIndex]) ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src={carehome.imagesVideos[currentImageIndex]}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={carehome.imagesVideos[currentImageIndex]}
                      alt={`${carehome.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Navigation arrows */}
                {carehome.imagesVideos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {carehome.imagesVideos.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto py-2">
                  {carehome.imagesVideos.map((mediaUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        currentImageIndex === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      {isVideo(mediaUrl) ? (
                        <div className="bg-black flex items-center justify-center h-full w-full text-white">
                          <span className="text-xs">Video</span>
                        </div>
                      ) : (
                        <Image
                          src={mediaUrl}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-2">
                {currentImageIndex + 1} of {carehome.imagesVideos.length}
              </p>
            </div>
          )}

          {/* Care Home Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-2">{carehome.name}</h1>
            <p className="text-gray-700 mb-4">{carehome.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  Year Established: {carehome.yearEstablished}
                </p>
                <p className="text-gray-600">Phone: {carehome.phoneNo}</p>
                <p className="text-gray-600">Capacity: {carehome.capacity}</p>
                <p className="text-gray-600">
                  Available Slots: {carehome.availableSlots}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Location: {carehome.location}</p>
                <p className="text-gray-600">
                  Amenities: {carehome.amenities.join(", ")}
                </p>
                <p className="text-gray-600">Status: {carehome.isApproved}</p>
              </div>
            </div>
          </div>

          {/* Carehome approval Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Carehome Status</h2>

            <p>Approval Status: {getStatusDisplay(carehome.isApproved)}</p>

            {carehome.isApproved === "PENDING" && (
              <div className="flex item-center my-4 gap-5">
                <Button
                  variant="primary"
                  type="button"
                  loading={buttonLoading && actionType === "approve"}
                  disabled={buttonLoading}
                  onClick={() => approveCarehome(carehome.id)}
                >
                  {buttonLoading && actionType === "approve" ? (
                    <ButtonLoader size="small" />
                  ) : (
                    <Check size={18} />
                  )}
                  Approve Carehome
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  loading={buttonLoading && actionType === "reject"}
                  disabled={buttonLoading}
                  onClick={() => rejectCarehome(carehome.id)}
                >
                  {buttonLoading && actionType === "reject" ? (
                    <ButtonLoader size="small" />
                  ) : (
                    <X size={18} />
                  )}
                  Reject Carehome
                </Button>
              </div>
            )}
          </div>

          {/* Care Business (Owner) Details */}
          {carehome.careBusiness && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Owned by: {carehome.careBusiness.user.firstName}{" "}
                {carehome.careBusiness.user.lastName}
              </h2>
              <p>Business Email: {carehome.careBusiness.businessEmail}</p>
              <p>Description: {carehome.careBusiness.description}</p>
              <p>
                Approval Status:{" "}
                {capitalizeFirstChar(carehome.careBusiness.isApproved)}
              </p>

              <div className="mt-3">
                <p className="text-md ">
                  Visit carebusiness profile -
                  <Link
                    href={`/dashboard/providers/${carehome.careBusiness.id}`}
                    target="_blank"
                    className="text-secondary"
                  >
                    Visit profile
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Pricing Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-gray-700">Hourly</h3>
                <p className="text-2xl font-bold">
                  {" "}
                  {currencyFormatter(carehome.hourlyPrice, Currency.NGN)}{" "}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-gray-700">Daily</h3>
                <p className="text-2xl font-bold">
                  {" "}
                  {currencyFormatter(carehome.dailyPrice, Currency.NGN)}{" "}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-gray-700">Weekly</h3>
                <p className="text-2xl font-bold">
                  {currencyFormatter(carehome.weeklyPrice, Currency.NGN)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-gray-700">Monthly</h3>
                <p className="text-2xl font-bold">
                  {" "}
                  {currencyFormatter(carehome.monthlyPrice, Currency.NGN)}{" "}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-medium text-gray-700">Yearly</h3>
                <p className="text-2xl font-bold">
                  {" "}
                  {currencyFormatter(carehome.yearlyPrice, Currency.NGN)}{" "}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {carehome.reviews && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="flex items-center mb-2">
                <span className="text-xl font-bold mr-2">
                  {carehome.reviews.rating}
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(carehome.reviews.rating)
                        ? "★"
                        : i < Math.ceil(carehome.reviews.rating) &&
                          carehome.reviews.rating % 1 !== 0
                        ? "★"
                        : "☆"}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{carehome.reviews.review}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p>Care home not found</p>
        </div>
      )}
    </div>
  );
}
