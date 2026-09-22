export default function Loading() {
  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '150px', height: '30px', backgroundColor: '#E5E7EB' }} />
          <div style={{ width: '300px', height: '50px', backgroundColor: '#E5E7EB' }} />
          <div style={{ width: '100%', maxWidth: '600px', height: '80px', backgroundColor: '#F3F4F6' }} />
        </div>

        {/* Filter Bar Skeleton */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, height: '50px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
          <div style={{ width: '120px', height: '50px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
        </div>

        {/* Grid Skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="neo-card" style={{ height: '350px', backgroundColor: 'var(--white)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'pulse 2s infinite' }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#E5E7EB' }} />
              <div style={{ width: '40%', height: '24px', backgroundColor: '#F3F4F6' }} />
              <div style={{ width: '80%', height: '28px', backgroundColor: '#E5E7EB' }} />
              <div style={{ width: '60%', height: '20px', backgroundColor: '#E5E7EB' }} />
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
