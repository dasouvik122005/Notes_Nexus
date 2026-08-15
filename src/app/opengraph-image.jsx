import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Notes Nexus';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Load the logo
  const logoData = await fetch(
    new URL('./og-logo.png', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDFBF7',
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.15) 2px, transparent 2px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            border: '8px solid #000000',
            boxShadow: '16px 16px 0px 0px #000000',
            padding: '4rem 6rem',
            borderRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <img src={logoData} alt="Notes Nexus Logo" style={{ width: '600px', height: 'auto', objectFit: 'contain' }} />
          </div>
          
          <p
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#000000',
              margin: 0,
              backgroundColor: '#F472B6',
              padding: '0.5rem 1.5rem',
              border: '4px solid #000000',
              boxShadow: '6px 6px 0px 0px #000000',
              transform: 'rotate(-2deg)'
            }}
          >
            JIS University CSE
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
