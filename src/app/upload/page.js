'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { departments } from '@/config/departments';
import PdfDropzone from '@/components/upload/PdfDropzone';
import NeoButton from '@/components/NeoButton';
import {
  Upload,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  AlertTriangle,
  FileText,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { user, profile, isLoading, openAuthModal } = useAuth();

  // Form State
  const [materialType, setMaterialType] = useState('notes'); // 'notes' | 'pyq'
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0].id);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [papers, setPapers] = useState([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [selectedPaperCode, setSelectedPaperCode] = useState('');
  const [isCustomPaper, setIsCustomPaper] = useState(false);
  const [customPaperName, setCustomPaperName] = useState('');
  const [customPaperCode, setCustomPaperCode] = useState('');

  // Content Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [section, setSection] = useState('');
  const [examType, setExamType] = useState('final_sem'); // 'mid_sem' | 'final_sem'
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // File Upload State
  const [file, setFile] = useState(null);
  const [dropzoneError, setDropzoneError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedMaterial, setSubmittedMaterial] = useState(null);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  // Fetch papers when department or semester changes
  useEffect(() => {
    let isMounted = true;
    async function fetchDeptPapers() {
      setIsLoadingPapers(true);
      try {
        const res = await fetch(
          `/api/papers?department=${selectedDeptId}&semester=${selectedSemester}`
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setPapers(json.papers || []);
            if (json.papers && json.papers.length > 0) {
              setSelectedPaperCode(json.papers[0].paperCode);
              setIsCustomPaper(false);
            } else {
              setSelectedPaperCode('custom');
              setIsCustomPaper(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load papers:', err);
      } finally {
        if (isMounted) setIsLoadingPapers(false);
      }
    }

    fetchDeptPapers();
    return () => {
      isMounted = false;
    };
  }, [selectedDeptId, selectedSemester]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const newDeptId = e.target.value;
    setSelectedDeptId(newDeptId);
    setSelectedSemester(1);
  };

  // Handle paper selection change
  const handlePaperChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustomPaper(true);
      setSelectedPaperCode('custom');
    } else {
      setIsCustomPaper(false);
      setSelectedPaperCode(val);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!file) {
      setDropzoneError('Please select or drop a valid PDF document.');
      return;
    }

    let paperName = '';
    let paperCode = '';

    if (isCustomPaper) {
      if (!customPaperName.trim() || !customPaperCode.trim()) {
        setSubmitError('Please enter both the custom paper name and paper code.');
        return;
      }
      paperName = customPaperName.trim();
      paperCode = customPaperCode.trim().toUpperCase();
    } else {
      const found = papers.find((p) => p.paperCode === selectedPaperCode);
      if (!found) {
        setSubmitError('Please choose a valid subject paper from the list.');
        return;
      }
      paperName = found.paperName;
      paperCode = found.paperCode;
    }

    if (!title.trim()) {
      setSubmitError('Please provide a descriptive title for this study material.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', materialType);
      formData.append('departmentId', selectedDeptId);
      formData.append('semester', selectedSemester.toString());
      formData.append('paperName', paperName);
      formData.append('paperCode', paperCode);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (materialType === 'notes') {
        formData.append('facultyName', facultyName.trim());
        formData.append('section', section.trim());
      } else {
        formData.append('examType', examType);
      }
      formData.append('year', year.toString());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload material.');
      }

      // Persist to local / session storage for dashboard /me immediate sync
      const newRecord = {
        id: data.material?.id || `mat-${Date.now()}`,
        title: title.trim(),
        paperName,
        paperCode,
        semester: selectedSemester,
        type: materialType,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        viewCount: 0,
        ratingAvg: 0,
      };

      try {
        const stored = JSON.parse(localStorage.getItem('notes_nexus_user_materials') || '[]');
        stored.unshift(newRecord);
        localStorage.setItem('notes_nexus_user_materials', JSON.stringify(stored));
      } catch {
        // Storage unavailable
      }

      setSubmittedMaterial(newRecord);
    } catch (err) {
      console.error('[Upload Page] Submission error:', err);
      setSubmitError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for another upload
  const handleResetForm = () => {
    setSubmittedMaterial(null);
    setFile(null);
    setTitle('');
    setDescription('');
    setFacultyName('');
    setSection('');
    setCustomPaperName('');
    setCustomPaperCode('');
    setIsCustomPaper(false);
    setDropzoneError(null);
    setSubmitError(null);
  };

  // State 1: Loading
  if (isLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Checking contributor status...</p>
        </div>
      </div>
    );
  }

  // State 2: Unauthenticated Visitor
  if (!user) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: 'var(--white)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-yellow)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <Upload size={32} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Sign In to Contribute
            </h1>

            <p style={{ color: '#4B5563', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              Notes Nexus is an open, student-curated academic library. To ensure academic integrity and prevent spam, students must sign in with any personal Google account before contributing lecture notes or PYQs.
            </p>

            <NeoButton
              onClick={() => openAuthModal('Sign in with Google to upload study materials.')}
              variant="primary"
              style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }}
            >
              SIGN IN WITH GOOGLE
            </NeoButton>

            <div
              style={{
                marginTop: '2rem',
                borderTop: '2px dashed var(--black)',
                paddingTop: '1.25rem',
                fontSize: '0.85rem',
                color: '#6B7280',
                fontWeight: 700,
              }}
            >
              Tip: In local testing, you can use the Dev Switcher at the top of the screen to test as a Verified Contributor.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Pending Contributor (Two-stage verification spam-gate)
  if (profile?.account_status === 'pending' && profile?.role !== 'admin') {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div
            className="neo-card"
            style={{
              padding: '2.5rem 2rem',
              backgroundColor: '#FEF9C3',
              borderColor: 'var(--black)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'var(--primary-yellow)',
                  border: '3px solid var(--black)',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={30} />
              </div>

              <div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--black)',
                    color: 'var(--white)',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Contributor Verification Pending
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>
                  Account Awaiting Moderator Approval
                </h1>

                <p
                  style={{
                    color: '#374151',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                  }}
                >
                  Welcome to Notes Nexus, <strong>{user.name}</strong>! As part of our anti-spam and quality assurance policy, first-time student accounts undergo a one-time approval by our student admin team before upload privileges are enabled.
                </p>

                <div
                  style={{
                    border: '2px solid var(--black)',
                    backgroundColor: 'var(--white)',
                    padding: '1rem',
                    boxShadow: '2px 2px 0px 0px var(--black)',
                    marginBottom: '1.75rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                    <strong>What you can do right now:</strong>
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.5 }}>
                    <li>Browse and search all university departments and semesters.</li>
                    <li>View complete lecture notes and PYQs in our in-app secure viewer.</li>
                    <li>Rate materials and provide community feedback.</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/me">
                    <NeoButton variant="default" style={{ padding: '0.6rem 1.25rem' }}>
                      CHECK STATUS IN DASHBOARD
                    </NeoButton>
                  </Link>

                  <Link href="/notes">
                    <NeoButton variant="secondary" style={{ padding: '0.6rem 1.25rem' }}>
                      EXPLORE NOTES
                    </NeoButton>
                  </Link>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '2rem',
                borderTop: '2px dashed var(--black)',
                paddingTop: '1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#6B7280',
              }}
            >
              Developer Notice: Select <strong>&quot;Verified Contributor&quot;</strong> in the top Dev Switcher bar to instantly test this upload form.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Post-Submission Success Screen
  if (submittedMaterial) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: '#F0FDF4',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#22C55E',
                color: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                fontWeight: 900,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              SUBMISSION RECEIVED • PENDING REVIEW
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Thank You for Contributing!
            </h1>

            <p style={{ color: '#374151', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your {submittedMaterial.type === 'notes' ? 'lecture notes' : 'PYQ paper'} &quot;
              <strong>{submittedMaterial.title}</strong>&quot; for{' '}
              <strong>{submittedMaterial.paperName} ({submittedMaterial.paperCode})</strong> has been uploaded to the moderation pipeline.
            </p>

            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '1.25rem',
                textAlign: 'left',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B7280' }}>Category:</span>
                <span style={{ textTransform: 'uppercase' }}>{submittedMaterial.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B7280' }}>Subject:</span>
                <span>{submittedMaterial.paperName} ({submittedMaterial.paperCode})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B7280' }}>Status:</span>
                <span style={{ color: '#D97706', fontWeight: 900 }}>Pending Review</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Submission ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{submittedMaterial.id}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/me">
                <NeoButton variant="primary" style={{ padding: '0.75rem 1.5rem' }}>
                  VIEW IN MY DASHBOARD
                </NeoButton>
              </Link>

              <NeoButton
                onClick={handleResetForm}
                variant="default"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                UPLOAD ANOTHER FILE
              </NeoButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 5: Main Upload Form (Verified Contributor & Admin)
  return (
    <div style={{ padding: '4rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header Banner */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-yellow)',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              fontWeight: 900,
              fontSize: '0.8rem',
              padding: '0.2rem 0.6rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Upload size={14} /> Contributor Portal
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            Share Study Materials
          </h1>

          <p style={{ color: '#4B5563', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>
            Help fellow JIS University students excel. Upload clean, readable lecture notes or previous year question papers. All contributions are credited in the catalog after moderator approval.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--white)',
              padding: '2.5rem 2rem',
              marginBottom: '2rem',
            }}
          >
            {/* 1. Material Type Toggle */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                1. What are you contributing? *
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setMaterialType('notes')}
                  style={{
                    padding: '1.1rem 1rem',
                    border: '3px solid var(--black)',
                    backgroundColor:
                      materialType === 'notes' ? 'var(--primary-yellow)' : '#F3F4F6',
                    boxShadow:
                      materialType === 'notes'
                        ? '4px 4px 0px 0px var(--black)'
                        : '2px 2px 0px 0px var(--black)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <BookOpen size={24} />
                  <span>LECTURE NOTES</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563' }}>
                    Unit notes, handwritten sheets, cheat codes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMaterialType('pyq')}
                  style={{
                    padding: '1.1rem 1rem',
                    border: '3px solid var(--black)',
                    backgroundColor:
                      materialType === 'pyq' ? 'var(--primary-yellow)' : '#F3F4F6',
                    boxShadow:
                      materialType === 'pyq'
                        ? '4px 4px 0px 0px var(--black)'
                        : '2px 2px 0px 0px var(--black)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <GraduationCap size={24} />
                  <span>PREVIOUS YEAR QUESTION (PYQ)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563' }}>
                    Mid-Sem or Final-Sem examination papers
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Department & Semester Cascading Selectors */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                2. Academic Program & Semester *
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Department
                  </label>
                  <select
                    value={selectedDeptId}
                    onChange={handleDepartmentChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '3px solid var(--black)',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--white)',
                      outline: 'none',
                    }}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.shortCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Semester (Total {selectedDept.totalSemesters} Sems)
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '3px solid var(--black)',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--white)',
                      outline: 'none',
                    }}
                  >
                    {Array.from({ length: selectedDept.totalSemesters }, (_, i) => i + 1).map(
                      (sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Paper / Subject Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                3. Subject / Paper *
              </label>

              <select
                value={selectedPaperCode}
                onChange={handlePaperChange}
                disabled={isLoadingPapers}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid var(--black)',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  backgroundColor: isLoadingPapers ? '#F3F4F6' : 'var(--white)',
                  outline: 'none',
                  marginBottom: isCustomPaper ? '1rem' : '0',
                }}
              >
                {papers.map((p) => (
                  <option key={p.id || p.paperCode} value={p.paperCode}>
                    {p.paperName} ({p.paperCode})
                  </option>
                ))}
                <option value="custom">+ Add New Paper / Subject (Not in list)</option>
              </select>

              {/* Custom Paper Sub-inputs */}
              {isCustomPaper && (
                <div
                  style={{
                    backgroundColor: '#FEF9C3',
                    border: '3px solid var(--black)',
                    boxShadow: '3px 3px 0px 0px var(--black)',
                    padding: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      New Paper Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Operating Systems"
                      value={customPaperName}
                      onChange={(e) => setCustomPaperName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Paper Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS702"
                      value={customPaperCode}
                      onChange={(e) => setCustomPaperCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                        textTransform: 'uppercase',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Document Metadata */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                4. Document Details *
              </label>

              {/* Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#4B5563',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    materialType === 'notes'
                      ? 'e.g. Unit 2 - Tree Traversal & Binary Search Trees'
                      : 'e.g. 2023 End-Semester Examination Paper'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '3px solid var(--black)',
                    boxShadow: '3px 3px 0px 0px var(--black)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--white)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Conditional: Notes Fields */}
              {materialType === 'notes' ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Faculty Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. T. Das"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Section / Batch (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE-A (2024)"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Academic Year (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="2025"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* Conditional: PYQ Fields */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Exam Type *
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    >
                      <option value="mid_sem">Mid Semester Exam</option>
                      <option value="final_sem">Final Semester Exam</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        marginBottom: '0.35rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Examination Year *
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '2px solid var(--black)',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        backgroundColor: 'var(--white)',
                      }}
                    >
                      {[2025, 2024, 2023, 2022, 2021, 2020, 2019].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#4B5563',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Description / Topic Summary (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Covers modules 1 and 2, including solved university question examples and diagrams."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--black)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--white)',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* 5. PDF Dropzone */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                5. Select PDF Document (Max 50 MB) *
              </label>

              <PdfDropzone
                file={file}
                onFileSelect={(f) => setFile(f)}
                onFileClear={() => setFile(null)}
                disabled={isSubmitting}
                error={dropzoneError}
                setError={setDropzoneError}
              />
            </div>

            {/* Submit Error */}
            {submitError && (
              <div
                style={{
                  border: '3px solid var(--black)',
                  backgroundColor: '#FEE2E2',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  padding: '1rem',
                  color: '#991B1B',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.5rem',
                }}
              >
                <AlertTriangle size={20} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <NeoButton
                type="submit"
                variant="primary"
                disabled={isSubmitting || !file}
                style={{
                  fontSize: '1.1rem',
                  padding: '0.9rem 2.2rem',
                  opacity: isSubmitting || !file ? 0.6 : 1,
                  cursor: isSubmitting || !file ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'UPLOADING TO MODERATION QUEUE...' : 'SUBMIT FOR REVIEW'}
              </NeoButton>

              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280' }}>
                Files go into <strong>Pending Review</strong> before public release.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
