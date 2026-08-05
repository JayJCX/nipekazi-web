import Link from "next/link";
import "./landing.css";

export default function Home() {
  return (
    <main className="main-container">
      {/* Navigation */}
      <nav className="glass-nav">
        <div className="nav-brand">
          <span className="text-gradient fw-bold" style={{ fontSize: '1.8rem' }}>NipeKazi</span>
        </div>
        <div className="nav-links">
          <a href="#about" className="nav-link hide-mobile">About Us</a>
          <a href="#how-it-works" className="nav-link hide-mobile">How it Works</a>
          <a href="#benefits" className="nav-link hide-mobile">Why Us</a>
          <div className="nav-auth">
            <Link href="/login" className="btn btn-glass" style={{ marginRight: '1rem' }}>Log In</Link>
            <Link href="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="hero-content">
          <div className="badge" style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(37, 211, 102, 0.1)', color: 'var(--color-primary)', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            🚀 Tanzania's #1 Freelance Platform
          </div>
          <h1 className="hero-title">
            Find Premium <span className="text-gradient">Gigs & Talent</span> <br/> 
            Directly on WhatsApp.
          </h1>
          <p className="hero-subtitle delay-100 animate-fade-in">
            Connect instantly, get notified seamlessly, and land long-term professional roles or quick side gigs without ever leaving your favorite chat app.
          </p>
          <div className="hero-actions delay-200 animate-fade-in">
            <Link href="/signup" className="btn btn-primary btn-lg">Start Working Now</Link>
            <Link href="/signup" className="btn btn-glass btn-lg">Hire Top Talent</Link>
          </div>
        </div>
        
        {/* WhatsApp Preview Card (Glassmorphism) */}
        <div className="hero-visual delay-300 animate-fade-in">
          <div className="glass-card whatsapp-preview">
            <div className="wa-header">
              <div className="wa-avatar">NK</div>
              <div>
                <h3 className="wa-name">NipeKazi Bot</h3>
                <span className="wa-status">Online</span>
              </div>
            </div>
            <div className="wa-body">
              <div className="wa-message" style={{ marginBottom: '1rem', alignSelf: 'flex-start', background: '#202C33' }}>
                Hey there! Looking for work?
              </div>
              <div className="wa-message wa-message-out" style={{ alignSelf: 'flex-end', background: '#005C4B' }}>
                Yes, looking for a Web Dev gig!
              </div>
              <div className="wa-message mt-2" style={{ alignSelf: 'flex-start', background: '#202C33', marginTop: '1rem' }}>
                <strong>New Job Alert 🚨</strong><br/><br/>
                Frontend Developer needed in Dar es Salaam.<br/>
                Budget: TZS 1,000,000<br/>
                <br/>
                <button className="wa-btn">Apply Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section delay-300 animate-fade-in">
        <div className="about-grid">
          <div>
            <h2 className="section-title">Bridging the Gap in <span className="text-gradient">Tanzania</span></h2>
            <p className="section-desc">
              NipeKazi was born out of a simple idea: finding work or hiring talent shouldn't be complicated. Traditional job boards are cluttered and often ignore the fast-paced nature of the modern gig economy.
            </p>
            <p className="section-desc">
              We bring the opportunities directly to where everyone in Tanzania already spends their time: WhatsApp. Whether you are an employer looking for a reliable graphic designer, or a freelancer looking to earn extra income, NipeKazi makes the connection instant, secure, and seamless.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-box glass-card">
              <h3 className="text-gradient">100%</h3>
              <p>Remote Ready</p>
            </div>
            <div className="stat-box glass-card">
              <h3 className="text-gradient">24/7</h3>
              <p>WhatsApp Alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works delay-300 animate-fade-in">
        <h2 className="section-title text-center" style={{ marginBottom: '3rem' }}>How <span className="text-gradient">NipeKazi</span> Works</h2>
        
        <div className="works-grid">
          {/* Freelancer Journey */}
          <div className="glass-card works-column">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>For Freelancers 🧑‍💻</h3>
            <ul className="step-list">
              <li>
                <div className="step-number">1</div>
                <div>
                  <h4>Create your Profile</h4>
                  <p>Sign up, list your skills, and set your location.</p>
                </div>
              </li>
              <li>
                <div className="step-number">2</div>
                <div>
                  <h4>Get WhatsApp Alerts</h4>
                  <p>Our bot sends you jobs matching your profile instantly.</p>
                </div>
              </li>
              <li>
                <div className="step-number">3</div>
                <div>
                  <h4>Apply & Get Hired</h4>
                  <p>Click apply, chat with the employer, and start earning.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Employer Journey */}
          <div className="glass-card works-column">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>For Employers 🏢</h3>
            <ul className="step-list">
              <li>
                <div className="step-number">1</div>
                <div>
                  <h4>Post a Job</h4>
                  <p>Describe your needs, budget, and timeline in seconds.</p>
                </div>
              </li>
              <li>
                <div className="step-number">2</div>
                <div>
                  <h4>Review Applications</h4>
                  <p>Manage talent proposals directly from your dashboard.</p>
                </div>
              </li>
              <li>
                <div className="step-number">3</div>
                <div>
                  <h4>Hire & Track</h4>
                  <p>Hire the best fit and track project progress effortlessly.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits / Why Us */}
      <section id="benefits" className="features delay-300 animate-fade-in">
        <h2 className="section-title text-center" style={{ marginBottom: '3rem', width: '100%' }}>Why Choose <span className="text-gradient">Us?</span></h2>
        
        <div className="glass-card feature-card">
          <div className="feature-icon">📱</div>
          <h3>Zero Friction</h3>
          <p>No heavy apps to download. Everything from alerts to applying happens directly via WhatsApp and our fast web app.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">💼</div>
          <h3>All Job Types</h3>
          <p>Whether you need a full-time software engineer or a one-off logo design, we handle professional and side gigs.</p>
        </div>
        <div className="glass-card feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure & Verified</h3>
          <p>We verify phone numbers and maintain robust profiles to ensure a safe, scam-free environment for everyone.</p>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-section animate-fade-in">
        <div className="glass-card text-center" style={{ padding: '5rem 2rem', background: 'linear-gradient(145deg, rgba(37,211,102,0.1) 0%, rgba(0,0,0,0.5) 100%)', border: '1px solid rgba(37,211,102,0.2)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '800' }}>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Join thousands of Tanzanians connecting, working, and earning through NipeKazi today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn btn-primary btn-lg">Join as Freelancer</Link>
            <Link href="/signup" className="btn btn-glass btn-lg">Post a Job for Free</Link>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <p>&copy; {new Date().getFullYear()} NipeKazi Tanzania. All rights reserved.</p>
      </footer>
    </main>
  );
}
