"use client";

import { useEffect, useState } from "react";
import DashboardNav from "../../../../components/DashboardNav";
import "../../../landing.css";
import { supabase } from "../../../../utils/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleBanUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Banned' ? 'Active' : 'Banned';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'Banned' ? 'BAN' : 'UNBAN'} this user?`)) return;
    
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } else {
      alert("Error updating user status. Ensure the SQL update was run.");
    }
  };

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/users" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage <span className="text-gradient">Users</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>View, manage, and ban registered users on the platform.</p>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Name & Phone</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Role</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Joined</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong>{user.full_name || 'N/A'}</strong><br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.phone_number || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        background: user.role === 'admin' ? 'rgba(255, 68, 68, 0.2)' : 
                                    user.role === 'employer' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(52, 152, 219, 0.2)',
                        color: user.role === 'admin' ? '#ff4444' : 
                               user.role === 'employer' ? '#25D366' : '#3498db'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        background: user.status === 'Banned' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(37, 211, 102, 0.2)',
                        color: user.status === 'Banned' ? '#ff4444' : '#25D366'
                      }}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleBanUser(user.id, user.status || 'Active')}
                          style={{
                            background: user.status === 'Banned' ? 'transparent' : 'rgba(255,68,68,0.1)',
                            border: user.status === 'Banned' ? '1px solid #25D366' : '1px solid #ff4444',
                            color: user.status === 'Banned' ? '#25D366' : '#ff4444',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}>
                          {user.status === 'Banned' ? 'Unban User' : 'Ban User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
