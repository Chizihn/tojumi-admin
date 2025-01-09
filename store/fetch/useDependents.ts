import { GET_DEPENDENTS } from "@/graphql/queries";
import client from "@/lib/client";
import { CareBusiness } from "@/types/user";
import { create } from "zustand";

interface FetchDependentState {
  dependents: CareBusiness[];
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchDependents: () => Promise<void>;
}

export const useDependentStore = create<FetchDependentState>((set) => ({
  dependents: [],
  loading: false,
  initialized: false,
  error: null,

  fetchDependents: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all dependents");

      const response = await client.query({
        query: GET_DEPENDENTS,
        fetchPolicy: "network-only",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetching dependent users response:", response.data);

      const fetchedDependents = response.data?.getDependents || [];

      if (!fetchedDependents) {
        console.warn("No dependent");
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
}));
