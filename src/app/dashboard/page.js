"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import "../landing.css";
import Link from "next/link";
import { supabase } from "../../utils/supabase";

export default function DashboardOverview() {
  const [role, setRole] = useState(null);
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoleAndStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data) {
          setRole(data.role);
          if (data.role === 'admin') {
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
            const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });
            const { count: repCount } = await supabase.from('reports').select('*', { count: 'exact', head: true });
            setStats({ users: userCount || 0, jobs: jobCount || 0, applications: appCount || 0, reports: repCount || 0 });
          }
        }
      }
      setLoading(false);
    }
    fetchRoleAndStats();
  }, []);

  if (loading) {
    return (
      <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to your <span className="text-gradient">Dashboard</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          {role === 'admin' ? "System Overview and Platform Activity." : "Here is an overview of your activity on NipeKazi."}
        </p>

        {role === 'admin' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <Link href="/dashboard/admin/users" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>👥</div>
              <h3 style={{ fontSize: '1.25rem' }}>Total Users</h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>{stats.users}</p>
              <p style={{ color: 'var(--text-muted)' }}>Manage platform registered users.</p>
            </Link>

            <Link href="/dashboard/admin/jobs" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>💼</div>
              <h3 style={{ fontSize: '1.25rem' }}>Total Jobs</h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>{stats.jobs}</p>
              <p style={{ color: 'var(--text-muted)' }}>Monitor active and closed jobs.</p>
            </Link>

            <Link href="/dashboard/admin/applications" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>📄</div>
              <h3 style={{ fontSize: '1.25rem' }}>Total Applications</h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>{stats.applications}</p>
              <p style={{ color: 'var(--text-muted)' }}>System-wide job applications.</p>
            </Link>

            <Link href="/dashboard/admin/reports" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none', borderBottom: '4px solid #ff4444' }}>
              <div style={{ fontSize: '2.5rem' }}>🚩</div>
              <h3 style={{ fontSize: '1.25rem' }}>Total Reports</h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>{stats.reports}</p>
              <p style={{ color: 'var(--text-muted)' }}>Review and manage user reports.</p>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <Link href="/dashboard/applications" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>📄</div>
              <h3 style={{ fontSize: '1.25rem' }}>Applications</h3>
              <p style={{ color: 'var(--text-muted)' }}>View candidates or track your applied jobs.</p>
            </Link>

            <Link href="/dashboard/contracts" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.25rem' }}>Contracts</h3>
              <p style={{ color: 'var(--text-muted)' }}>Manage hired talent or active gigs you are working on.</p>
            </Link>

            <Link href="/dashboard/wallet" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>💰</div>
              <h3 style={{ fontSize: '1.25rem' }}>Wallet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Check your balance and manage M-Pesa withdrawals.</p>
            </Link>

            <Link href="/dashboard/report" className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textDecoration: 'none', borderBottom: '4px solid #ff4444' }}>
              <div style={{ fontSize: '2.5rem' }}>🚩</div>
              <h3 style={{ fontSize: '1.25rem' }}>Report Center</h3>
              <p style={{ color: 'var(--text-muted)' }}>Report scams, non-payments, or untrustworthy users safely.</p>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
