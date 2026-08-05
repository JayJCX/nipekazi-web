"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../../../components/DashboardNav";
import "../../../../landing.css";
import { supabase } from "../../../../utils/supabase";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:job_id(title, employer_id),
          freelancer:freelancer_id(full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setApplications(data);
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/applications" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Platform <span className="text-gradient">Applications</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>View all applications submitted across the system.</p>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Job Title</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Applicant</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{app.job?.title || 'Unknown Job'}</td>
                    <td style={{ padding: '1rem' }}>
                      {app.freelancer?.full_name || 'Unknown'}<br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.freelancer?.phone_number}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        background: app.status === 'Hired' ? 'rgba(37, 211, 102, 0.2)' : 
                                    app.status === 'Rejected' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: app.status === 'Hired' ? '#25D366' : 
                               app.status === 'Rejected' ? '#ff4444' : '#999'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No applications yet.
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
