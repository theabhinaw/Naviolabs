import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

const env = import.meta.env ?? {};
const API_URL = String(env.VITE_API_URL || '').replace(/\/$/, '');

export default function IDCardPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/id-card/${id}`);
        const data = await res.json();
        if (data.success) {
          setEmployee(data.employee);
        } else {
          setError(data.message || 'Employee not found.');
        }
      } catch (err) {
        setError('Failed to load ID card data.');
      }
      setLoading(false);
    };
    fetchEmployee();
  }, [id]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `ID_Card_${employee?.name?.replace(/\s+/g, '_') || 'employee'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head><title>ID Card - ${employee?.name || 'Employee'}</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:flex-start; padding:10mm; background:#fff;">
          <img src="${imgData}" style="width:54mm; height:86mm;" />
          <script>setTimeout(()=>{window.print(); window.close();}, 500);<\/script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  if (loading) return (
    <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0f1c' }}>
      <p style={{ color: '#fff', fontSize: '1.2rem' }}>Loading ID Card...</p>
    </section>
  );

  if (error) return (
    <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0f1c' }}>
      <p style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>{error}</p>
    </section>
  );

  const empId = `NL${employee._id.substring(0, 6).toUpperCase()}`;

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0f1c', padding: '2rem', paddingTop: '120px' }}>
      
      <div ref={cardRef} className="id-card-preview">
        <div className="id-card-bg-shape"></div>
        <div className="id-card-content">
          <div className="id-card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2L21 5.9a2.12 2.12 0 0 0-3-3L4.5 16.5z"/></svg>
            <h2>Navio Labs</h2>
          </div>
          <div className="id-card-photo">
            {employee.photo ? (
              <img src={employee.photo} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              employee.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <h3 className="id-card-name">{employee.name}</h3>
          <p className="id-card-role">{employee.designation}</p>
          
          <div className="id-card-emp-id">ID: {empId}</div>
          
          <div className="id-card-footer">
            <div className="id-card-qr">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#000">
                <path d="M3 3h8v8H3zM5 5v4h4V5zM13 3h8v8h-8zM15 5v4h4V5zM3 13h8v8H3zM5 15v4h4v-4zM18 13h3v3h-3zM13 13h3v3h-3zM13 18h3v3h-3zM18 18h3v3h-3z"/>
              </svg>
            </div>
            <div className="id-card-details">
              EMP: {empId} <br/>
              Expires: DEC 2028 <br/>
              <span className="id-card-domain">naviolabs.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          ⬇ Download PNG
        </button>
        <button onClick={handlePrint} className="btn btn-ghost" style={{ padding: '0.8rem 2rem', border: '2px solid rgba(255,255,255,0.2)', color: '#fff' }}>
          🖨 Print ID Card
        </button>
      </div>
      
      <p style={{ color: '#8892b0', marginTop: '2rem', fontSize: '0.9rem' }}>
        Official Employee ID — Navio Labs Pvt. Ltd.
      </p>
    </section>
  );
}
