import DashboardNav from "../../../components/DashboardNav";
import "../../landing.css";

export default function ReportPage() {
  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard" />

      <section className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ff4444' }}>Report an <span style={{ color: 'white' }}>Issue</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We take trust seriously. Report untrustworthy behavior, scams, or infidelities here.</p>

        <div className="glass-card" style={{ borderTop: '4px solid #ff4444' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Who are you reporting?</label>
              <input type="text" placeholder="Enter user's Full Name or Phone Number" style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Reason for Report</label>
              <select style={{ ...inputStyle, background: '#111827' }} required>
                <option value="">Select a reason...</option>
                <option>Non-payment</option>
                <option>Scam / Fraudulent Job</option>
                <option>Inappropriate Behavior</option>
                <option>Failed to Deliver Work</option>
                <option>Other Untrustworthy Action</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Details & Proof</label>
              <textarea rows="5" placeholder="Please describe what happened in detail. You can also mention if you have WhatsApp chat screenshots as proof." style={inputStyle} required></textarea>
            </div>

            <button type="button" className="btn btn-primary" style={{ background: '#ff4444', color: 'white', boxShadow: '0 4px 15px rgba(255, 68, 68, 0.2)' }}>Submit Report</button>
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
