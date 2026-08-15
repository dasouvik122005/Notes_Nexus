import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Notes Nexus';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FDFBF7',
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.15) 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          padding: '4rem 6rem',
        }}
      >
        {/* Left Content (Text) */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '55%' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F472B6',
              padding: '0.5rem 1rem',
              fontWeight: 800,
              fontSize: '24px',
              textTransform: 'uppercase',
              border: '4px solid #000000',
              boxShadow: '4px 4px 0px 0px #000000',
              marginBottom: '2rem',
              transform: 'rotate(-2deg)',
              alignSelf: 'flex-start'
            }}
          >
            JIS University CSE Dept.
          </div>
          
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#000000',
              margin: 0,
              letterSpacing: '-2px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span>WELCOME TO</span>
            <div style={{ display: 'flex', marginTop: '1rem' }}>
              <span
                style={{
                  backgroundColor: '#FDE047',
                  padding: '0 1rem',
                  display: 'flex',
                  border: '6px solid #000000',
                  boxShadow: '8px 8px 0px 0px #000000',
                  transform: 'rotate(1deg)'
                }}
              >
                NOTES NEXUS
              </span>
            </div>
          </h1>
        </div>

        {/* Right Content (Image) */}
        <div style={{ display: 'flex', width: '40%', justifyContent: 'flex-end' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              border: '6px solid #000000',
              boxShadow: '12px 12px 0px 0px #000000',
              transform: 'rotate(3deg)',
              width: '100%',
              padding: '2rem'
            }}
          >
            <img 
              src="https://notes-nexus-jisu.vercel.app/jis.png" 
              alt="JIS University" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                border: '4px solid #000000' 
              }} 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1.5rem', borderTop: '4px solid #000000', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: '#F472B6', borderRadius: '50%', border: '3px solid #000000', marginRight: '1rem' }}></div>
                <span style={{ fontWeight: 800, fontSize: '24px', color: '#000000' }}>LATEST UPLOADS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
