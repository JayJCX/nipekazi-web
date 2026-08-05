"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../../../components/DashboardNav";
import "../../../../landing.css";
import { supabase } from "../../../../utils/supabase";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      // Fetch all jobs along with the employer's name
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employer_id(full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/jobs" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Monitor <span className="text-gradient">Jobs</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>View all jobs posted across the platform.</p>

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job Title</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Employer</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Budget (TSH)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date Posted</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{job.title}</td>
                    <td style={{ padding: '1rem' }}>
                      {job.employer?.full_name || 'Unknown'}<br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.employer?.phone_number}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{job.budget?.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        background: job.status === 'Open' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: job.status === 'Open' ? '#25D366' : '#999'
                      }}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No jobs posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
