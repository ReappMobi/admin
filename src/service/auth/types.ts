import type { User } from "@/store/auth.store";

export type AuthLoginResponse = {
  token: string;
  user: User;
};
