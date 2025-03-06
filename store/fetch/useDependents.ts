import { GET_DEPENDENT, GET_DEPENDENTS } from "@/graphql/queries";
import client from "@/lib/client";
import { queryClient } from "@/lib/queryClient"; // Import your existing queryClient
import { Dependent } from "@/types/user";
import { create } from "zustand";

interface FetchDependentState {
  dependents: Dependent[];
  dependent: Dependent | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchDependents: () => Promise<void>;
  fetchDependent: (id: string) => Promise<void>;
}

export const useDependentStore = create<FetchDependentState>((set) => ({
  dependents: [],
  dependent: null,
  loading: false,
  initialized: false,
  error: null,

  fetchDependents: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all dependents");

      const fetchedDependents = await queryClient.fetchQuery({
        queryKey: ["getDependents"],
        queryFn: async () => {
          const res = await client.query({
            query: GET_DEPENDENTS,
            fetchPolicy: "network-only",
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.adminGetDependents || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      if (!fetchedDependents || fetchedDependents.length === 0) {
        console.warn("No dependents found");
        set({ dependents: [], initialized: true });
        return;
      }

      set({ dependents: fetchedDependents, initialized: true });
    } catch (error) {
      console.error("Error fetching dependent users:", error);
      set({
        error: (error as Error).message || "Failed to fetch dependents",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchDependent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const fetchedDependent = await queryClient.fetchQuery({
        queryKey: ["getDependent", id],
        queryFn: async () => {
          const res = await client.query({
            query: GET_DEPENDENT,
            variables: { id },
            fetchPolicy: "network-only",
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.adminGetDependent;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Update the dependent in the store
      set({
        dependent: fetchedDependent,
        initialized: true,
      });
    } catch (error) {
      console.error("Error in fetching dependent:", error);
      set({
        error: (error as Error).message || "Failed to fetch dependent",
        dependent: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
