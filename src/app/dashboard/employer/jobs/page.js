import Link from "next/link";
import "../../../landing.css";

export default function EmployerJobsPage() {
  return (
    <main className="main-container" style={{ paddingTop: '2rem' }}>
      <nav className="glass-nav" style={{ marginBottom: '2rem' }}>
        <div className="nav-brand">
          <Link href="/"><span className="text-gradient fw-bold">NipeKazi</span></Link>
          <span style={{ marginLeft: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Employer Dashboard</span>
        </div>
      </nav>

      <section className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Post a <span className="text-gradient">New Job</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Create a job post. Once published, it will be visible on the main job board and sent via WhatsApp.</p>
          </div>
        </div>

        <div className="glass-card" style={{ maxWidth: '800px' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Job Title</label>
              <input type="text" placeholder="e.g. Frontend Developer" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Job Type</label>
              <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#111827', color: 'white' }}>
                <option>Professional (Long-term)</option>
                <option>Side Gig (One-time)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Budget / Salary (TZS)</label>
              <input type="text" placeholder="e.g. 500,000" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Job Description</label>
              <textarea rows="5" placeholder="Describe the responsibilities and requirements..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}></textarea>
            </div>

            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>Publish Job & Send to WhatsApp</button>
          </form>
        </div>
      </section>
    </main>
  );
}
