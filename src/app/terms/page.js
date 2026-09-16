export const metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Notes Nexus',
};

export default function TermsOfUse() {
  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>Terms of Use</h1>
      <div style={{ fontSize: '1.1rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>
          Welcome to Notes Nexus. By accessing or using our website, you agree to be bound by these terms.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Acceptance of Terms</h2>
        <p>
          Notes Nexus is provided &quot;as is&quot; for educational purposes. We make no warranties about the completeness, reliability, and accuracy of the study materials hosted or linked on this site.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>User Conduct</h2>
        <p>
          You agree to use the site only for lawful purposes. You are strictly prohibited from attempting to interfere with the proper working of the site, including attempting to circumvent security protocols, or scraping content for commercial use.
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem' }}>Content Ownership and DMCA</h2>
        <p>
          All notes and study materials are peer-shared resources. If you believe your copyrighted work has been uploaded without authorization, please contact us via the Feedback form for immediate removal.
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
