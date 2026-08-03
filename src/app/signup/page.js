"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import "../landing.css";

export default function SignUpPage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const companyName = formData.get("companyName") || null;

    // Workaround: Supabase requires Email/Password natively for password auth.
    // We map the phone number to a dummy email to allow Phone + Password auth without needing an SMS provider right now.
    const dummyEmail = `${phone.replace(/[^0-9]/g, '')}@nipekazi.com`;

    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
      });

      if (authError) throw authError;

      // 2. Insert their profile data into the `profiles` table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              role: role,
              full_name: fullName,
              phone_number: phone,
              company_name: companyName,
              location: "Tanzania" // Default or can be added to form later
            }
          ]);

        if (profileError) {
          throw new Error("Profile Insert Error: " + profileError.message);
        }

        // Redirect to dashboard on success
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
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
          <Link href="/login" className="btn btn-glass">Log In instead</Link>
        </div>
      </nav>

      <section className="animate-fade-in" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
          
          {!role ? (
            <div className="role-selection">
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Join <span className="text-gradient">NipeKazi</span></h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>How would you like to use the platform?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => setRole('freelancer')}
                  className="btn btn-glass" 
                  style={{ padding: '1.5rem', justifyContent: 'flex-start', fontSize: '1.1rem', gap: '1rem' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>💼</span> I'm a Freelancer looking for work
                </button>
                <button 
                  onClick={() => setRole('employer')}
                  className="btn btn-glass" 
                  style={{ padding: '1.5rem', justifyContent: 'flex-start', fontSize: '1.1rem', gap: '1rem' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🏢</span> I'm an Employer hiring talent
                </button>
              </div>
            </div>
          ) : (
            <div className="signup-form animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => setRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                <h2 style={{ fontSize: '1.8rem' }}>Sign up as <span className="text-gradient">{role === 'freelancer' ? 'Freelancer' : 'Employer'}</span></h2>
              </div>

              {error && (
                <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Full Name</label>
                  <input type="text" name="fullName" placeholder="John Doe" style={inputStyle} required />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>WhatsApp Phone Number</label>
                  <input type="tel" name="phone" placeholder="0712345678" style={inputStyle} required />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Required for job alerts and communication</small>
                </div>

                {role === 'employer' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Company Name (Optional)</label>
                    <input type="text" name="companyName" placeholder="TechCorp TZ" style={inputStyle} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Password</label>
                  <input type="password" name="password" placeholder="••••••••" style={inputStyle} required minLength="6" />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }} disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </div>
          )}
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
