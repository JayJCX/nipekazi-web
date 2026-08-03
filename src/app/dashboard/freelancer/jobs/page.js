import Link from "next/link";
import "../../../landing.css";

export default function FreelancerJobsPage() {
  return (
    <main className="main-container" style={{ paddingTop: '2rem' }}>
      <nav className="glass-nav" style={{ marginBottom: '2rem' }}>
        <div className="nav-brand">
          <Link href="/"><span className="text-gradient fw-bold">NipeKazi</span></Link>
          <span style={{ marginLeft: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Freelancer Dashboard</span>
        </div>
      </nav>

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find <span className="text-gradient">Work</span></h1>
        
        {/* Search & Filter Bar */}
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem 2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input type="text" placeholder="Search specific details (e.g., React, Design)..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#111827', color: 'white' }}>
            <option>All Types</option>
            <option>Professional</option>
            <option>Side Gigs</option>
          </select>
          <button className="btn btn-primary">Search</button>
        </div>

        {/* Job List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Frontend Developer (React/Next.js)</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>TechCorp TZ • Remote • Full-time</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(37, 211, 102, 0.1)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.85rem' }}>Professional</span>
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', fontSize: '0.85rem' }}>TZS 1,500,000/mo</span>
              </div>
            </div>
            <div>
              <button className="btn btn-primary">Apply Now</button>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Graphic Designer for Social Media</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Local Boutique • Dar es Salaam • One-time Gig</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 165, 0, 0.1)', color: 'orange', borderRadius: '999px', fontSize: '0.85rem' }}>Side Gig</span>
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', fontSize: '0.85rem' }}>TZS 50,000</span>
              </div>
            </div>
            <div>
              <button className="btn btn-primary">Apply Now</button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
