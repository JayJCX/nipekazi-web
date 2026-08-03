"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../../components/DashboardNav";
import { supabase } from "../../utils/supabase";
import "../../app/landing.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(e.target);
    const updates = {
      full_name: formData.get("full_name"),
      phone_number: formData.get("phone_number"),
      company_name: formData.get("company_name"),
      location: formData.get("location"),
      bio: formData.get("bio")
    };

    const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
    
    if (error) {
      setMessage("Error saving profile.");
    } else {
      setMessage("Profile saved successfully!");
      setProfile({ ...profile, ...updates });
    }
    setSaving(false);
  }

  if (loading) return <main className="main-container"><p style={{padding: '2rem'}}>Loading...</p></main>;
  if (!profile) return <main className="main-container"><p style={{padding: '2rem'}}>Please log in.</p></main>;

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/profile" />

      <section className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My <span className="text-gradient">Profile</span></h1>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              👤
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Role: <strong style={{ color: 'white', textTransform: 'capitalize' }}>{profile.role}</strong></p>
              <button className="btn btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Upload Photo</button>
            </div>
          </div>

          {message && <div style={{ padding: '1rem', background: 'rgba(37, 211, 102, 0.1)', color: 'var(--color-primary)', borderRadius: '8px' }}>{message}</div>}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Full Name</label>
                <input name="full_name" type="text" defaultValue={profile.full_name || ''} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>WhatsApp Phone Number</label>
                <input name="phone_number" type="tel" defaultValue={profile.phone_number || ''} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Location</label>
                <input name="location" type="text" defaultValue={profile.location || ''} placeholder="e.g. Dar es Salaam" style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Company Name</label>
                <input name="company_name" type="text" defaultValue={profile.company_name || ''} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Bio / Summary</label>
              <textarea name="bio" rows="4" defaultValue={profile.bio || ''} placeholder="Write a short summary about yourself..." style={inputStyle}></textarea>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
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
