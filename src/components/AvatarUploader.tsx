import { ChangeEvent, useRef, useState } from "react";
import { Camera, Loader2, ShieldAlert } from "lucide-react";

// TODO: Re-enable in Profile.tsx after Supabase Storage `avatars` bucket and policies are configured.

type AvatarUploaderProps = {
  displayName: string;
  avatarUrl: string | null;
  uploading?: boolean;
  disabled?: boolean;
  onUpload: (file: File) => Promise<void>;
};

export default function AvatarUploader({
  displayName,
  avatarUrl,
  uploading = false,
  disabled = false,
  onUpload,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState("");

  const initials = displayName
    ? displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLocalError("");
    try {
      await onUpload(file);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Failed to upload avatar."
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white text-xl overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-zinc-950/50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2 min-w-0">
          <p className="text-xs text-zinc-500">
            Upload a square image (JPEG, PNG, WebP, or GIF). Max 2 MB.
          </p>
          <button
            id="profile-avatar-upload-btn"
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 disabled:opacity-60 transition"
          >
            <Camera className="w-3.5 h-3.5 text-orange-500" />
            {uploading ? "Uploading…" : "Change avatar"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {localError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-950/20 rounded-lg text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}
