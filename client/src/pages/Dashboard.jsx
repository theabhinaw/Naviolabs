import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const env = import.meta.env ?? {};
const API_URL = String(env.VITE_API_URL || '').replace(/\/$/, '');

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminTab, setAdminTab] = useState('overview');
  
  const [programs, setPrograms] = useState([
    { id: 1, title: 'Company Testing Program v1', status: 'Active', enrolled: 12 },
    { id: 2, title: 'Beta UI Testing', status: 'Draft', enrolled: 0 }
  ]);
  const [showProgramModal, setShowProgramModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    
    if (user?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await res.json();
          if (data.success) {
            setUsers(data.users);
          }
        } catch (error) {
          console.error("Failed to fetch users", error);
        }
      };
      fetchUsers();
    }
  }, [user, loading, navigate]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!user) return null;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    if (!users || users.length === 0) return;
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Joined Date'];
    const rows = users.map(u => [
      `"${u.name}"`, 
      `"${u.email}"`, 
      `"${u.role}"`, 
      `"${new Date(u.createdAt).toLocaleDateString()}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `navio_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: 'var(--bg)' }}>
      <div className="wrap">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              {user.role === 'admin' ? 'Admin Control' : 'Dashboard'}
            </h1>
            <p style={{ color: 'var(--ink-2)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--ink)', fontWeight: '600' }}>{user.name}</span></p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ 
              padding: '0.5rem 1.2rem', 
              borderRadius: '999px', 
              background: user.role === 'admin' ? 'var(--coral)' : user.role === 'employee' ? 'var(--teal)' : 'var(--cobalt)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: user.role === 'admin' ? '0 4px 12px rgba(255, 107, 107, 0.3)' : 'none'
            }}>
              {user.role === 'admin' ? 'Super Admin' : user.role}
            </span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-ghost" style={{ padding: '0.5rem 1rem', minHeight: 'auto' }}>
              Log out
            </button>
          </div>
        </div>
        
        {/* Role-specific content */}
        <div>
          
          {user.role === 'admin' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              
              {/* Admin Tabs Navigation */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--rule)', paddingBottom: '1rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {['overview', 'users', 'programs', 'settings'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setAdminTab(tab)}
                    style={{
                      background: adminTab === tab ? 'var(--ink)' : 'transparent',
                      color: adminTab === tab ? 'var(--bg)' : 'var(--ink)',
                      border: 'none',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '999px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {adminTab === 'overview' && (
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form" style={{ borderTop: '4px solid var(--coral)', padding: '2rem', background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--ink-2)' }}>Total Users</h3>
                      <div style={{ background: 'var(--soft)', padding: '0.5rem', borderRadius: '8px' }}>👥</div>
                    </div>
                    <p style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1, marginTop: '1rem' }}>{users.length}</p>
                    <p style={{ color: 'var(--teal)', marginTop: '0.5rem', fontWeight: '600' }}>↑ +12% this week</p>
                  </div>
                  
                  <div className="form" style={{ borderTop: '4px solid var(--teal)', padding: '2rem', background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--ink-2)' }}>Pending Audits</h3>
                      <div style={{ background: 'var(--soft)', padding: '0.5rem', borderRadius: '8px' }}>📝</div>
                    </div>
                    <p style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1, marginTop: '1rem' }}>8</p>
                    <p style={{ color: 'var(--coral)', marginTop: '0.5rem', fontWeight: '600' }}>2 require immediate action</p>
                  </div>
                  
                  <div className="form" style={{ borderTop: '4px solid var(--amber)', padding: '2rem', background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--ink-2)' }}>System Health</h3>
                      <div style={{ background: 'var(--soft)', padding: '0.5rem', borderRadius: '8px' }}>⚡</div>
                    </div>
                    <p style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1, color: 'var(--teal)', marginTop: '1rem' }}>100%</p>
                    <p style={{ color: 'var(--ink-2)', marginTop: '0.5rem', fontWeight: '600' }}>Database & Auth operational</p>
                  </div>

                  <div className="form" style={{ gridColumn: '1 / -1', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" style={{ background: 'var(--ink)' }} onClick={downloadCSV}>Download CSV Report</button>
                      <button className="btn btn-ghost" style={{ border: '2px solid var(--rule-strong)' }}>Send Email Announcement</button>
                      <button className="btn btn-ghost" style={{ border: '2px solid var(--rule-strong)' }}>View Error Logs</button>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {adminTab === 'users' && (
                <div className="form" style={{ padding: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.8rem' }}>User Management</h3>
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '2px solid var(--rule-strong)', width: 'min(100%, 350px)' }}
                    />
                  </div>
                  
                  <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--rule)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: 'var(--soft)' }}>
                        <tr>
                          <th style={{ padding: '1.2rem', color: 'var(--ink)' }}>Name</th>
                          <th style={{ padding: '1.2rem', color: 'var(--ink)' }}>Email / Username</th>
                          <th style={{ padding: '1.2rem', color: 'var(--ink)' }}>Role</th>
                          <th style={{ padding: '1.2rem', color: 'var(--ink)' }}>Joined Date</th>
                          <th style={{ padding: '1.2rem', color: 'var(--ink)', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 && (
                          <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-2)' }}>No users found.</td></tr>
                        )}
                        {filteredUsers.map((u) => (
                          <tr key={u._id} style={{ borderBottom: '1px solid var(--rule)' }}>
                            <td style={{ padding: '1.2rem', fontWeight: '600' }}>{u.name}</td>
                            <td style={{ padding: '1.2rem', color: 'var(--ink-2)' }}>{u.email}</td>
                            <td style={{ padding: '1.2rem' }}>
                              <span style={{ 
                                padding: '0.3rem 0.8rem', 
                                background: u.role === 'admin' ? 'var(--coral)' : u.role === 'employee' ? 'var(--teal)' : 'var(--soft)', 
                                color: u.role === 'user' ? 'var(--ink)' : '#fff',
                                borderRadius: '8px', 
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                textTransform: 'capitalize'
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '1.2rem', color: 'var(--ink-2)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PROGRAMS TAB */}
              {adminTab === 'programs' && (
                <div className="form" style={{ padding: '2.5rem', borderTop: '4px solid var(--amber)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem' }}>Program Publisher</h3>
                      <p style={{ color: 'var(--ink-2)', marginTop: '0.5rem' }}>Create testing phases or features for your users.</p>
                    </div>
                    <button onClick={() => setShowProgramModal(!showProgramModal)} className="btn btn-primary" style={{ background: 'var(--amber)', color: '#fff', border: 'none' }}>
                      + Create New Program
                    </button>
                  </div>
                  
                  {showProgramModal && (
                    <div style={{ padding: '2rem', background: 'var(--soft)', borderRadius: '16px', marginBottom: '2rem', border: '2px solid var(--rule-strong)' }}>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>New Program Details</h4>
                      <input type="text" placeholder="Program Title (e.g. Beta Automation Tool)" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--rule)', marginBottom: '1rem' }} />
                      <textarea placeholder="Description for users..." rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--rule)', marginBottom: '1rem', fontFamily: 'inherit' }}></textarea>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => { setPrograms([{ id: Date.now(), title: 'New Beta Program', status: 'Active', enrolled: 0 }, ...programs]); setShowProgramModal(false); }}>Publish to Users</button>
                        <button className="btn btn-ghost" onClick={() => setShowProgramModal(false)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {programs.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '2px solid var(--rule-strong)', borderRadius: '12px', background: 'var(--surface)' }}>
                        <div>
                          <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.3rem' }}>{p.title}</strong>
                          <span style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>{p.enrolled} users enrolled</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ padding: '0.3rem 0.8rem', background: p.status === 'Active' ? 'var(--teal)' : 'var(--rule)', color: p.status === 'Active' ? '#fff' : 'var(--ink-2)', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.status}</span>
                          <button className="btn btn-ghost btn-sm">Manage</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {adminTab === 'settings' && (
                <div className="form" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>System Settings</h3>
                  <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem' }}>Google Sheets Webhook URL</label>
                      <input type="text" readOnly value="https://script.google.com/macros/s/.../exec" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--rule)', background: 'var(--soft)', color: 'var(--ink-2)' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', marginTop: '0.5rem' }}>Receives new user registrations and leads.</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem' }}>Admin Email Notifications</label>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" style={{ background: 'var(--teal)', border: 'none' }}>Enabled</button>
                        <button className="btn btn-ghost">Disable</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {user.role === 'employee' && (
            <div className="form" style={{ borderColor: 'var(--teal)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--teal)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h2 style={{ fontSize: '1.8rem' }}>Assigned Tasks</h2>
              </div>
              <p style={{ color: 'var(--ink-2)', fontSize: '1.1rem', marginBottom: '2rem' }}>You have 3 new tasks assigned to you today.</p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {['Follow up with new lead: Avinash', 'Test n8n workflow for Client X', 'Update documentation for Zapier integration'].map((task, i) => (
                  <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--rule-strong)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                    <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{task}</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 1rem' }}>Start</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user.role === 'user' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div className="form" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, var(--surface) 0%, var(--soft) 100%)' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>My Workspace</h2>
                <p style={{ color: 'var(--ink-2)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Welcome to your secure client portal. You can now enroll in company programs, track audits, and test new tools.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary">Contact Support</button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Available Programs & Projects</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--rule-strong)', borderRadius: '16px', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Initial Workflow Audit</span>
                    <span style={{ padding: '0.2rem 0.6rem', background: 'var(--amber)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>IN PROGRESS</span>
                  </div>
                  <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Our team is currently reviewing your submitted requirements and mapping out the architecture.</p>
                  <div style={{ width: '100%', height: '8px', background: 'var(--rule)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', background: 'var(--amber)' }}></div>
                  </div>
                </div>
                
                {/* Dynamically shown program published by admin */}
                <div style={{ padding: '1.5rem', border: '2px solid var(--teal)', borderRadius: '16px', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Company Testing Program v1</span>
                    <span style={{ padding: '0.2rem 0.6rem', background: 'var(--teal)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>NEW</span>
                  </div>
                  <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Published by Administrator. Click below to enroll and start testing this program.</p>
                  <button className="btn btn-primary" style={{ width: '100%', background: 'var(--teal)', color: '#fff', border: 'none' }} onClick={() => alert('Enrolled successfully! Redirecting to program testing area...')}>Enroll & Start Testing</button>
                </div>

                <div style={{ padding: '1.5rem', border: '1px dashed var(--rule-strong)', borderRadius: '16px', display: 'grid', placeItems: 'center', textAlign: 'center', minHeight: '180px', cursor: 'pointer' }} onClick={() => alert('Opening project request form...')}>
                  <div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--soft)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <p style={{ fontWeight: '600' }}>Request Custom Project</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
