import { GET_FAMILIES, GET_FAMILY } from "@/graphql/queries";
import client from "@/lib/client";
import { queryClient } from "@/lib/queryClient";
import { Family } from "@/types/user";
import { create } from "zustand";

interface FetchFamilyState {
  familyUsers: Family[];
  familyUser: Family | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchFamilyUsers: () => Promise<void>;
  fetchFamilyUser: (id: string) => Promise<void>;
}

export const useFamilyStore = create<FetchFamilyState>((set) => ({
  familyUsers: [],
  familyUser: null,
  loading: false,
  initialized: false,
  error: null,

  fetchFamilyUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all family users");

      const fetchedFamilyUsers = await queryClient.fetchQuery({
        queryKey: ["getFamilies"],
        queryFn: async () => {
          const res = await client.query({
            query: GET_FAMILIES,
            fetchPolicy: "cache-first", // Maintain your original cache policy
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.getFamilies || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Log the fetched data
      console.log("Fetching family users response:", fetchedFamilyUsers);

      if (!fetchedFamilyUsers || fetchedFamilyUsers.length === 0) {
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

  fetchFamilyUser: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const fetchedFamily = await queryClient.fetchQuery({
        queryKey: ["getFamily", id],
        queryFn: async () => {
          const res = await client.query({
            query: GET_FAMILY,
            variables: { id },
            fetchPolicy: "network-only",
          });
          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.getFamily;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Update the family user in the store
      set({
        familyUser: fetchedFamily,
        initialized: true,
      });
    } catch (error) {
      console.error("Error in fetching family:", error);
      set({
        error: (error as Error).message || "Failed to fetch family",
        familyUser: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
