import DashboardNav from "../../../components/DashboardNav";
import "../../landing.css";

export default function WalletPage() {
  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My <span className="text-gradient">Wallet</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your funds, view earnings, and withdraw via mobile money.</p>

        <div className="responsive-grid">
          
          {/* Balance Card */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.1) 0%, rgba(18,140,126,0.2) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Earnings Balance</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>TZS 450,000</h2>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>Withdraw Funds</button>
            </div>
          </div>

          {/* Transaction Form & History */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Mobile Money Transfer (M-Pesa / Tigo Pesa)</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Amount (TZS)</label>
                <input type="number" placeholder="e.g. 50000" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Phone Number</label>
                <input type="tel" placeholder="+255..." style={inputStyle} />
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Recent Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Gig Payment: Logo Design</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Yesterday</p>
                </div>
                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>+ TZS 50,000</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Withdrawal to M-Pesa</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>July 20, 2026</p>
                </div>
                <div style={{ color: '#ff4444', fontWeight: 'bold' }}>- TZS 100,000</div>
              </div>
            </div>
          </div>

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
