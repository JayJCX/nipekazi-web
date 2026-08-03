export default function Modal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        borderTop: `4px solid ${isDanger ? '#ff4444' : 'var(--color-primary)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            onClick={onCancel} 
            className="btn btn-glass" 
            style={{ padding: '0.5rem 1rem' }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="btn btn-primary" 
            style={{ 
              padding: '0.5rem 1.5rem', 
              background: isDanger ? 'rgba(255, 68, 68, 0.2)' : 'var(--color-primary)',
              color: isDanger ? '#ff4444' : 'black',
              borderColor: isDanger ? 'rgba(255, 68, 68, 0.5)' : 'var(--color-primary)',
              fontWeight: 'bold'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
