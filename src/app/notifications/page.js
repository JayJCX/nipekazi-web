"use client";

import DashboardNav from "../../components/DashboardNav";
import "../landing.css";

export default function NotificationsPage() {
  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/notifications" />

      <section className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Notifications</h1>
          <button className="btn btn-glass" style={{ fontSize: '0.9rem' }}>Mark all as read</button>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1.5rem', background: 'rgba(37, 211, 102, 0.1)' }}>
            <div style={{ fontSize: '2rem' }}>🔔</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Just now</p>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Welcome to NipeKazi!</h3>
              <p style={{ color: '#ccc' }}>Your account has been successfully created. Complete your profile to get started.</p>
            </div>
          </div>

          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1.5rem' }}>
            <div style={{ fontSize: '2rem' }}>📱</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Yesterday</p>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>WhatsApp Integration Pending</h3>
              <p style={{ color: '#ccc' }}>We are currently setting up the WhatsApp notification bot. Soon you will receive these alerts directly on your phone!</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
