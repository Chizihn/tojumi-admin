import { GET_ALL_CAREHOMES } from "@/graphql/queries";
import client from "@/lib/client";
import { Carehome } from "@/types/user";
import { create } from "zustand";

interface FetchCarehomeState {
  carehomes: Carehome[];
  carehome: Carehome | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchCarehomes: () => Promise<void>;
}

export const useCarehomeStore = create<FetchCarehomeState>((set) => ({
  carehomes: [],
  carehome: null,
  loading: false,
  initialized: false,
  error: null,

  fetchCarehomes: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all carehomes");

      const response = await client.query({
        query: GET_ALL_CAREHOMES,
        fetchPolicy: "network-only",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetching carehome users response:", response.data);

      const fetchedCarehomes = response.data?.getAllCareHomes || [];

      if (!fetchedCarehomes) {
        console.warn("No carehome");
        set({ carehomes: [] });
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
}));
