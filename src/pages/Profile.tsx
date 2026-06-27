import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Lock,
  ShieldAlert,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import AvatarUploader from "../components/AvatarUploader";
import { useAuth } from "../contexts/AuthContext";
import {
  changePassword,
  deleteAccount,
  ensureProfile,
  fetchProfile,
  saveProfile,
  uploadAvatar,
  type ProfileRecord,
} from "../lib/profile";

// TODO: Re-enable avatar upload UI after Supabase Storage `avatars` bucket and policies are configured.
const AVATAR_UPLOAD_ENABLED = false;

// TODO: Re-enable delete account UI after Supabase `delete_user` RPC is implemented.
const DELETE_ACCOUNT_ENABLED = false;

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadProfile = useCallback(async () => {
    if (!user) return;

    setLoadingProfile(true);
    setErrorMsg("");

    const email = user.email ?? "";
    const fallbackName =
      (user.user_metadata?.display_name as string | undefined) ||
      email.split("@")[0] ||
      "User";

    const ensured = await ensureProfile(user.id, email, fallbackName);
    if (ensured.error) {
      setErrorMsg(ensured.error.message);
      setLoadingProfile(false);
      return;
    }

    const { data, error } = await fetchProfile(user.id);
    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      setProfile(data);
      setDisplayName(data.display_name ?? fallbackName);
    }

    setLoadingProfile(false);
  }, [user]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setErrorMsg("Display name is required.");
      setSavingProfile(false);
      return;
    }

    const { data, error } = await saveProfile(user.id, {
      display_name: trimmedName,
      email: user.email ?? undefined,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setProfile(data);
      setDisplayName(trimmedName);
      setSuccessMsg("Profile saved successfully.");
    }

    setSavingProfile(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    setUploadingAvatar(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await uploadAvatar(user.id, file);
      if (error) {
        setErrorMsg(error.message);
        throw error;
      }

      setProfile((current) =>
        current ? { ...current, avatar_url: data } : current
      );
      setSuccessMsg("Avatar updated successfully.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setChangingPassword(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setChangingPassword(false);
      return;
    }

    const { error } = await changePassword(newPassword);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Password updated successfully.");
    }

    setChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (deleteConfirmation !== "DELETE") {
      setErrorMsg('Type "DELETE" to confirm account removal.');
      return;
    }

    setDeletingAccount(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await deleteAccount(user.id);
    if (error) {
      setErrorMsg(error.message);
      setDeletingAccount(false);
      return;
    }

    await signOut();
    navigate("/login", { replace: true });
  };

  const avatarUrl =
    profile?.avatar_url ??
    (user?.user_metadata?.avatar_url as string | undefined) ??
    null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-3xl mx-auto space-y-6"
    >
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-5">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-orange-500" />
            User Profile
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your display name and password.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-950/20 rounded-lg text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-lg text-xs font-medium">
            {successMsg}
          </div>
        )}

        {loadingProfile ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl space-y-5">
              <div className="space-y-1">
                <h2 className="font-bold text-sm">Profile details</h2>
                <p className="text-[11px] text-zinc-500">
                  Your public identity across Socialintel.
                </p>
              </div>

              <AvatarUploader
                displayName={displayName || user?.email?.split("@")[0] || "User"}
                avatarUrl={avatarUrl}
                uploading={uploadingAvatar}
                disabled={!user || !AVATAR_UPLOAD_ENABLED}
                onUpload={handleAvatarUpload}
              />

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Display name
                  </label>
                  <input
                    id="profile-display-name"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs dark:text-zinc-100 outline-none focus:border-orange-500 transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email ?? profile?.email ?? ""}
                    readOnly
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs text-zinc-500 dark:text-zinc-400"
                  />
                </div>

                {profile?.created_at && (
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                )}

                <button
                  id="profile-save-btn"
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition"
                >
                  {savingProfile ? "Saving…" : "Save profile"}
                </button>
              </form>
            </section>

            <section className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl space-y-4">
              <div className="space-y-1">
                <h2 className="font-bold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  Change password
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Update your account password.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    New password
                  </label>
                  <input
                    id="profile-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs dark:text-zinc-100 outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Confirm password
                  </label>
                  <input
                    id="profile-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs dark:text-zinc-100 outline-none focus:border-orange-500 transition"
                  />
                </div>

                <button
                  id="profile-change-password-btn"
                  type="submit"
                  disabled={changingPassword}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 disabled:opacity-60 text-white dark:text-zinc-900 text-xs font-bold rounded-lg transition"
                >
                  {changingPassword ? "Updating…" : "Update password"}
                </button>
              </form>
            </section>

            {/* TODO: Re-enable after Supabase `delete_user` RPC is implemented. */}
            <section className="bg-white dark:bg-zinc-950/20 border border-red-200/60 dark:border-red-950/40 p-6 rounded-2xl space-y-4">
              <div className="space-y-1">
                <h2 className="font-bold text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete account
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Permanently remove your profile and sign out. This action
                  cannot be undone.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Type DELETE to confirm
                </label>
                <input
                  id="profile-delete-confirmation"
                  type="text"
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="DELETE"
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs dark:text-zinc-100 outline-none focus:border-red-500 transition"
                />
              </div>

              <button
                id="profile-delete-btn"
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || !DELETE_ACCOUNT_ENABLED}
                className="px-4 py-2 !bg-[#dc2626] hover:!bg-[#b91c1c] disabled:opacity-60 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4 !text-[#ffffff] dark:!text-[#ffffff]" />
                <span className="!text-[#ffffff] dark:!text-[#ffffff]">
                  {deletingAccount ? "Deleting…" : "Delete account"}
                </span>
              </button>
              <p className="text-[10px] text-zinc-500">
                This option is currently disabled until the backend is ready.
              </p>
            </section>
          </div>
        )}
      </motion.div>
  );
}
