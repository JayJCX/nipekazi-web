"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../../../components/DashboardNav";
import "../../../landing.css";
import { supabase } from "../../../../utils/supabase";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employer_id(id, full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to completely delete this job? This cannot be undone.")) return;
    
    // Clean up dependent records first to avoid foreign key violations
    await supabase.from('applications').delete().eq('job_id', jobId);
    await supabase.from('contracts').delete().eq('job_id', jobId);
    
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (!error) {
      setJobs(jobs.filter(j => j.id !== jobId));
    } else {
      alert("Error deleting job: " + error.message);
    }
  };

  const handleWarnEmployer = async (employerId, employerName) => {
    const message = window.prompt(`Enter warning message to send to ${employerName} on WhatsApp:`, "⚠️ WARNING FROM ADMIN: Your recent job posting violates our terms of service.");
    if (!message) return;

    const { error } = await supabase.from('admin_messages').insert({ target_user_id: employerId, message });
    if (!error) {
      alert("Warning sent! The WhatsApp bot will deliver it shortly.");
    } else {
      alert("Error sending warning. Make sure you ran the SQL script to create the admin_messages table.");
    }
  };

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/jobs" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Monitor <span className="text-gradient">Jobs</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>View, manage, delete invalid jobs, and warn employers.</p>

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job Title</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Employer</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date Posted</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{job.title}</strong><br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>TSH {job.budget?.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {job.employer?.full_name || 'Unknown'}<br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.employer?.phone_number}</span>
                    </td>
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
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        style={{
                          background: 'rgba(255,68,68,0.1)',
                          border: '1px solid #ff4444',
                          color: '#ff4444',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                        Delete Job
                      </button>
                      {job.employer && (
                        <button 
                          onClick={() => handleWarnEmployer(job.employer.id, job.employer.full_name)}
                          style={{
                            background: 'rgba(243, 156, 18, 0.1)',
                            border: '1px solid #f39c12',
                            color: '#f39c12',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}>
                          Warn Employer
                        </button>
                      )}
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
