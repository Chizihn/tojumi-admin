import { GET_STUDENT, GET_STUDENTS } from "@/graphql/queries";
import client from "@/lib/client";
import { Student } from "@/types/user";
import { create } from "zustand";

interface FetchStudentState {
  studentUsers: Student[];
  student: Student | null;

  loading: boolean;
  initialized: boolean;
  error: string | null;
  setStudent: (students: Student) => void;
  fetchStudentUsers: () => Promise<void>;
  fetchStudent: (id: string) => Promise<void>;
}

export const useStudentStore = create<FetchStudentState>((set) => ({
  studentUsers: [],
  student: null,
  loading: false,
  initialized: false,
  error: null,

  setStudent: (student) => set({ student }),

  fetchStudentUsers: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Fetching all student users");

      const response = await client.query({
        query: GET_STUDENTS,
        fetchPolicy: "cache-first",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(response.errors[0]?.message || "GraphQL error");
      }

      // Log the full homes response
      console.log("Fetching student users response:", response.data);

      const fetchedStudentUsers = response.data?.getStudents || [];

      if (!fetchedStudentUsers) {
        console.warn("No student users");
        set({ studentUsers: [], initialized: true });
        return;
      }

      set({ studentUsers: fetchedStudentUsers, initialized: true });
    } catch (error) {
      console.error("Error fetching student users:", error);
      set({
        error: (error as Error).message || "Failed to fetch student users",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchStudent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_STUDENT,
        variables: { id },
        fetchPolicy: "network-only", // Force fetch from network
      });

      const fetchedStudent = data?.getStudent;

      // Update both the single dependent and the dependents list
      set({
        student: fetchedStudent,
        initialized: true,
      });
    } catch (error) {
      console.error("Error in fetching student:", error);
      set({
        error: (error as Error).message || "Failed to fetch student",
        student: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
