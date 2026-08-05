"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../../../components/DashboardNav";
import "../../../landing.css";
import { supabase } from "../../../../utils/supabase";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id(full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/reports" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Platform <span className="text-gradient">Reports</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Review reports of fraud, non-payment, or policy violations.</p>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Reported By</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Reason</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Target User/Job</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Details</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {report.reporter?.full_name || 'Unknown'}<br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{report.reporter?.phone_number}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: '#ff4444', fontWeight: 'bold' }}>{report.reason}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {report.reported_identifier}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '300px' }}>
                      {report.details}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No reports filed.
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
