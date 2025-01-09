import { User } from "./user";

export interface PersistedAuthState {
  user?: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading?: boolean;
  error?: string | null;
  identifier?: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export interface AuthState extends PersistedAuthState {
  login: (loginData: LoginSchema) => Promise<boolean>;
  setAuth: (auth: PersistedAuthState) => void;
  logout: () => void;
}
