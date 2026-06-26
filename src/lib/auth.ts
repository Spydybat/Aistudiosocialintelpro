import type { AuthError, Session, User as SupabaseUser } from "@supabase/supabase-js";
import type { User as AppUser } from "../types";
import { supabase } from "./supabase";

export type AuthResult<T> = {
  data: T | null;
  error: AuthError | null;
};

export function mapSupabaseUserToAppUser(user: SupabaseUser): AppUser {
  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName,
    avatarUrl: user.user_metadata?.avatar_url as string | undefined,
    plan: "Free",
    billingInterval: "monthly",
    joinedAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : new Date().toLocaleDateString(),
    twoFactorEnabled: false,
    emailVerified: Boolean(user.email_confirmed_at),
    rememberMe: true,
  };
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult<{ user: SupabaseUser | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: displayName ? { display_name: displayName } : undefined,
    },
  });

  return { data, error };
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult<{ user: SupabaseUser; session: Session }>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut(): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.signOut();
  return { data: null, error };
}

export async function getCurrentSession(): Promise<AuthResult<Session>> {
  const { data, error } = await supabase.auth.getSession();
  return { data: data.session, error };
}

export async function getCurrentUser(): Promise<AuthResult<SupabaseUser>> {
  const { data, error } = await supabase.auth.getUser();
  return { data: data.user, error };
}
