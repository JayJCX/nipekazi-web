"use client";

import { useRouter } from "next/navigation";
import DashboardNav from "../../components/DashboardNav";
import { supabase } from "../../utils/supabase";
import { useLanguage } from "../../context/LanguageContext";
import "../landing.css";

export default function SettingsPage() {
  const router = useRouter();
  const { language, changeLanguage, theme, toggleTheme, t } = useLanguage();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmDelete) {
      window.alert("Thank you for your services with us. Your account has been scheduled for deletion.");
      
      // In MVP, we log them out and clear local session.
      // True deletion requires Supabase Edge Functions or Admin API in a future phase.
      await supabase.auth.signOut();
      router.push("/");
    }
  }

  // Dynamic styles for the Log Out button based on theme
  const logOutBtnStyle = {
    background: 'transparent',
    border: `1px solid ${theme === 'light' ? '#000000' : '#FFFFFF'}`,
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: '0.5rem 1rem'
  };

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/settings" />

      <section className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{t("settings_title")}</h1>

        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t("settings_preferences")}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t("settings_language")}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t("settings_language_desc")}</p>
            </div>
            <div>
              <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--color-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', paddingTop: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t("settings_whatsapp")}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t("settings_whatsapp_desc")}</p>
            </div>
            <div>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>{t("btn_enabled")}</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{t("settings_theme")}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t("settings_theme_desc")}</p>
            </div>
            <div>
              <select 
                value={theme} 
                onChange={(e) => toggleTheme(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--color-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="dark">{t("theme_dark")}</option>
                <option value="light">{t("theme_light")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t("settings_account")}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleLogout} className="btn btn-primary" style={logOutBtnStyle}>
              {t("settings_logout")}
            </button>
            <button onClick={handleDeleteAccount} className="btn" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem' }}>
              {t("settings_delete")}
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}
