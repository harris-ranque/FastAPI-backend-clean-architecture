"use client";

import { FormEvent, useMemo, useState } from "react";

import { logIn, signUp, type UserRole } from "../lib/api";

const roles: UserRole[] = ["USER", "ADMIN", "SUPER_ADMIN"];
type AuthMode = "login" | "register";

export default function Page() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");

  const baseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
    [],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (mode === "login") {
        await logIn({ username, password });
        setMessage("Login successful.");
        return;
      }

      const registered = await signUp({ username, password, role });
      setMessage(`Account created. User ID: ${registered.id}`);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#ffffff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.28)",
        }}
      >
        <h1 style={{ margin: 0 }}>Welcome</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>Sign in or create your account.</p>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
          API: <code>{baseUrl}</code>
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: mode === "login" ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: mode === "login" ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: mode === "register" ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: mode === "register" ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
          </label>

          {mode === "register" && (
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#374151" }}>Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 8,
              background: isError ? "#fef2f2" : "#f0fdf4",
              color: isError ? "#991b1b" : "#166534",
              border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`,
              wordBreak: "break-word",
            }}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
