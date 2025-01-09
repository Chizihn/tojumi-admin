"use client";
import React, { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({
  children,
}) => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 100009 }} // Set a higher z-index than your modal
      />

      {children}
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;
