"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../../../components/DashboardNav";
import { supabase } from "../../../utils/supabase";
import "../../landing.css";

export default function ApplicationsPage() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);

        if (profileData) {
          if (profileData.role === 'employer') {
            // Employer sees all applications to jobs they posted
            const { data: apps } = await supabase
              .from('applications')
              .select('*, jobs!inner(*), profiles!freelancer_id(full_name, phone_number, bio)')
              .eq('jobs.employer_id', profileData.id);
            setApplications(apps || []);
          } else {
            // Freelancer sees jobs they applied to
            const { data: apps } = await supabase
              .from('applications')
              .select('*, jobs!inner(*, profiles!employer_id(company_name))')
              .eq('freelancer_id', profileData.id);
            setApplications(apps || []);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleHire(appId, jobId, freelancerId, budget) {
    // Basic hire logic for employer
    alert("In a full app, this would change the application status to Hired and create a Contract record.");
  }

  if (loading) return <main className="main-container"><p style={{padding: '2rem'}}>Loading...</p></main>;
  if (!profile) return <main className="main-container"><p style={{padding: '2rem'}}>Please log in.</p></main>;

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/applications" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Job <span className="text-gradient">Applications</span></h1>
        
        {profile.role === 'employer' ? (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review freelancers who have applied to your job postings.</p>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Track the status of jobs you have applied to.</p>
        )}

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No applications found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {profile.role === 'freelancer' && applications.map(app => (
              <div key={app.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{app.jobs?.title}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{app.jobs?.profiles?.company_name || 'Employer'} • Applied recently</p>
                </div>
                <div>
                  <span style={{ padding: '0.5rem 1rem', background: 'rgba(255, 165, 0, 0.1)', color: 'orange', borderRadius: '8px', fontWeight: 'bold' }}>{app.status}</span>
                </div>
              </div>
            ))}

            {profile.role === 'employer' && applications.map(app => (
              <div key={app.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-primary)' }}>
                <div>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Applying for: {app.jobs?.title}</p>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{app.profiles?.full_name}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>WhatsApp: {app.profiles?.phone_number}</p>
                  {app.profiles?.bio && <p style={{ fontSize: '0.9rem', color: '#ccc', maxWidth: '500px' }}>"{app.profiles.bio}"</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(255, 165, 0, 0.1)', color: 'orange', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>{app.status}</span>
                  <button onClick={() => handleHire(app.id, app.job_id, app.freelancer_id, app.jobs?.budget)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Hire Freelancer</button>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>
    </main>
  );
}
