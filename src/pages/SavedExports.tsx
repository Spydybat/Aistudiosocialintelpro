import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import {
  clearSavedExports,
  deleteSavedExport,
  fetchSavedExports,
  type SavedExportRecord,
} from "../lib/savedExports";

export default function SavedExports() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [records, setRecords] = useState<SavedExportRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExports = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    const { data, error } = await fetchSavedExports(user.id);
    if (error) {
      setError(error.message);
    } else {
      setRecords(data ?? []);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void loadExports();
  }, [loadExports]);

  useEffect(() => {
    const handleSavedExportsUpdated = () => {
      void loadExports();
    };

    window.addEventListener("saved-exports:updated", handleSavedExportsUpdated);
    return () => {
      window.removeEventListener("saved-exports:updated", handleSavedExportsUpdated);
    };
  }, [loadExports]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;

    return records.filter((record) => {
      const haystack = [
        record.file_name,
        record.export_type,
        record.file_format,
        record.file_size,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [records, search]);

  const handleDelete = async (id: string) => {
    const { error } = await deleteSavedExport(id);
    if (error) {
      setError(error.message);
      return;
    }

    setRecords((current) => current.filter((record) => record.id !== id));
  };

  const handleClearAll = async () => {
    if (!user?.id) return;

    const { error } = await clearSavedExports(user.id);
    if (error) {
      setError(error.message);
      return;
    }

    setRecords([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-6xl mx-auto space-y-6"
    >
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Saved Exports</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review exports saved for your account from the existing Supabase project.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 px-3 py-2 text-sm w-full sm:max-w-md">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search file, type, format"
            className="w-full bg-transparent outline-none text-sm"
          />
        </label>

        <button
          type="button"
          onClick={handleClearAll}
          className="px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          Clear all exports
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-sm text-zinc-500">
          No saved exports yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/30">
          <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr_0.3fr] gap-2 p-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-900">
            <span>File Name</span>
            <span>Export Type</span>
            <span>File Format</span>
            <span>File Size</span>
            <span>Created Date</span>
            <span />
          </div>

          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr_0.3fr] gap-2 p-3 border-t border-zinc-200 dark:border-zinc-900 text-sm items-center"
            >
              <span className="truncate font-medium">{record.file_name ?? "—"}</span>
              <span className="truncate text-zinc-600 dark:text-zinc-300">{record.export_type ?? "—"}</span>
              <span className="truncate">{record.file_format ?? "—"}</span>
              <span className="truncate">{record.file_size ?? "—"}</span>
              <span className="truncate text-zinc-500">
                {record.created_at ? new Date(record.created_at).toLocaleString() : "—"}
              </span>
              <button
                type="button"
                onClick={() => void handleDelete(record.id)}
                className="justify-self-end rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-900"
                title="Delete export"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
