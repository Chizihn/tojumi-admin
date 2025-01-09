import client from "@/lib/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, LoginSchema } from "@/types/auth";
import { LOGIN } from "@/graphql/mutations";
import { cookieStorage } from "@/utils/session";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      identifier: "",

      login: async (loginData: LoginSchema) => {
        set({ loading: true, error: null });

        try {
          const response = await client.mutate({
            mutation: LOGIN,
            variables: loginData,
          });

          if (response.data?.login?.token && response.data.login.user) {
            const { token, user } = response.data.login;
            cookieStorage.setItem("token", token);

            set({
              user,
              token,
              isAuthenticated: true,
              error: null,
              identifier: user.email,
            });

            return true;
          } else {
            throw new Error("Invalid login response");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred during login";

          console.error("Login Error:", {
            message: errorMessage,
            originalError: error,
          });

          set({
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });

          return false;
        } finally {
          set({ loading: false });
        }
      },

      setAuth: (auth) => {
        if (auth.token) {
          cookieStorage.setItem("token", auth.token);
          cookieStorage.setItem("auth_timestamp", Date.now().toString());
        }
        set(auth);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          identifier: "",
        });
        cookieStorage.removeItem("tojumi-auth");
        cookieStorage.removeItem("token");
      },
      // forgotPassword: async (email: string) => {
      //   set({
      //     loading: true,
      //     error: null,
      //   });
      //   try {
      //     const response = await client.mutate({
      //       mutation: FORGOT_PASSWORD,
      //       variables: { email },
      //     });

      //     if (response) {
      //       set({
      //         identifier: email,
      //       });
      //       return true;
      //     } else {
      //       throw new Error("Failed to sent request.");
      //     }
      //   } catch (error) {
      //     set({
      //       identifier: "",
      //       error: (error as Error).message || "Forgot password failed",
      //     });
      //     return false;
      //   } finally {
      //     set({
      //       loading: false,
      //     });
      //   }
      // },
    }),
    {
      name: "tojumi-admin-auth",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        identifier: state.identifier,
      }),
    }
  )
);
