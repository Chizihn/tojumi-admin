import { X } from "lucide-react";
import React from "react";
import Image from "next/image";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: "image" | "pdf";
  alt: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentType,
  alt,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>
        {documentType === "image" ? (
          <div className="relative w-full h-[80vh] bg-gray-100">
            <Image
              src={documentUrl}
              alt={alt}
              fill
              className="object-contain p-2"
              priority
              quality={85}
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
        ) : (
          <iframe
            src={documentUrl}
            title={alt}
            className="w-full h-[80vh] bg-gray-100"
            style={{ border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
