import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type SavedExportRecord = {
  id: string;
  user_id: string;
  file_name: string | null;
  export_type: string | null;
  file_format: string | null;
  file_size: string | null;
  created_at: string;
};

export type SavedExportInput = {
  user_id: string;
  file_name?: string | null;
  export_type?: string | null;
  file_format?: string | null;
  file_size?: string | null;
  created_at?: string;
};

export type SavedExportResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};

export async function fetchSavedExports(
  userId: string
): Promise<SavedExportResult<SavedExportRecord[]>> {
  const { data, error } = await supabase
    .from("saved_exports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addSavedExport(
  record: SavedExportInput
): Promise<SavedExportResult<SavedExportRecord>> {
  const payload = {
    user_id: record.user_id,
    file_name: record.file_name ?? null,
    export_type: record.export_type ?? "Export",
    file_format: record.file_format ?? null,
    file_size: record.file_size ?? null,
    created_at: record.created_at ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("saved_exports")
    .insert(payload)
    .select("*")
    .single();

  return { data, error };
}

export async function deleteSavedExport(
  id: string
): Promise<SavedExportResult<null>> {
  const { error } = await supabase.from("saved_exports").delete().eq("id", id);
  return { data: null, error };
}

export async function clearSavedExports(
  userId: string
): Promise<SavedExportResult<null>> {
  const { error } = await supabase
    .from("saved_exports")
    .delete()
    .eq("user_id", userId);

  return { data: null, error };
}
