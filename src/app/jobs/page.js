import Link from "next/link";
import "../landing.css"; // Reuse some styles for consistency

export default function JobsPage() {
  return (
    <main className="main-container" style={{ paddingTop: '2rem' }}>
      {/* Navigation - simplified for sub-pages */}
      <nav className="glass-nav" style={{ marginBottom: '2rem' }}>
        <div className="nav-brand">
          <Link href="/"><span className="text-gradient fw-bold">NipeKazi</span></Link>
        </div>
        <div className="nav-links">
          <Link href="/login" className="btn btn-glass">Log In to Apply</Link>
        </div>
      </nav>

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Available <span className="text-gradient">Jobs & Gigs</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Browse all opportunities. To apply, you need to be signed in as a Freelancer.</p>

        {/* Job List Mockup */}
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
              <Link href="/login" className="btn btn-primary">Login to Apply</Link>
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
              <Link href="/login" className="btn btn-primary">Login to Apply</Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
