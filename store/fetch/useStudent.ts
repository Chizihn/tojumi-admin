import { APPROVE_STUDENT, REJECT_STUDENT } from "@/graphql/mutations";
import { GET_STUDENT, GET_STUDENTS } from "@/graphql/queries";
import client from "@/lib/client";
import { Levels, Student } from "@/types/user";
import { toast } from "react-toastify";
import { create } from "zustand";

// Define action types for better type safety
export type StudentActionType = "approve" | "reject" | null;

interface FetchStudentState {
  studentUsers: Student[];
  student: Student | null;

  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Button/action loading states
  buttonLoading: boolean;
  actionType: StudentActionType;

  // Methods
  setStudent: (student: Student) => void;
  fetchStudentUsers: () => Promise<void>;
  fetchStudent: (id: string) => Promise<void>;

  // New mutation methods
  approveStudent: (id: string, level: Levels) => Promise<boolean>;
  rejectStudent: (id: string) => Promise<boolean>;
}

export const useStudentStore = create<FetchStudentState>((set, get) => ({
  studentUsers: [],
  student: null,
  loading: false,
  initialized: false,
  error: null,

  // Initialize button loading state and action type
  buttonLoading: false,
  actionType: null,

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

  // Approve student mutation
  approveStudent: async (id: string, level: Levels) => {
    set({ buttonLoading: true, actionType: "approve", error: null });

    try {
      console.log("Approving student with ID:", id);

      const { data, errors } = await client.mutate({
        mutation: APPROVE_STUDENT,
        variables: { id, level },
        // Optionally update the cache after mutation
        update: (cache, { data }) => {
          // Optionally update the cache if needed
          if (data?.approveStudent) {
            toast.success("Approved successfully!");

            // Update only the necessary fields in the student object
            const currentStudent = get().student;
            if (currentStudent && currentStudent.id === id) {
              set({
                student: {
                  ...currentStudent,
                  level: data.approveStudent.level,
                  isApproved: data.approveStudent.isApproved,
                },
              });
            }

            // Update the student in the list if it exists there
            const studentUsers = [...get().studentUsers];
            const index = studentUsers.findIndex((s) => s.id === id);
            if (index !== -1) {
              studentUsers[index] = {
                ...studentUsers[index],
                level: data.approveStudent.level,
                isApproved: data.approveStudent.isApproved,
              };
              set({ studentUsers });
            }
          }
        },
      });

      if (errors) {
        console.error("GraphQL Errors:", errors);
        throw new Error(errors[0]?.message || "Error approving student");
      }

      console.log("Student approval response:", data);

      return !!data?.approveStudent;
    } catch (error) {
      toast.error("Failed to approve!");
      console.error("Error approving student:", error);
      set({
        error: (error as Error).message || "Failed to approve student",
      });
      return false;
    } finally {
      set({ buttonLoading: false, actionType: null });
    }
  },

  // Reject student mutation
  rejectStudent: async (id: string) => {
    set({ buttonLoading: true, actionType: "reject", error: null });

    try {
      console.log("Rejecting student with ID:", id);

      const { data, errors } = await client.mutate({
        mutation: REJECT_STUDENT,
        variables: { id },
        // Optionally update the cache after mutation
        update: (cache, { data }) => {
          // Optionally update the cache if needed
          if (data?.rejectStudent) {
            toast.success("Rejected successfully!");
            // Update the single student if it's the one we're viewing
            const currentStudent = get().student;
            if (currentStudent && currentStudent.id === id) {
              set({ student: data.rejectStudent });
            }

            // Update the student in the list if it exists there
            const studentUsers = [...get().studentUsers];
            const index = studentUsers.findIndex((s) => s.id === id);
            if (index !== -1) {
              studentUsers[index] = data.rejectStudent;
              set({ studentUsers });
            }
          }
        },
      });

      if (errors) {
        console.error("GraphQL Errors:", errors);
        throw new Error(errors[0]?.message || "Error rejecting student");
      }

      console.log("Student rejection response:", data);

      return !!data?.rejectStudent;
    } catch (error) {
      toast.error("Failed to reject");
      console.error("Error rejecting student:", error);
      set({
        error: (error as Error).message || "Failed to reject student",
      });
      return false;
    } finally {
      set({ buttonLoading: false, actionType: null });
    }
  },
}));
