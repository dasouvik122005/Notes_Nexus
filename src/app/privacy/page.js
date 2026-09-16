export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Notes Nexus',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>Privacy Policy</h1>
      <div style={{ fontSize: '1.1rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          At Notes Nexus, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Information Collection</h2>
        <p>
          We do not collect any personally identifiable information unless you voluntarily submit it to us through feedback forms or contributions. We use standard analytics (like Vercel Analytics) to track general, anonymized site usage to improve our services.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Data Usage</h2>
        <p>
          Any information collected is used solely for improving the platform, fixing bugs, and providing better study materials for students. We do not sell or share your data with third parties.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites (e.g., Google Drive links for notes). We are not responsible for the privacy practices or content of these external sites.
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
