import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const AVATAR_BUCKET = "avatars";
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ProfileRecord = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileResult<T> = {
  data: T | null;
  error: PostgrestError | AuthError | Error | null;
};

export type ProfileUpdateInput = {
  display_name?: string;
  avatar_url?: string | null;
  email?: string;
};

function toProfileError(error: PostgrestError | AuthError | Error): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("Profile operation failed.");
}

export async function fetchProfile(
  userId: string
): Promise<ProfileResult<ProfileRecord>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return { data, error };
}

export async function ensureProfile(
  userId: string,
  email: string,
  displayName?: string
): Promise<ProfileResult<ProfileRecord>> {
  const existing = await fetchProfile(userId);
  if (existing.data) {
    return existing;
  }
  if (existing.error) {
    return { data: null, error: existing.error };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email,
      display_name: displayName ?? email.split("@")[0],
      avatar_url: null,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  return { data, error };
}

export async function saveProfile(
  userId: string,
  updates: ProfileUpdateInput
): Promise<ProfileResult<ProfileRecord>> {
  const payload: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.display_name !== undefined) {
    payload.display_name = updates.display_name;
  }
  if (updates.avatar_url !== undefined) {
    payload.avatar_url = updates.avatar_url;
  }
  if (updates.email !== undefined) {
    payload.email = updates.email;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    return { data: null, error };
  }

  const metadata: Record<string, string | null> = {};
  if (updates.display_name !== undefined) {
    metadata.display_name = updates.display_name;
  }
  if (updates.avatar_url !== undefined) {
    metadata.avatar_url = updates.avatar_url;
  }

  if (Object.keys(metadata).length > 0) {
    const { error: metadataError } = await supabase.auth.updateUser({
      data: metadata,
    });
    if (metadataError) {
      return { data, error: metadataError };
    }
  }

  return { data, error: null };
}

export function validateAvatarFile(file: File): Error | null {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_TYPES)[number])) {
    return new Error("Avatar must be a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return new Error("Avatar must be 2 MB or smaller.");
  }
  return null;
}

function getAvatarExtension(file: File): string {
  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<ProfileResult<string>> {
  // TODO: Re-enable after Supabase Storage `avatars` bucket and policies are configured.
  const validationError = validateAvatarFile(file);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const extension = getAvatarExtension(file);
  const objectPath = `${userId}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(objectPath, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file.type,
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data: publicUrlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(objectPath);

  const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
  const { data, error } = await saveProfile(userId, { avatar_url: avatarUrl });

  if (error) {
    return { data: null, error: toProfileError(error) };
  }

  return { data: data?.avatar_url ?? avatarUrl, error: null };
}

export async function changePassword(
  newPassword: string
): Promise<ProfileResult<null>> {
  if (newPassword.length < 6) {
    return {
      data: null,
      error: new Error("Password must be at least 6 characters."),
    };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { data: null, error };
}

async function removeAvatarObjects(userId: string): Promise<Error | null> {
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) {
    return listError;
  }

  if (!files?.length) {
    return null;
  }

  const paths = files.map((file) => `${userId}/${file.name}`);
  const { error: removeError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove(paths);

  return removeError;
}

export async function deleteAccount(
  userId: string
): Promise<ProfileResult<null>> {
  // TODO: Re-enable after Supabase `delete_user` RPC is implemented.
  const storageError = await removeAvatarObjects(userId);
  if (storageError) {
    return { data: null, error: storageError };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    return { data: null, error: profileError };
  }

  const { error: rpcError } = await supabase.rpc("delete_user");
  if (rpcError) {
    return { data: null, error: rpcError };
  }

  return { data: null, error: null };
}
