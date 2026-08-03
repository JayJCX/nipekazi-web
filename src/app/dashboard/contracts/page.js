"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../../../components/DashboardNav";
import { supabase } from "../../../utils/supabase";
import "../../landing.css";

export default function ContractsPage() {
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);

        if (profileData) {
          if (profileData.role === 'employer') {
            const { data: employerContracts } = await supabase
              .from('contracts')
              .select('*, jobs(*), profiles!freelancer_id(full_name, phone_number)')
              .eq('employer_id', profileData.id);
            setContracts(employerContracts || []);
          } else {
            const { data: freelancerContracts } = await supabase
              .from('contracts')
              .select('*, jobs(*), profiles!employer_id(company_name, phone_number)')
              .eq('freelancer_id', profileData.id);
            setContracts(freelancerContracts || []);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <main className="main-container"><p style={{padding: '2rem'}}>Loading...</p></main>;
  if (!profile) return <main className="main-container"><p style={{padding: '2rem'}}>Please log in.</p></main>;

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/contracts" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Active <span className="text-gradient">Contracts</span></h1>
        
        {profile.role === 'employer' ? (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage talent you have hired and active projects.</p>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage jobs you are currently hired for and working on.</p>
        )}

        {contracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>You have no active contracts at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {contracts.map(contract => (
              <div key={contract.id} className="glass-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{contract.jobs?.title}</h2>
                    {profile.role === 'employer' ? (
                      <p style={{ color: 'var(--text-muted)' }}>Hired: {contract.profiles?.full_name}</p>
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>Employer: {contract.profiles?.company_name || 'Individual'}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>TZS {contract.agreed_amount}</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Agreed Amount</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {profile.role === 'employer' && (
                    <button className="btn btn-primary">Mark as Completed & Pay</button>
                  )}
                  <button className="btn btn-glass">Message on WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
