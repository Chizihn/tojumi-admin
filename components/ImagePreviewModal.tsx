import { X } from "lucide-react";
import React from "react";
import Image from "next/image";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative w-full h-[80vh]">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
