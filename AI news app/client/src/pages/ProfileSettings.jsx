// pages/ProfileSettings.jsx
import React, { useState, useRef } from "react";

export default function ProfileSettings() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [avatar, setAvatar] = useState({ file: null, preview: null });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please upload a PNG, JPG, JPEG or WEBP image.");
      return;
    }
    const preview = URL.createObjectURL(file);
    setAvatar({ file, preview });
  }

  function removeAvatar() {
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file: null, preview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setSavedMessage({ type: "error", text: "Full name cannot be empty." });
      return;
    }
    if (!/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      setSavedMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setSaving(true);
    setSavedMessage(null);

    await new Promise((res) => setTimeout(res, 800));

    setSaving(false);
    setSavedMessage({ type: "success", text: "Profile saved successfully." });
    setTimeout(() => setSavedMessage(null), 3500);
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-md rounded-2xl p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-indigo-700">Profile Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal info</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="col-span-1 flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                {avatar.preview ? (
                  <img
                    src={avatar.preview}
                    alt="avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400">No Photo</div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <label className="inline-block">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    className="px-3 py-2 rounded-lg border border-indigo-700 text-sm text-indigo-700 hover:bg-indigo-700 hover:text-white transition"
                  >
                    Upload
                  </button>
                </label>

                {avatar.preview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="px-3 py-2 rounded-lg border border-red-100 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-3">
                PNG, JPG or WEBP. Max 5MB.
              </p>
            </div>

            {/* Form Inputs */}
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Write a short bio..."
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Message */}
          {savedMessage && (
            <p
              className={`text-sm mt-2 ${
                savedMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {savedMessage.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
