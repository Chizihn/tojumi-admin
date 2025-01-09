import { GET_USER, GET_USERS } from "@/graphql/queries";
import client from "@/lib/client";
import { User } from "@/types/user";
import { create } from "zustand";

interface FetchDataState {
  totalUsers: User[];
  currentUser: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetchTotalUsers: () => Promise<void>;
  fetchCurrentUser: (id: string) => Promise<void>;
}

export const useFetchDataStore = create<FetchDataState>((set) => ({
  totalUsers: [],
  currentUser: null,
  loading: false,
  initialized: false,
  error: null,

  //Fetching clients of a carehome by the provider id
  fetchTotalUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all users");

      const response = await client.query({
        query: GET_USERS,
        fetchPolicy: "cache-first",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetchich users response:", response.data);

      const fetchedTotalUsers = response.data?.getUsers || [];

      if (!fetchedTotalUsers) {
        console.warn("No users");
        set({ totalUsers: [], initialized: true });
        return;
      }

      set({ totalUsers: fetchedTotalUsers, initialized: true });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        error: (error as Error).message || "Failed to fetch users",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchCurrentUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_USER,
        variables: { id },
        fetchPolicy: "network-only", // Force fetch from network
      });

      const fetchedCurrentUser = data?.getUser;

      // Update both the single dependent and the dependents list
      set({
        currentUser: fetchedCurrentUser,
        initialized: true,
      });
    } catch (error) {
      console.error("Error in fetching user:", error);
      set({
        error: (error as Error).message || "Failed to fetch user",
        currentUser: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
