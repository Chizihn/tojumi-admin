import { create } from "zustand";
import client from "@/lib/client";
import { APPROVE_CAREBUSINESS, APPROVE_STUDENT } from "@/graphql/mutations";

interface AdminActionStore {
  loading: boolean;
  initialized: boolean;
  error: string | null;
  approveCareBusiness: (id: string) => Promise<boolean>;
  approveStudent: (id: string) => Promise<boolean>;
}

export const useCarehomeRequestState = create<AdminActionStore>((set) => ({
  loading: false,
  initialized: false,
  error: null,

  approveCareBusiness: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await client.mutate({
        mutation: APPROVE_CAREBUSINESS,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }
      if (response) {
        //   set((state) => ({
        //     carehomeIncomingRequests: state.carehomeIncomingRequests.filter(
        //       (request) => request.id !== requestId
        //     ),
        //   }
        // ))
        return true;
      } else {
        throw new Error("Failed to accept");
      }
    } catch (error) {
      console.error("Error approving carehome request", error);
      set({
        error:
          (error as Error).message || "Failed to approve request from carehome",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  approveStudent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await client.mutate({
        mutation: APPROVE_STUDENT,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }
      if (response) {
        //   set((state) => ({
        //     carehomeIncomingRequests: state.carehomeIncomingRequests.filter(
        //       (request) => request.id !== requestId
        //     ),
        //   }
        // ))

        return true;
      } else {
        throw new Error("Failed to accept");
      }
    } catch (error) {
      console.error("Error approving student request", error);
      set({
        error:
          (error as Error).message || "Failed to approve request from student",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
