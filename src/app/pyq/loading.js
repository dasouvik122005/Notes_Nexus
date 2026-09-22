export default function Loading() {
  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Page Header Skeleton */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#E5E7EB',
              width: '220px',
              height: '32px',
              border: '2px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              marginBottom: '1rem',
            }}
          />

          <div
            style={{
              width: '420px',
              height: '60px',
              backgroundColor: '#E5E7EB',
              margin: '0 auto 1rem auto',
            }}
          />

          <div
            style={{
              width: '580px',
              height: '40px',
              backgroundColor: '#F3F4F6',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Departments Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="neo-card"
              style={{
                height: '220px',
                backgroundColor: 'var(--white)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <div style={{ width: '48px', height: '48px', backgroundColor: '#E5E7EB', border: '2px solid var(--black)', marginBottom: '1.25rem' }} />
              <div style={{ width: '75%', height: '24px', backgroundColor: '#E5E7EB', marginBottom: '0.75rem' }} />
              <div style={{ width: '65%', height: '16px', backgroundColor: '#F3F4F6', marginBottom: 'auto' }} />
              <div style={{ width: '110px', height: '20px', backgroundColor: '#E5E7EB', marginTop: '1.5rem' }} />
            </div>
          ))}
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}} />
    </div>
  );
}
