import DashboardNav from "../../components/DashboardNav";
import "../landing.css";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to your <span className="text-gradient">Dashboard</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Here is an overview of your activity on NipeKazi.</p>

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
      </section>
    </main>
  );
}
