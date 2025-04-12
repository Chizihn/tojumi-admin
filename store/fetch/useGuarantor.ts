import { create } from "zustand";
import client from "@/lib/client";
import { GET_GUARANTOR, GET_GUARANTORS } from "@/graphql/queries";
import { ACCEPT_GUARANTOR, REJECT_GUARANTOR } from "@/graphql/mutations";
import { toast } from "react-toastify";
import { Guarantor } from "@/types/user";
import { ApolloError } from "@apollo/client";
import { capitalizeFirstChar } from "@/utils";

interface GuarantorStore {
  guarantors: Guarantor[];
  guarantor: Guarantor | null;
  loading: boolean;
  error: string | null;
  buttonLoading: boolean;
  fetchGuarantors: () => Promise<void>;
  fetchGuarantor: (id: string) => Promise<void>;
  acceptGuarantor: (id: string) => Promise<void>;
  rejectGuarantor: (id: string) => Promise<void>;
}

export const useGuarantorStore = create<GuarantorStore>((set) => ({
  guarantors: [],
  guarantor: null,
  loading: false,
  error: null,
  buttonLoading: false,

  fetchGuarantors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await client.query({
        query: GET_GUARANTORS,
      });

      set({ guarantors: response?.data?.getGuarantors || [], loading: false });
    } catch (error) {
      console.error("Error fetching guarantors:", error);
      set({ error: "Failed to fetch guarantors", loading: false });
      toast.error("Failed to fetch guarantors");
    }
  },

  fetchGuarantor: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await client.query({
        query: GET_GUARANTOR,
        variables: { id },
      });
      set({ guarantor: response.data.getGuarantor, loading: false });
    } catch (error) {
      console.error("Error fetching guarantor:", error);
      set({ error: "Failed to load guarantor details", loading: false });
      toast.error("Failed to load guarantor details");
    }
  },

  acceptGuarantor: async (id) => {
    set({ buttonLoading: true });
    try {
      const response = await client.mutate({
        mutation: ACCEPT_GUARANTOR,
        variables: { id },
        refetchQueries: [
          { query: GET_GUARANTOR, variables: { id } },
          { query: GET_GUARANTORS },
        ],
      });

      if (response.data.verifyGuarantor) {
        set((state) => ({
          guarantor: state.guarantor
            ? { ...state.guarantor, verified: "true" }
            : null,
          buttonLoading: false,
        }));
        toast.success("Guarantor verified successfully!");
      }
    } catch (error: unknown) {
      const errorMessage = (error as ApolloError).message;
      toast.error(capitalizeFirstChar(errorMessage));
      console.error("Error verifying guarantor:", error);
      set({ buttonLoading: false });
    }
  },

  rejectGuarantor: async (id) => {
    set({ buttonLoading: true });
    try {
      const response = await client.mutate({
        mutation: REJECT_GUARANTOR,
        variables: { id },
        refetchQueries: [
          { query: GET_GUARANTOR, variables: { id } },
          { query: GET_GUARANTORS },
        ],
      });

      if (response.data.rejectGuarantor) {
        set((state) => ({
          guarantor: state.guarantor
            ? { ...state.guarantor, verified: "false" }
            : null,
          buttonLoading: false,
        }));
        toast.success("Guarantor rejected successfully!");
      }
    } catch (error: unknown) {
      const errorMessage = (error as ApolloError).message;
      toast.error(capitalizeFirstChar(errorMessage));
      console.error("Error rejecting guarantor:", error);
      set({ buttonLoading: false });
    }
  },
}));
