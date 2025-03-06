import { GET_ALL_CAREHOMES, GET_CAREHOME } from "@/graphql/queries";
import client from "@/lib/client";
import { queryClient } from "@/lib/queryClient";
import { Carehome, Status } from "@/types/user";
import { create } from "zustand";
import { gql } from "@apollo/client";
import { toast } from "react-toastify";

const APPROVE_CAREHOME = gql`
  mutation ApproveCarehome($careHomeId: ID!) {
    approveCareHome(careHomeId: $careHomeId) {
      id
      isApproved
    }
  }
`;

const REJECT_CAREHOME = gql`
  mutation RejectCarehome($careHomeId: ID!) {
    rejectCareHome(careHomeId: $careHomeId) {
      id
      isApproved
    }
  }
`;

interface FetchCarehomeState {
  carehomes: Carehome[];
  carehome: Carehome | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  buttonLoading: boolean;
  actionType: string;

  fetchCarehomes: () => Promise<void>;
  fetchCarehome: (id: string) => Promise<void>;
  approveCarehome: (id: string) => Promise<void>;
  rejectCarehome: (id: string) => Promise<void>;
}

export const useCarehomeStore = create<FetchCarehomeState>((set, get) => ({
  carehomes: [],
  carehome: null,
  loading: false,
  initialized: false,
  error: null,
  buttonLoading: false,
  actionType: "",

  fetchCarehomes: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all carehomes");

      const fetchedCarehomes = await queryClient.fetchQuery({
        queryKey: ["getAllCareHomes"],
        queryFn: async () => {
          const res = await client.query({
            query: GET_ALL_CAREHOMES,
            fetchPolicy: "network-only",
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.getAllCareHomes || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Log the fetched data
      console.log("Fetched carehomes data:", fetchedCarehomes);

      if (!fetchedCarehomes || fetchedCarehomes.length === 0) {
        console.warn("No carehomes found");
        set({ carehomes: [], initialized: true });
        return;
      }

      set({ carehomes: fetchedCarehomes, initialized: true });
    } catch (error) {
      console.error("Error fetching carehome users:", error);
      set({
        error: (error as Error).message || "Failed to fetch carehomes",
      });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  fetchCarehome: async (id: string) => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching carehome");

      const fetchedCarehome = await queryClient.fetchQuery({
        queryKey: ["getCarehome", id],
        queryFn: async () => {
          const res = await client.query({
            query: GET_CAREHOME,
            variables: { id },
            fetchPolicy: "network-only",
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.adminGetCarehomeById || null;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Log the fetched data
      console.log("Fetched carehome data:", fetchedCarehome);

      if (!fetchedCarehome) {
        console.warn("No carehome found");
        set({ carehome: null, initialized: true });
        return;
      }

      set({ carehome: fetchedCarehome, initialized: true });
    } catch (error) {
      console.error("Error fetching carehome:", error);
      set({
        error: (error as Error).message || "Failed to fetch carehome",
      });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  approveCarehome: async (id: string) => {
    set({ buttonLoading: true, actionType: "approve" });

    try {
      const response = await client.mutate({
        mutation: APPROVE_CAREHOME,
        variables: { careHomeId: id },
        refetchQueries: [
          { query: GET_CAREHOME, variables: { id } },
          { query: GET_ALL_CAREHOMES },
        ],
      });

      if (response?.data?.approveCareHome) {
        const { carehome } = get();

        if (carehome) {
          set({
            carehome: { ...carehome, isApproved: Status.APPROVED },
          });
        }

        toast.success("Carehome approved successfully!");
      }
    } catch (error) {
      console.error("Error approving care home:", error);
      toast.error("Failed to approve care home");
      set({ error: (error as Error).message || "Failed to approve care home" });
    } finally {
      set({ buttonLoading: false, actionType: "" });
    }
  },

  rejectCarehome: async (id: string) => {
    set({ buttonLoading: true, actionType: "reject" });

    try {
      const response = await client.mutate({
        mutation: REJECT_CAREHOME,
        variables: { careHomeId: id },
        refetchQueries: [
          { query: GET_CAREHOME, variables: { id } },
          { query: GET_ALL_CAREHOMES },
        ],
      });

      if (response?.data?.rejectCareHome) {
        const { carehome } = get();

        if (carehome) {
          set({
            carehome: { ...carehome, isApproved: Status.REJECTED },
          });
        }

        toast.success("Carehome rejected successfully!");
      }
    } catch (error) {
      console.error("Error rejecting care home:", error);
      toast.error("Failed to reject care home");
      set({ error: (error as Error).message || "Failed to reject care home" });
    } finally {
      set({ buttonLoading: false, actionType: "" });
    }
  },
}));
