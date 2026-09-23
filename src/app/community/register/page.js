'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { departments } from '@/config/departments';
import NeoButton from '@/components/NeoButton';
import {
  Upload,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
} from 'lucide-react';

export default function CommunityRegisterPage() {
  const router = useRouter();
  const { user, profile, isLoading, openAuthModal } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    department_id: 'all',
    
    // Official Links
    website: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    github: '',
    twitter: '',
    other_official: '',
    
    // Join Links
    whatsapp: '',
    discord: '',
    telegram: '',
    google_group: '',
    registration_form: '',
    other_join: '',
    
    // Community Info
    target_audience: '',
    community_type: 'College', // College / Department / Independent / Organization
    focus_areas: '',
    major_activities: '',
    events_workshops: '',
    member_benefits: '',
    membership_fee: 'Free',
    
    // Leadership & Verification
    leadership_team: [{ name: '', role: '', email: '', phone: '' }],
    faculty_coordinator: '',
    verification_proof: '',
    representative_linkedin: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // File Upload State
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setSubmitError('Logo image must be less than 2MB.');
        return;
      }
      setLogoFile(file);
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Manual Validation
    if (!logoFile) {
      setSubmitError('Please upload a community logo.');
      return;
    }
    if (!authorized || !agreedToTerms) {
      setSubmitError('You must agree to the declarations and terms to submit.');
      return;
    }

    const hasJoinLink = !!(formData.whatsapp || formData.discord || formData.telegram || formData.google_group || formData.registration_form || formData.other_join);
    if (!hasJoinLink) {
      setSubmitError('You must provide at least one valid Join Link (e.g., WhatsApp, Discord, or Registration Form).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Logo to Cloudinary
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'notes-nexus/communities/logos' }),
      });

      if (!signRes.ok) {
        const errData = await signRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get image upload credentials.');
      }
      const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json();

      const cloudFormData = new FormData();
      cloudFormData.append('file', logoFile);
      cloudFormData.append('api_key', apiKey);
      cloudFormData.append('timestamp', timestamp);
      cloudFormData.append('signature', signature);
      cloudFormData.append('folder', folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );

      if (!cloudRes.ok) throw new Error('Logo upload failed.');
      const cloudData = await cloudRes.json();
      const logo_url = cloudData.secure_url;

      // 2. Format Payload
      const payload = {
        name: formData.name,
        logo_url,
        description: formData.description,
        category: formData.category,
        department_id: formData.department_id,
        official_links: {
          website: formData.website,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          facebook: formData.facebook,
          github: formData.github,
          twitter: formData.twitter,
          other: formData.other_official,
        },
        join_links: {
          whatsapp: formData.whatsapp,
          discord: formData.discord,
          telegram: formData.telegram,
          google_group: formData.google_group,
          registration_form: formData.registration_form,
          other: formData.other_join,
        },
        target_audience: formData.target_audience,
        community_type: formData.community_type,
        focus_areas: formData.focus_areas,
        major_activities: formData.major_activities,
        events_workshops: formData.events_workshops,
        member_benefits: formData.member_benefits,
        membership_fee: formData.membership_fee,
        leadership_team: formData.leadership_team,
        faculty_coordinator: formData.faculty_coordinator,
        verification_proof: formData.verification_proof,
        representative_linkedin: formData.representative_linkedin,
      };

      // 3. Submit to API
      const res = await fetch('/api/community/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit community.');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return <div style={{ padding: '6rem 0', textAlign: 'center' }}><p style={{ fontWeight: 800 }}>Checking auth status...</p></div>;
  }

  // Unauthenticated Visitor
  if (!user) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div className="neo-card" style={{ padding: '3rem 2rem', backgroundColor: 'var(--white)' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-yellow)', border: '3px solid var(--black)', boxShadow: '4px 4px 0px 0px var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Admin Access Required</h1>
            <p style={{ color: '#4B5563', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              To register an official community on Notes Nexus, you must sign in with your Google account. This helps us verify the authenticity of the submission.
            </p>
            <NeoButton onClick={() => openAuthModal('Sign in to register your community.')} variant="primary" style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }}>
              SIGN IN WITH GOOGLE
            </NeoButton>
          </div>
        </div>
      </div>
    );
  }

  // Blocked User
  if (profile?.account_status === 'blocked') {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}><div className="container"><p>Your account is blocked.</p></div></div>
    );
  }

  // Success Screen
  if (submitted) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div className="neo-card" style={{ padding: '3rem 2rem', backgroundColor: '#F0FDF4' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#22C55E', color: 'var(--white)', border: '3px solid var(--black)', boxShadow: '4px 4px 0px 0px var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <div style={{ display: 'inline-block', backgroundColor: '#DCFCE7', color: '#15803D', border: '2px solid var(--black)', boxShadow: '2px 2px 0px 0px var(--black)', fontWeight: 900, fontSize: '0.8rem', padding: '0.25rem 0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
              SUBMISSION UNDER REVIEW
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Application Submitted!</h1>
            <p style={{ color: '#374151', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              Thank you for registering your community on Notes Nexus. Our moderation team will review your application to verify its authenticity. Once approved, your community profile will be live!
            </p>
            <Link href="/community">
              <NeoButton variant="primary" style={{ padding: '0.75rem 1.5rem' }}>
                RETURN TO DIRECTORY
              </NeoButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 7rem 0', backgroundColor: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Header Banner */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-yellow)', border: '2px solid var(--black)', boxShadow: '2px 2px 0px 0px var(--black)', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.6rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Building2 size={14} /> Community Registration
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Register Your Community
          </h1>
          <p style={{ color: '#4B5563', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>
            Create an official profile for your student club, technical society, or department group. Fill out this comprehensive form to get listed on Notes Nexus. All submissions are verified by moderators.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Details */}
          <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>1</span> Basic Details
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Community Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Tech Wizards Society" style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', boxShadow: '3px 3px 0px 0px var(--black)', fontWeight: 700, outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Community Logo * (Image File &lt; 2MB)</label>
                <input required type="file" accept="image/*" onChange={handleLogoChange} style={{ width: '100%', padding: '0.5rem', border: '3px solid var(--black)', fontWeight: 700, backgroundColor: '#F3F4F6' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Full About / Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Explain what your community does, its mission, and history..." rows={5} style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', boxShadow: '3px 3px 0px 0px var(--black)', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Category *</label>
                  <input required type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Coding, Cultural, Sports" style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', boxShadow: '3px 3px 0px 0px var(--black)', fontWeight: 700, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Department *</label>
                  <select name="department_id" value={formData.department_id} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', boxShadow: '3px 3px 0px 0px var(--black)', fontWeight: 700, outline: 'none', backgroundColor: 'var(--white)' }}>
                    <option value="all">Open to All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.shortCode})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Official Presence */}
          <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>2</span> Official Presence (Optional)
            </h2>
            <p style={{ color: '#6B7280', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Links to your official pages where people can learn more about you.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {['website', 'linkedin', 'instagram', 'facebook', 'github', 'twitter'].map((platform) => (
                <div key={platform}>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Official {platform}</label>
                  <input type="url" name={platform} value={formData[platform]} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Other Official Page</label>
                <input type="url" name="other_official" value={formData.other_official} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Section 3: Join Links */}
          <div className="neo-card" style={{ backgroundColor: '#FEF9C3', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>3</span> Join the Community *
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--white)', border: '2px solid var(--black)', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#92400E' }}>You must provide at least one valid link where students can actively join or register for your community.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {['whatsapp', 'discord', 'telegram'].map((platform) => (
                <div key={platform}>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{platform} Group Link</label>
                  <input type="url" name={platform} value={formData[platform]} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', backgroundColor: 'var(--white)' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Google Group / Mailing List</label>
                <input type="url" name="google_group" value={formData.google_group} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', backgroundColor: 'var(--white)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Registration / Join Form</label>
                <input type="url" name="registration_form" value={formData.registration_form} onChange={handleChange} placeholder="https://forms.gle/..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', backgroundColor: 'var(--white)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Other Joining Link</label>
                <input type="url" name="other_join" value={formData.other_join} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', backgroundColor: 'var(--white)' }} />
              </div>
            </div>
          </div>

          {/* Section 4: Community Information */}
          <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>4</span> Community Information
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Who can join? *</label>
                  <input required type="text" name="target_audience" value={formData.target_audience} onChange={handleChange} placeholder="e.g. Any 1st Year student, CSE Dept only..." style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', fontWeight: 700, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Community Type *</label>
                  <select name="community_type" value={formData.community_type} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', fontWeight: 700, outline: 'none', backgroundColor: 'var(--white)' }}>
                    <option value="College">College Level</option>
                    <option value="Department">Department Level</option>
                    <option value="Independent">Independent Student Group</option>
                    <option value="Organization">External Organization Chapter</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Areas of Focus * (Comma separated)</label>
                <input required type="text" name="focus_areas" value={formData.focus_areas} onChange={handleChange} placeholder="e.g. Web Development, AI, UI/UX" style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', fontWeight: 700, outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Major Activities</label>
                  <textarea name="major_activities" value={formData.major_activities} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Events / Workshops</label>
                  <textarea name="events_workshops" value={formData.events_workshops} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Member Benefits</label>
                  <textarea name="member_benefits" value={formData.member_benefits} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none', resize: 'vertical' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Membership Fee</label>
                <input type="text" name="membership_fee" value={formData.membership_fee} onChange={handleChange} placeholder="e.g. Free, ₹500/year" style={{ width: '100%', maxWidth: '300px', padding: '0.75rem', border: '3px solid var(--black)', fontWeight: 700, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Section 5: Leadership */}
          <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>5</span> Community Leadership
              </span>
              <NeoButton
                type="button"
                variant="secondary"
                onClick={() => setFormData(prev => ({ ...prev, leadership_team: [...prev.leadership_team, { name: '', role: '', email: '', phone: '' }] }))}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} style={{ marginRight: '0.25rem' }} /> ADD LEAD
              </NeoButton>
            </h2>

            {formData.leadership_team.map((lead, index) => (
              <div key={index} style={{ border: '2px solid var(--black)', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', backgroundColor: '#F9FAFB' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '1rem', backgroundColor: 'var(--primary-yellow)', border: '2px solid var(--black)', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Lead {index + 1}
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newLeads = [...formData.leadership_team];
                      newLeads.splice(index, 1);
                      setFormData(prev => ({ ...prev, leadership_team: newLeads }));
                    }}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem' }}
                  >
                    REMOVE
                  </button>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Name *</label>
                    <input required type="text" value={lead.name} onChange={(e) => {
                      const newLeads = [...formData.leadership_team];
                      newLeads[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, leadership_team: newLeads }));
                    }} style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 700, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Role *</label>
                    <input required type="text" value={lead.role} onChange={(e) => {
                      const newLeads = [...formData.leadership_team];
                      newLeads[index].role = e.target.value;
                      setFormData(prev => ({ ...prev, leadership_team: newLeads }));
                    }} placeholder="e.g. President, Founder" style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 700, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Official Email *</label>
                    <input required type="email" value={lead.email} onChange={(e) => {
                      const newLeads = [...formData.leadership_team];
                      newLeads[index].email = e.target.value;
                      setFormData(prev => ({ ...prev, leadership_team: newLeads }));
                    }} style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 700, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Contact Number (optional)</label>
                    <input type="text" value={lead.phone} onChange={(e) => {
                      const newLeads = [...formData.leadership_team];
                      newLeads[index].phone = e.target.value;
                      setFormData(prev => ({ ...prev, leadership_team: newLeads }));
                    }} style={{ width: '100%', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none' }} />
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Faculty Coordinator (optional)</label>
              <input type="text" name="faculty_coordinator" value={formData.faculty_coordinator} onChange={handleChange} style={{ width: '100%', maxWidth: '400px', padding: '0.6rem 0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none' }} />
            </div>
          </div>

          {/* Section 6: Verification */}
          <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem 2rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, borderBottom: '3px solid var(--black)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--black)', color: 'var(--white)', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '50%' }}>6</span> Verification & Terms
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Proof of official community page / Identity *</label>
                <input required type="url" name="verification_proof" value={formData.verification_proof} onChange={handleChange} placeholder="Link to official page, faculty consent, or ID proof..." style={{ width: '100%', padding: '0.75rem', border: '3px solid var(--black)', boxShadow: '3px 3px 0px 0px var(--black)', fontWeight: 700, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Representative's LinkedIn/Profile (optional)</label>
                <input type="url" name="representative_linkedin" value={formData.representative_linkedin} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--black)', fontWeight: 600, outline: 'none' }} />
              </div>
            </div>

            <div style={{ backgroundColor: '#F3F4F6', border: '2px dashed var(--black)', padding: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', marginBottom: '1rem' }}>
                <input required type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} style={{ width: '20px', height: '20px', marginTop: '4px', cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, color: '#374151', lineHeight: 1.5 }}>
                  Declaration: "I confirm that the information provided is accurate, and I am authorized to submit this community listing on behalf of the group." *
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
                <input required type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ width: '20px', height: '20px', marginTop: '4px', cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, color: '#374151', lineHeight: 1.5 }}>
                  Agreement: I agree to the Notes Nexus listing terms. I understand that fraudulent submissions will result in my account being blocked. *
                </span>
              </label>
            </div>
          </div>

          {/* Submit Errors */}
          {submitError && (
            <div style={{ backgroundColor: '#FEE2E2', border: '2px solid #DC2626', padding: '1rem', marginBottom: '1.5rem', fontWeight: 800, color: '#B91C1C', display: 'flex', gap: '0.75rem' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <div>{submitError}</div>
            </div>
          )}

          {/* Submit Button */}
          <NeoButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', justifyContent: 'center' }}
          >
            {isSubmitting ? 'SUBMITTING FOR REVIEW...' : 'SUBMIT COMMUNITY FOR REVIEW'}
          </NeoButton>
        </form>
      </div>
    </div>
  );
}
