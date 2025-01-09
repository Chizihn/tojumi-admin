import { GET_FAMILIES } from "@/graphql/queries";
import client from "@/lib/client";
import { Family } from "@/types/user";
import { create } from "zustand";

interface FetchFamilyState {
  familyUsers: Family[];
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchFamilyUsers: () => Promise<void>;
}

export const useFamilyStore = create<FetchFamilyState>((set) => ({
  familyUsers: [],
  loading: false,
  initialized: false,
  error: null,

  fetchFamilyUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all family users");

      const response = await client.query({
        query: GET_FAMILIES,
        fetchPolicy: "cache-first",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetching family users response:", response.data);

      const fetchedFamilyUsers = response.data?.getFamilies || [];

      if (!fetchedFamilyUsers) {
        console.warn("No users");
        set({ familyUsers: [], initialized: true });
        return;
      }

      set({ familyUsers: fetchedFamilyUsers, initialized: true });
    } catch (error) {
      console.error("Error fetching family users:", error);
      set({
        error: (error as Error).message || "Failed to fetch family users",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
