import { GET_CAREBUSINESS, GET_CAREBUSINESSES } from "@/graphql/queries";
import client from "@/lib/client";
import { CareBusiness } from "@/types/user";
import { create } from "zustand";

interface FetchCarebusinessState {
  carebusinessUsers: CareBusiness[];
  carebusiness: CareBusiness | null;
  setCarebusiness: (carebusiness: CareBusiness) => void;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchCarebusinessUsers: () => Promise<void>;
  fetchCarebusiness: (id: string) => Promise<void>;
}

export const useCarebusinessStore = create<FetchCarebusinessState>((set) => ({
  carebusinessUsers: [],
  carebusiness: null,
  loading: false,
  initialized: false,
  error: null,

  setCarebusiness: (carebusiness) => set({ carebusiness }),

  fetchCarebusinessUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all carebusiness users");

      const response = await client.query({
        query: GET_CAREBUSINESSES,
        fetchPolicy: "cache-first",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetching carebusiness users response:", response.data);

      const fetchedCarebusinessUsers = response.data?.getCareBusinesses || [];

      if (!fetchedCarebusinessUsers) {
        console.warn("No users");
        set({ carebusinessUsers: [] });
        return;
      }

      set({ carebusinessUsers: fetchedCarebusinessUsers, initialized: true });
    } catch (error) {
      console.error("Error fetching carebusiness users:", error);
      set({
        error: (error as Error).message || "Failed to fetch carebusiness users",
      });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  fetchCarebusiness: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await client.query({
        query: GET_CAREBUSINESS,
        variables: { id },
        fetchPolicy: "network-only", // Force fetch from network
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      const fetchedData = response.data.getCareBusiness;
      const carebusiness = Array.isArray(fetchedData)
        ? fetchedData[0]
        : fetchedData;

      if (!carebusiness) {
        throw new Error("No carebusiness data found");
      }

      // Log the processed provider data

      set({ carebusiness, initialized: true });
    } catch (error) {
      console.error("Error fetching provider details:", error);
      set({
        error: (error as Error).message || "Failed to fetch provider details",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
