import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Camera,
  X,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [avatar, setAvatar] = useState({ file: null, preview: null });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setForm({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });

        if (data.avatar) {
          setAvatar({
            file: null,
            preview: `http://localhost:5000/uploads/${data.avatar}`,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setSavedMessage({
        type: "error",
        text: "Please upload PNG, JPG, or WEBP image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSavedMessage({
        type: "error",
        text: "Image must be less than 5MB.",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setAvatar({ file, preview });
  }

  function removeAvatar() {
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file: null, preview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSavedMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.fullName.trim()) {
      setSavedMessage({
        type: "error",
        text: "Full name cannot be empty.",
      });
      return;
    }

    setSaving(true);
    setSavedMessage(null);

    try {
      const token = localStorage.getItem("token");
      let response;

      if (avatar.file) {
        const formData = new FormData();
        formData.append("name", form.fullName);
        formData.append("phone", form.phone);
        formData.append("bio", form.bio);
        formData.append("avatar", avatar.file);

        response = await axios.put(
          "http://localhost:5000/api/users/profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // no new file; if preview is null, ask backend to remove avatar
        response = await axios.put(
          "http://localhost:5000/api/users/profile",
          {
            name: form.fullName,
            phone: form.phone,
            bio: form.bio,
            removeAvatar: !avatar.preview,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setSavedMessage({ type: "success", text: "✅ Profile saved!" });
      localStorage.setItem("user", JSON.stringify(response.data));

      setForm({
        fullName: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        bio: response.data.bio || "",
      });

      if (response.data.avatar) {
        setAvatar({
          file: null,
          preview: `http://localhost:5000/uploads/${response.data.avatar}`,
        });
      } else {
        setAvatar({ file: null, preview: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      setSavedMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(null), 2500);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordMessage(null);

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPasswordMessage({ type: "error", text: "All fields required" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Min 6 characters" });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords don't match" });
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordMessage({ type: "success", text: "✅ Password changed!" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Failed",
      });
    } finally {
      setChangingPassword(false);
      setTimeout(() => setPasswordMessage(null), 2500);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/users/account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      alert("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      alert("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-5">
          <header className="mb-4">
            <h1 className="text-lg font-bold text-indigo-700">
              Profile Settings
            </h1>
            <p className="text-xs text-gray-600">Manage your account</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT - Profile */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {savedMessage && (
                  <div
                    className={`p-2 rounded text-xs ${
                      savedMessage.type === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {savedMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        disabled
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-0.5">
                        Cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center">
                        {avatar.preview ? (
                          <img
                            src={avatar.preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-2xl text-indigo-700 font-bold">
                            {form.fullName
                              ? form.fullName[0].toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1 bg-indigo-700 rounded-full text-white hover:bg-indigo-800 transition shadow-lg"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    {avatar.preview && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="mt-1.5 text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-1.5 text-center leading-tight">
                      PNG, JPG
                      <br />
                      (Max 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="2"
                    maxLength="200"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700 resize-none"
                    placeholder="Write a short bio..."
                  />
                  <p className="text-xs text-gray-500 mt-0.5 text-right">
                    {form.bio.length}/200
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm rounded-lg hover:bg-indigo-800 disabled:opacity-50 transition"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* RIGHT - Security */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Security
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                {passwordMessage && (
                  <div
                    className={`p-2 rounded text-xs ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Min 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full px-4 py-2 bg-indigo-700 text-white text-sm rounded-lg hover:bg-indigo-800 disabled:opacity-50 transition"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-red-900">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    Permanently delete your account and all data.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Delete Account
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type <span className="font-bold text-red-600">DELETE</span> to
                  confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Type DELETE"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmation !== "DELETE"}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
