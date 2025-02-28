import { X } from "lucide-react";
import React, { useEffect, ReactNode, useState, useCallback } from "react";

interface RightSideModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
  title?: string;
  showBackdrop?: boolean;
}

const RightSideModal: React.FC<RightSideModalProps> = ({
  isOpen,
  setIsOpen,
  children,
  title,
  showBackdrop = true,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  }, [setIsOpen]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleClose, isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] ${
          showBackdrop ? "bg-black/50 " : ""
        } transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 z-[1001] h-full w-full 
          lg:max-w-[30rem] bg-white shadow-xl transform transition-all
          duration-300 flex flex-col overflow-auto ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full w-full">
          {/* Header - fixed height */}
          <div className={`"flex-none p-4 ${title ? "border-b" : ""} "`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                {title}
              </h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content - scrollable only when needed */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default RightSideModal;
