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

  return (
    <main className="main-container" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
      <DashboardNav activePath="/dashboard/admin/users" />

      <section className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage <span className="text-gradient">Users</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>View and manage all registered users on the platform.</p>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Phone Number</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Role</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{user.full_name || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{user.phone_number || 'N/A'}</td>
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
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
