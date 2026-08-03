"use client";

import { useState, useEffect } from "react";
import DashboardNav from "../../../components/DashboardNav";
import Modal from "../../../components/Modal";
import { supabase } from "../../../utils/supabase";
import "../../landing.css";

export default function DashboardJobsPage() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Employer State
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit State
  const [editingJob, setEditingJob] = useState(null);

  // Freelancer State
  const [appliedJobs, setAppliedJobs] = useState(new Map());
  
  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  useEffect(() => {
    async function loadData() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setErrorMsg("Session Error: " + sessionError.message);
        setLoading(false);
        return;
      }
      if (session) {
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (profileError) {
          setErrorMsg("Profile Fetch Error: " + profileError.message);
          setLoading(false);
          return;
        }
        if (!profileData) {
          setErrorMsg("Account exists but profile data is missing. Please sign up again with a new phone number.");
          setLoading(false);
          return;
        }
        setProfile(profileData);

        if (profileData.role === 'employer') {
          fetchEmployerJobs(profileData.id);
        } else {
          fetchAllJobs();
          fetchAppliedJobs(profileData.id);
        }
      } else {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function fetchEmployerJobs(employerId) {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }

  async function fetchAllJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*, profiles!employer_id(full_name, company_name, phone_number)')
      .eq('status', 'Open')
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }

  async function fetchAppliedJobs(freelancerId) {
    const { data } = await supabase
      .from('applications')
      .select('job_id, status')
      .eq('freelancer_id', freelancerId);
    if (data) {
      const appMap = new Map();
      data.forEach(a => appMap.set(a.job_id, a.status));
      setAppliedJobs(appMap);
    }
  }

  async function handlePostJob(e) {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target);
    const jobData = {
      employer_id: profile.id,
      title: formData.get("title"),
      job_type: formData.get("type"),
      location: formData.get("location"),
      validity_period: formData.get("validity"),
      budget: formData.get("budget"),
      description: formData.get("description"),
      status: 'Open'
    };

    if (editingJob) {
      const { error } = await supabase.from('jobs').update(jobData).eq('id', editingJob.id);
      if (!error) {
        alert("Job updated successfully!");
        setEditingJob(null);
        fetchEmployerJobs(profile.id);
      } else {
        alert("Failed to update job: " + error.message);
      }
    } else {
      const { data, error } = await supabase.from('jobs').insert([jobData]).select();
      if (!error && data) {
        setJobs([data[0], ...jobs]);
        setShowAddForm(false);
        alert("Job posted successfully! (WhatsApp integration pending)");
      } else {
        alert("Failed to post job: " + error?.message);
      }
    }
    setSubmitting(false);
  }

  async function handleDeleteJob(jobId) {
    setModalConfig({
      isOpen: true,
      title: "Delete Job",
      message: "Are you sure you want to delete this job? This action cannot be undone.",
      isDanger: true,
      confirmText: "Delete",
      onConfirm: async () => {
        closeModal();
        const { error } = await supabase.from('jobs').delete().eq('id', jobId);
        if (!error) {
          setJobs(jobs.filter(j => j.id !== jobId));
        } else {
          alert("Failed to delete job: " + error.message);
        }
      }
    });
  }

  async function handleApply(jobId) {
    // Check if an application already exists
    const { data: existingApp } = await supabase.from('applications')
      .select('id, status')
      .eq('job_id', jobId)
      .eq('freelancer_id', profile.id)
      .maybeSingle();

    if (existingApp) {
      if (existingApp.status === 'Canceled') {
        const { error } = await supabase.from('applications')
          .update({ status: 'Pending' })
          .eq('id', existingApp.id);
        if (!error) {
          const newMap = new Map(appliedJobs);
          newMap.set(jobId, 'Pending');
          setAppliedJobs(newMap);
        } else {
          alert("Error re-applying: " + error.message);
        }
      } else {
        alert("You have already applied.");
      }
    } else {
      const { error } = await supabase.from('applications').insert([
        { job_id: jobId, freelancer_id: profile.id }
      ]);
      if (!error) {
        const newMap = new Map(appliedJobs);
        newMap.set(jobId, 'Pending');
        setAppliedJobs(newMap);
      } else {
        alert("You have already applied or there was an error.");
      }
    }
  }

  async function handleCancelApplication(jobId) {
    setModalConfig({
      isOpen: true,
      title: "Cancel Application",
      message: "Are you sure you want to withdraw your application? Employers will see this as Canceled.",
      isDanger: true,
      confirmText: "Withdraw",
      onConfirm: async () => {
        closeModal();
        const { error } = await supabase.from('applications')
          .update({ status: 'Canceled' })
          .eq('job_id', jobId)
          .eq('freelancer_id', profile.id);
          
        if (!error) {
          const newMap = new Map(appliedJobs);
          newMap.set(jobId, 'Canceled');
          setAppliedJobs(newMap);
        } else {
          alert("Failed to cancel application: " + error.message);
        }
      }
    });
  }

  if (loading) return <main className="main-container"><p style={{padding: '2rem'}}>Loading...</p></main>;
  if (errorMsg) return <main className="main-container"><p style={{padding: '2rem', color: 'red'}}>{errorMsg}</p></main>;
  if (!profile) return <main className="main-container"><p style={{padding: '2rem'}}>Please log in.</p></main>;

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/jobs" />
      <Modal {...modalConfig} onCancel={closeModal} />

      <section className="animate-fade-in">
        
        {/* --- EMPLOYER VIEW --- */}
        {profile.role === 'employer' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem' }}>My Posted <span className="text-gradient">Jobs</span></h1>
              {(!showAddForm && !editingJob) && (
                <button onClick={() => setShowAddForm(true)} className="btn btn-primary">+ Add Job</button>
              )}
            </div>

            {(showAddForm || editingJob) ? (
              <div className="glass-card" style={{ maxWidth: '800px', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2>{editingJob ? "Edit Job Post" : "Create a New Job Post"}</h2>
                  <button onClick={() => {setShowAddForm(false); setEditingJob(null);}} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                </div>
                
                <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Job Title</label>
                    <input name="title" type="text" defaultValue={editingJob?.title} placeholder="e.g. Graphic Designer" style={inputStyle} required />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label>Job Type</label>
                      <select name="type" defaultValue={editingJob?.job_type} style={{...inputStyle, background: '#111827'}} required>
                        <option value="Professional">Professional (Long-term)</option>
                        <option value="Side Gig">Side Gig (One-time)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label>Budget (TZS)</label>
                      <input name="budget" type="number" defaultValue={editingJob?.budget} placeholder="e.g. 100000" style={inputStyle} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label>Location</label>
                      <input name="location" type="text" defaultValue={editingJob?.location} placeholder="e.g. Dar es Salaam or Remote" style={inputStyle} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label>Validity Window</label>
                      <select name="validity" defaultValue={editingJob?.validity_period} style={{...inputStyle, background: '#111827'}} required>
                        <option value="3 Days">3 Days</option>
                        <option value="7 Days">7 Days</option>
                        <option value="14 Days">14 Days</option>
                        <option value="30 Days">30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Job Description & Requirements</label>
                    <textarea name="description" rows="5" defaultValue={editingJob?.description} placeholder="Details about the job..." style={inputStyle} required></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Saving..." : (editingJob ? "Update Job" : "Post Job")}
                  </button>
                </form>
              </div>
            ) : (
              jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't posted any jobs yet.</p>
                  <button onClick={() => setShowAddForm(true)} className="btn btn-primary">Add Job</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {jobs.map(job => (
                    <div key={job.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{job.job_type} • {job.location} • Valid: {job.validity_period}</p>
                        <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginTop: '0.25rem' }}>TZS {job.budget}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setEditingJob(job)} className="btn btn-glass" style={{ padding: '0.5rem 1rem' }}>Edit</button>
                        <button onClick={() => handleDeleteJob(job.id)} className="btn btn-glass" style={{ padding: '0.5rem 1rem', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* --- FREELANCER VIEW --- */}
        {profile.role === 'freelancer' && (
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Find <span className="text-gradient">Work</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Browse and apply to open jobs.</p>

            {jobs.length === 0 ? (
              <p>No jobs available right now.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map(job => (
                  <div key={job.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        <strong>Employer:</strong> {job.profiles?.company_name || job.profiles?.full_name} • 📞 {job.profiles?.phone_number}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {job.job_type} • {job.location} • Valid: {job.validity_period}
                      </p>
                      <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginTop: '0.5rem' }}>TZS {job.budget}</p>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{job.description}</p>
                    </div>
                    
                    {(() => {
                      const appStatus = appliedJobs.get(job.id);
                      if (appStatus === 'Pending' || appStatus === 'Hired') {
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ background: 'rgba(37, 211, 102, 0.1)', color: 'var(--color-primary)', cursor: 'default' }}>
                              ✓ {appStatus === 'Hired' ? 'Hired' : 'Applied'}
                            </button>
                            {appStatus === 'Pending' && (
                              <button onClick={() => handleCancelApplication(job.id)} className="btn btn-glass" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)' }}>
                                Cancel Application
                              </button>
                            )}
                          </div>
                        );
                      } else if (appStatus === 'Rejected') {
                        return (
                          <div>
                            <button className="btn btn-primary" style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', cursor: 'default', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                              ❌ Rejected
                            </button>
                          </div>
                        );
                      } else {
                        // Not applied OR Canceled
                        return (
                          <div>
                            <button onClick={() => handleApply(job.id)} className="btn btn-primary">
                              {appStatus === 'Canceled' ? 'Re-Apply Now' : 'Apply Now'}
                            </button>
                          </div>
                        );
                      }
                    })()}
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
