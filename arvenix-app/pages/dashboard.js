import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: "#0a0e1a", color: "#eef2fb",
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "Inter, sans-serif", fontSize: "16px",
        color: "#9aa8c4"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      background: "#0a0e1a", color: "#eef2fb",
      minHeight: "100vh", fontFamily: "Inter, sans-serif",
      padding: "48px"
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        gap: "11px", marginBottom: "48px"
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "9px",
          background: "linear-gradient(140deg, #2563eb, #22d3ee)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 25 L14.5 7 L17.5 7 L25 25 L21 25 L19.3 20.5 L12.7 20.5 L11 25 Z M13.6 17 L18.4 17 L16 10.5 Z" fill="#fff" />
          </svg>
        </div>
        <span style={{
          fontFamily: "sans-serif", fontSize: "20px",
          fontWeight: "700", color: "#eef2fb"
        }}>Arvenix</span>
      </div>

      <h1 style={{
        fontSize: "32px", fontWeight: "700",
        marginBottom: "8px", letterSpacing: "-0.02em"
      }}>
        Operations Dashboard
      </h1>
      <p style={{ color: "#9aa8c4", marginBottom: "48px" }}>
        Welcome, {user?.email}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px", marginBottom: "40px"
      }}>
        {[
          { label: "Backlog Velocity", value: "Analyzing...", sub: "Throughput unlocked" },
          { label: "Inventory Position", value: "Analyzing...", sub: "Capital recovered" },
          { label: "Installer Utilization", value: "Analyzing...", sub: "Capacity gained" },
          { label: "Capacity Headroom", value: "Analyzing...", sub: "Revenue expanded" },
        ].map((card, i) => (
          <div key={i} style={{
            background: "#111a2e",
            border: "1px solid rgba(120,150,210,0.16)",
            borderRadius: "14px", padding: "28px"
          }}>
            <div style={{
              fontFamily: "monospace", fontSize: "11px",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#6b7a99", marginBottom: "12px"
            }}>
              {card.label}
            </div>
            <div style={{
              fontSize: "22px", fontWeight: "700",
              color: "#22d3ee", marginBottom: "8px"
            }}>
              {card.value}
            </div>
            <div style={{ fontSize: "13px", color: "#6b7a99" }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={async () => {
          const supabase = getSupabase();
          await supabase.auth.signOut();
          router.push("/");
        }}
        style={{
          background: "transparent",
          border: "1px solid rgba(120,150,210,0.2)",
          borderRadius: "8px", padding: "10px 20px",
          color: "#9aa8c4", cursor: "pointer",
          fontSize: "14px", fontFamily: "Inter, sans-serif"
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
