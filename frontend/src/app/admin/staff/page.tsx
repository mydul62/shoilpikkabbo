"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  Trash2,
  Key,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Lock,
  X,
  Loader2,
  UserCheck,
  ArrowRightLeft,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { useAuth } from "@/context/AuthContext";
import { staffApi } from "@/lib/api";

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export default function AdminStaffPage() {
  const { user: currentUser } = useAuth();

  const [staffList, setStaffList] = React.useState<StaffMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Create Staff Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newRole, setNewRole] = React.useState<"ADMIN" | "STAFF">("STAFF");
  const [newPassword, setNewPassword] = React.useState("");
  const [createModalError, setCreateModalError] = React.useState<string | null>(null);

  // Reset Password Modal State
  const [resetModalUser, setResetModalUser] = React.useState<StaffMember | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = React.useState("");
  const [resetModalError, setResetModalError] = React.useState<string | null>(null);

  const fetchStaff = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await staffApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setStaffList(res.data);
      } else {
        setError(res.message || "Failed to load team members.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateModalError(null);

    if (!newName.trim() || !newPhone.trim() || !newPassword) {
      setCreateModalError("Please fill in all required fields.");
      return;
    }

    if (newPassword.length < 6) {
      setCreateModalError("Initial password must be at least 6 characters.");
      return;
    }

    try {
      setActionLoading(true);
      const res = await staffApi.create({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
        role: newRole,
        password: newPassword,
      });

      if (res.success) {
        setIsCreateModalOpen(false);
        setNewName("");
        setNewPhone("");
        setNewEmail("");
        setNewRole("STAFF");
        setNewPassword("");
        showSuccess(`Account for ${(res.data as any)?.name || newName} created successfully!`);
        await fetchStaff();
      } else {
        setCreateModalError(res.message || "Failed to create team member.");
      }
    } catch (err: any) {
      setCreateModalError(err?.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async (member: StaffMember) => {
    if (member.id === currentUser?.id) {
      alert("You cannot change your own role.");
      return;
    }

    const nextRole = member.role === "ADMIN" ? "STAFF" : "ADMIN";
    const nextRoleLabel = nextRole === "ADMIN" ? "Administrator" : "Manager (Staff)";

    if (
      !confirm(
        `Are you sure you want to change ${member.name}'s role to ${nextRoleLabel}?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await staffApi.updateRole(member.id, nextRole);
      if (res.success) {
        showSuccess(`Updated ${member.name}'s role to ${nextRoleLabel}.`);
        await fetchStaff();
      } else {
        alert(res.message || "Failed to update role.");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update role.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;
    setResetModalError(null);

    if (!resetPasswordValue || resetPasswordValue.length < 6) {
      setResetModalError("New password must be at least 6 characters.");
      return;
    }

    try {
      setActionLoading(true);
      const res = await staffApi.resetPassword(resetModalUser.id, resetPasswordValue);
      if (res.success) {
        showSuccess(`Password reset successfully for ${resetModalUser.name}.`);
        setResetModalUser(null);
        setResetPasswordValue("");
      } else {
        setResetModalError(res.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setResetModalError(err?.message || "Failed to reset password.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStaff = async (member: StaffMember) => {
    if (member.id === currentUser?.id) {
      alert("You cannot delete your own logged-in account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to permanently remove ${member.name} (${member.role}) from the administrative team?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await staffApi.delete(member.id);
      if (res.success) {
        showSuccess(`Removed ${member.name} from the administrative team.`);
        await fetchStaff();
      } else {
        alert(res.message || "Failed to delete team member.");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete team member.");
    } finally {
      setActionLoading(false);
    }
  };

  const adminCount = staffList.filter((s) => s.role === "ADMIN").length;
  const managerCount = staffList.filter((s) => s.role === "STAFF").length;

  return (
    <AdminLayoutShell>
      <div className="space-y-6 max-w-6xl">
        {/* Header with Title and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-forest-800" />
              <span>Team & Staff Management</span>
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Create and manage administrative accounts, assign roles (Admin vs Manager), and maintain system access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateModalError(null);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-charcoal-500 font-semibold block mb-1">
              Total Team Members
            </span>
            <div className="text-2xl font-black text-charcoal-900 font-heading">
              {staffList.length}
            </div>
            <span className="text-[11px] text-charcoal-400 mt-1 block">
              Active administrative accounts
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-emerald-800 font-semibold block mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>System Administrators</span>
            </span>
            <div className="text-2xl font-black text-emerald-900 font-heading">
              {adminCount}
            </div>
            <span className="text-[11px] text-emerald-600/80 mt-1 block">
              Full control & staff creation rights
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-xs">
            <span className="text-xs text-blue-800 font-semibold block mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-700" />
              <span>Store Managers (Staff)</span>
            </span>
            <div className="text-2xl font-black text-blue-900 font-heading">
              {managerCount}
            </div>
            <span className="text-[11px] text-blue-600/80 mt-1 block">
              Orders, products & inquiry operations
            </span>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-charcoal-900">
              Active Administrative Accounts ({staffList.length})
            </h2>
            <button
              onClick={fetchStaff}
              disabled={loading}
              className="text-xs font-semibold text-forest-800 hover:underline cursor-pointer"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-charcoal-400">
              <Loader2 className="w-8 h-8 animate-spin text-forest-800 mb-2" />
              <p className="text-xs">Loading team accounts...</p>
            </div>
          ) : staffList.length === 0 ? (
            <div className="py-16 text-center text-charcoal-400 text-sm">
              No staff members found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-charcoal-600 uppercase font-bold border-b border-brand-border text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Member</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Added On</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {staffList.map((member) => {
                    const isSelf = member.id === currentUser?.id;
                    const initials = member.name
                      ? member.name.slice(0, 2).toUpperCase()
                      : "U";

                    return (
                      <tr
                        key={member.id}
                        className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                          isSelf ? "bg-amber-50/30" : ""
                        }`}
                      >
                        {/* Member Identity */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-forest-800 text-gold-400 font-bold font-heading text-xs flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-charcoal-900 text-sm flex items-center gap-1.5">
                                <span>{member.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-charcoal-400 text-[11px]">
                                ID: {member.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          {member.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Administrator</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Manager (Staff)</span>
                            </span>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-mono text-charcoal-800 font-medium">
                              {member.phone}
                            </div>
                            {member.email && (
                              <div className="text-charcoal-400 text-[11px]">
                                {member.email}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 text-charcoal-500 text-[11px]">
                          {new Date(member.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Toggle Role Button */}
                            <button
                              type="button"
                              disabled={isSelf || actionLoading}
                              onClick={() => handleToggleRole(member)}
                              title={
                                isSelf
                                  ? "Cannot change your own role"
                                  : `Switch role to ${
                                      member.role === "ADMIN" ? "Manager" : "Admin"
                                    }`
                              }
                              className={`p-1.5 rounded-lg border border-brand-border text-charcoal-600 hover:text-forest-800 hover:bg-white transition-colors cursor-pointer ${
                                isSelf ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Password Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setResetModalError(null);
                                setResetPasswordValue("");
                                setResetModalUser(member);
                              }}
                              title="Reset Password"
                              className="p-1.5 rounded-lg border border-brand-border text-charcoal-600 hover:text-amber-700 hover:bg-white transition-colors cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Member Button */}
                            <button
                              type="button"
                              disabled={isSelf || actionLoading}
                              onClick={() => handleDeleteStaff(member)}
                              title={
                                isSelf
                                  ? "Cannot delete current session"
                                  : "Delete team member"
                              }
                              className={`p-1.5 rounded-lg border border-brand-border text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
                                isSelf ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create Team Member */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-brand-border relative animate-scale-up">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-lg text-charcoal-900 font-heading">
                    Add Administrative Member
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createModalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{createModalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800"
                    placeholder="e.g. Asif Mahmud"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Phone Number (Login ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 font-mono focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800"
                    placeholder="e.g. 01711223344"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800"
                    placeholder="e.g. asif@shoilpikkabbo.com"
                  />
                </div>

                {/* Role Radio Picker */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-2">
                    Administrative Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                        newRole === "STAFF"
                          ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                          : "border-brand-border hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-900">
                          Manager (Staff)
                        </span>
                        <input
                          type="radio"
                          name="role"
                          value="STAFF"
                          checked={newRole === "STAFF"}
                          onChange={() => setNewRole("STAFF")}
                          className="accent-blue-600"
                        />
                      </div>
                      <p className="text-[11px] text-charcoal-500 leading-snug">
                        Can process orders, update products & reply to inquiries.
                      </p>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                        newRole === "ADMIN"
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600"
                          : "border-brand-border hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-900">
                          Administrator
                        </span>
                        <input
                          type="radio"
                          name="role"
                          value="ADMIN"
                          checked={newRole === "ADMIN"}
                          onChange={() => setNewRole("ADMIN")}
                          className="accent-emerald-600"
                        />
                      </div>
                      <p className="text-[11px] text-charcoal-500 leading-snug">
                        Full access: create staff, configure payments & site settings.
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Initial Password (Min. 6 characters) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 font-mono focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800"
                    placeholder="Enter secure password"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-charcoal-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Create Member</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reset Password */}
        {resetModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border relative animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-forest-800" />
                  <h3 className="font-bold text-base text-charcoal-900">
                    Reset Password
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-charcoal-600 mb-4">
                Setting a new password for <strong>{resetModalUser.name}</strong> ({resetModalUser.phone}).
              </p>

              {resetModalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{resetModalError}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    New Password (Min. 6 chars) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={resetPasswordValue}
                    onChange={(e) => setResetPasswordValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-charcoal-900 font-mono focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-charcoal-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-sand text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {actionLoading ? "Resetting..." : "Save New Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
