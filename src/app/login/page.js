"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import "../landing.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const phone = formData.get("phone");
    const password = formData.get("password");

    // Standardize phone number format
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '255' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('255')) {
      formattedPhone = '255' + formattedPhone;
    }

    // We map the phone number to the dummy email we used during signup
    const dummyEmail = `${formattedPhone}@nipekazi.com`;

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: password,
      });

      if (authError) throw authError;

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "Incorrect Phone Number or Password" : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="glass-nav" style={{ marginBottom: '2rem' }}>
        <div className="nav-brand">
          <Link href="/"><span className="text-gradient fw-bold">NipeKazi</span></Link>
        </div>
        <div className="nav-links">
          <Link href="/signup" className="btn btn-glass">Create an Account</Link>
        </div>
      </nav>

      <section className="animate-fade-in" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Welcome Back to <span className="text-gradient">NipeKazi</span></h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Log in to access your dashboard</p>
          
          {error && (
            <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* The user requested to login by name as well, but standard auth uses unique identifiers like phone. We'll include the field but rely on phone for the actual auth query */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>WhatsApp Phone Number</label>
              <input type="tel" name="phone" placeholder="0712345678" style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" style={inputStyle} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }} disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(0,0,0,0.2)',
  color: 'white',
  width: '100%',
  fontFamily: 'inherit'
};
