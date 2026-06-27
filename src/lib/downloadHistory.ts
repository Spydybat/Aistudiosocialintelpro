import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type DownloadHistoryRecord = {
  id: string;
  user_id: string;
  platform: string | null;
  url: string | null;
  file_name: string | null;
  file_size: string | null;
  status: string | null;
  created_at: string;
};

export type DownloadHistoryInput = {
  user_id: string;
  platform?: string | null;
  url?: string | null;
  file_name?: string | null;
  file_size?: string | null;
  status?: string | null;
  created_at?: string;
};

export type DownloadHistoryResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};

export async function fetchDownloadHistory(
  userId: string
): Promise<DownloadHistoryResult<DownloadHistoryRecord[]>> {
  const { data, error } = await supabase
    .from("download_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addDownloadHistory(
  record: DownloadHistoryInput
): Promise<DownloadHistoryResult<DownloadHistoryRecord>> {
  const payload = {
    user_id: record.user_id,
    platform: record.platform ?? null,
    url: record.url ?? null,
    file_name: record.file_name ?? null,
    file_size: record.file_size ?? null,
    status: record.status ?? "completed",
    created_at: record.created_at ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("download_history")
    .insert(payload)
    .select("*")
    .single();

  return { data, error };
}

export async function deleteDownloadHistory(
  id: string
): Promise<DownloadHistoryResult<null>> {
  const { error } = await supabase.from("download_history").delete().eq("id", id);
  return { data: null, error };
}

export async function clearDownloadHistory(
  userId: string
): Promise<DownloadHistoryResult<null>> {
  const { error } = await supabase
    .from("download_history")
    .delete()
    .eq("user_id", userId);

  return { data: null, error };
}
