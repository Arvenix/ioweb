import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <Head>
        <title>Arvenix | Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #0a0e1a;
          color: #eef2fb;
          font-family: Inter, system-ui, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: linear-gradient(
              rgba(120, 160, 230, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(120, 160, 230, 0.05) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          position: fixed;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, #1e40af, transparent 68%);
          top: -160px;
          left: -120px;
          opacity: 0.5;
          filter: blur(80px);
          z-index: 0;
        }
        .glow-2 {
          position: fixed;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, #0e7490, transparent 68%);
          bottom: -160px;
          right: -120px;
          opacity: 0.35;
          filter: blur(80px);
          z-index: 0;
        }
        .card {
          position: relative;
          z-index: 1;
          background: #111a2e;
          border: 1px solid rgba(120, 150, 210, 0.16);
          border-radius: 20px;
          padding: 48px 44px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 36px;
        }
        .brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(140deg, #2563eb, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
        .brand-mark svg {
          width: 20px;
          height: 20px;
        }
        .brand-name {
          font-family: Sora, sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #eef2fb;
        }
        .heading {
          font-family: Sora, sans-serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .subhead {
          font-size: 14.5px;
          color: #9aa8c4;
          margin-bottom: 32px;
        }
        .field {
          margin-bottom: 18px;
        }
        .field label {
          display: block;
          font-family: "IBM Plex Mono", monospace;
          font-size: 11.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7a99;
          margin-bottom: 8px;
        }
        .field input {
          width: 100%;
          background: #0d1424;
          border: 1px solid rgba(120, 150, 210, 0.2);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          color: #eef2fb;
          font-family: Inter, sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus {
          border-color: #3b7dff;
        }
        .field input::placeholder {
          color: #3d4d6a;
        }
        .error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #fca5a5;
          margin-bottom: 18px;
        }
        .btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #3b7dff, #2563eb);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.18s;
          margin-top: 8px;
        }
        .btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .footer-text {
          text-align: center;
          margin-top: 24px;
          font-size: 13.5px;
          color: #6b7a99;
        }
        .footer-text a {
          color: #22d3ee;
          text-decoration: none;
        }
        .divider {
          height: 1px;
          background: rgba(120, 150, 210, 0.14);
          margin: 28px 0;
        }
      `}</style>

      <div className="glow-1" />
      <div className="glow-2" />

      <div className="card">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 25 L14.5 7 L17.5 7 L25 25 L21 25 L19.3 20.5 L12.7 20.5 L11 25 Z M13.6 17 L18.4 17 L16 10.5 Z"
                fill="#fff"
              />
            </svg>
          </div>
          <span className="brand-name">Arvenix</span>
        </div>

        <div className="heading">Welcome back</div>
        <div className="subhead">
          Sign in to your operations dashboard
        </div>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider" />

        <div className="footer-text">
          Need access?{" "}
          <a href="mailto:info@arvenix.io">Contact your Arvenix rep</a>
        </div>
      </div>
    </>
  );
}
