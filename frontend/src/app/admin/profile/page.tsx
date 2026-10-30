"use client";

import * as React from "react";
import {
  User,
  Lock,
  ShieldCheck,
  Key,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();

  // Profile Info State
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState(false);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPass, setShowCurrentPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    if (!name.trim()) {
      setProfileError("Full Name is required.");
      return;
    }
    if (!phone.trim()) {
      setProfileError("Phone number is required.");
      return;
    }

    try {
      setProfileLoading(true);
      const res = await authApi.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      });

      if (res.success) {
        setProfileSuccess(true);
        await refreshUser();
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(res.message || "Failed to update profile info.");
      }
    } catch (err: any) {
      setProfileError(err?.message || "An unexpected error occurred.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(res.message || "Failed to change password.");
      }
    } catch (err: any) {
      setPasswordError(err?.message || "An error occurred while changing password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const roleLabel =
    user?.role === "ADMIN" ? "System Administrator" : "Store Manager / Staff";

  return (
    <AdminLayoutShell>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading tracking-tight">
            Profile & Security
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Manage your personal administrative credentials, contact details, and account password.
          </p>
        </div>

        {/* Identity Badge Header */}
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 text-gold-400 font-black text-xl flex items-center justify-center font-heading shadow-sm shrink-0">
              {name ? name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal-900 leading-tight">
                {name || "Administrator"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{roleLabel}</span>
                </span>
                <span className="text-xs text-charcoal-400 font-mono">
                  {user?.phone}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-charcoal-400 border-t sm:border-t-0 sm:border-l border-brand-border pt-3 sm:pt-0 sm:pl-6 space-y-1">
            <p>Role: <strong className="text-charcoal-700">{user?.role}</strong></p>
            <p>Status: <strong className="text-emerald-600">Active Session</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Personal Info */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-brand-border mb-5">
                <User className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-base text-charcoal-900">
                  Personal Information
                </h3>
              </div>

              {profileSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal information saved successfully!</span>
                </div>
              )}

              {profileError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all"
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Phone Number (Login Identifier) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all font-mono"
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                  <p className="text-[11px] text-charcoal-400 mt-1">
                    Used to sign in to the dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all"
                      placeholder="admin@shoilpikkabbo.com"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border">
              <button
                type="submit"
                form="profile-form"
                disabled={profileLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Personal Info</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Password Change */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-brand-border mb-5">
                <Lock className="w-4 h-4 text-forest-800" />
                <h3 className="font-bold text-base text-charcoal-900">
                  Change Password
                </h3>
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your password has been changed successfully!</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all font-mono"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    New Password (Min. 6 chars) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all font-mono"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 transition-all font-mono"
                    placeholder="Re-enter new password"
                  />
                </div>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border">
              <button
                type="submit"
                form="password-form"
                disabled={passwordLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutShell>
  );
}

