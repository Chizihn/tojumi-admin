import { GET_USER, GET_USERS } from "@/graphql/queries";
import client from "@/lib/client";
import { queryClient } from "@/lib/queryClient";
import { User } from "@/types/user";
import { create } from "zustand";

interface FetchDataState {
  totalUsers: User[];
  currentUser: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  actionType: string;
  fetchTotalUsers: () => Promise<void>;
  fetchCurrentUser: (id: string) => Promise<void>;
}

export const useFetchDataStore = create<FetchDataState>((set) => ({
  totalUsers: [],
  currentUser: null,
  loading: false,
  initialized: false,
  error: null,
  actionType: "",

  fetchTotalUsers: async () => {
    set({ loading: true, error: null, actionType: "fetchTotalUsers" });

    try {
      console.log("Fetching all users");

      const fetchedTotalUsers = await queryClient.fetchQuery({
        queryKey: ["getUsers"],
        queryFn: async () => {
          const res = await client.query({
            query: GET_USERS,
            fetchPolicy: "network-only",
          });

          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.getUsers || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      console.log("Fetched users:", fetchedTotalUsers);

      if (!fetchedTotalUsers.length) {
        console.warn("No users found");
        set({ totalUsers: [], initialized: true });
        return;
      }

      set({ totalUsers: fetchedTotalUsers, initialized: true });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: (error as Error).message || "Failed to fetch users" });
    } finally {
      set({ loading: false, actionType: "" });
    }
  },

  fetchCurrentUser: async (id: string) => {
    set({ loading: true, error: null, actionType: "fetchCurrentUser" });

    try {
      console.log(`Fetching user with ID: ${id}`);

      const fetchedCurrentUser = await queryClient.fetchQuery({
        queryKey: ["getUser", id],
        queryFn: async () => {
          const res = await client.query({
            query: GET_USER,
            variables: { id },
            fetchPolicy: "network-only",
          });

          if (res.errors) {
            console.error("GraphQL Errors:", res.errors);
            throw new Error(res.errors[0]?.message || "GraphQL error");
          }
          return res.data?.getUser || null;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      console.log("Fetched user:", fetchedCurrentUser);

      if (!fetchedCurrentUser) {
        console.warn("No user found");
        set({ currentUser: null, initialized: true });
        return;
      }

      set({ currentUser: fetchedCurrentUser, initialized: true });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ error: (error as Error).message || "Failed to fetch user" });
    } finally {
      set({ loading: false, actionType: "" });
    }
  },
}));
