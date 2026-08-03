"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../../../components/DashboardNav";
import Modal from "../../../components/Modal";
import { supabase } from "../../../utils/supabase";
import "../../landing.css";

export default function ContractsPage() {
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);

        if (profileData) {
          if (profileData.role === 'employer') {
            const { data } = await supabase
              .from('contracts')
              .select('*, jobs(*), profiles!freelancer_id(full_name, phone_number)')
              .eq('employer_id', profileData.id)
              .order('created_at', { ascending: false });
            setContracts(data || []);
          } else {
            const { data } = await supabase
              .from('contracts')
              .select('*, jobs(*), profiles!employer_id(company_name, phone_number)')
              .eq('freelancer_id', profileData.id)
              .order('created_at', { ascending: false });
            setContracts(data || []);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  function handleTerminateClick(contractId, jobId) {
    setModalConfig({
      isOpen: true,
      title: "Terminate Contract",
      message: "Are you sure you want to terminate this contract? The freelancer will be fired and notified via WhatsApp.",
      isDanger: true,
      confirmText: "Terminate Contract",
      onConfirm: async () => {
        closeModal();
        
        // 1. Terminate Contract
        const { error: cError } = await supabase.from('contracts').update({ status: 'Terminated' }).eq('id', contractId);
        
        // 2. Open Job again (optional, but logical)
        const { error: jError } = await supabase.from('jobs').update({ status: 'Open' }).eq('id', jobId);
        
        if (!cError) {
          setContracts(contracts.map(c => c.id === contractId ? { ...c, status: 'Terminated' } : c));
        } else {
          setModalConfig({ isOpen: true, title: "Error", message: `Failed to terminate: ${cError.message}`, isDanger: true, onConfirm: closeModal });
        }
      }
    });
  }

  if (loading) return <main className="main-container"><p style={{padding: '2rem'}}>Loading...</p></main>;
  if (!profile) return <main className="main-container"><p style={{padding: '2rem'}}>Please log in.</p></main>;

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/contracts" />
      <Modal {...modalConfig} onCancel={closeModal} />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Active <span className="text-gradient">Contracts</span></h1>
        
        {profile.role === 'employer' ? (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your hired freelancers and active contracts.</p>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>View your active contracts and chat with employers.</p>
        )}

        {contracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>You have no contracts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {contracts.map(contract => (
              <div key={contract.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: contract.status === 'Active' ? '4px solid #25D366' : '4px solid #ff4444' }}>
                <div>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{contract.jobs?.title}</p>
                  
                  {profile.role === 'employer' ? (
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Freelancer: {contract.profiles?.full_name}</h3>
                  ) : (
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Employer: {contract.profiles?.company_name}</h3>
                  )}
                  
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Agreed Budget: TZS {contract.agreed_amount}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: contract.status === 'Active' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255, 68, 68, 0.1)', color: contract.status === 'Active' ? '#25D366' : '#ff4444', borderRadius: '8px', fontWeight: 'bold' }}>
                    {contract.status}
                  </span>
                  
                  {contract.status === 'Active' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`https://wa.me/${contract.profiles?.phone_number}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#25D366', color: 'black' }}>WhatsApp</a>
                      {profile.role === 'employer' && (
                        <button onClick={() => handleTerminateClick(contract.id, contract.job_id)} className="btn btn-glass" style={{ padding: '0.5rem 1rem', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)' }}>Terminate</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </section>
    </main>
  );
}
