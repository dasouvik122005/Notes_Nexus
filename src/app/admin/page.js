'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import RejectModal from '@/components/admin/RejectModal';
import PdfModal from '@/components/PdfModal';
import NeoButton from '@/components/NeoButton';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  UserCheck,
  Store,
  History,
  BookOpen,
  GraduationCap,
  Ban,
  Search,
  Filter,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function AdminModerationPage() {
  const { user, profile, isLoading, openAuthModal } = useAuth();

  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'accounts' | 'listings' | 'audit'

  // Queue Data
  const [materials, setMaterials] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [listings, setListings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({
    pendingMaterialsCount: 0,
    pendingAccountsCount: 0,
    pendingListingsCount: 0,
    totalAuditCount: 0,
  });

  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [statusNotification, setStatusNotification] = useState(null);

  // Material Filter
  const [materialFilterType, setMaterialFilterType] = useState('all'); // 'all' | 'notes' | 'pyq'

  // Modal States
  const [previewPdf, setPreviewPdf] = useState(null); // { url, title }
  const [rejectItem, setRejectItem] = useState(null); // { id, title, type: 'material'|'user'|'listing' }
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Fetch Queue Data
  useEffect(() => {
    let isMounted = true;
    async function loadInitialQueue() {
      try {
        const res = await fetch('/api/admin/queue');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMaterials(data.materials || []);
            setAccounts(data.accounts || []);
            setListings(data.listings || []);
            setAuditLogs(data.auditLogs || []);
            setStats(
              data.stats || {
                pendingMaterialsCount: (data.materials || []).length,
                pendingAccountsCount: (data.accounts || []).length,
                pendingListingsCount: (data.listings || []).length,
                totalAuditCount: (data.auditLogs || []).length,
              }
            );
          }
        }
      } catch (err) {
        console.error('Failed to load moderation queue:', err);
      } finally {
        if (isMounted) {
          setIsLoadingQueue(false);
        }
      }
    }

    loadInitialQueue();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const res = await fetch('/api/admin/queue');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
        setAccounts(data.accounts || []);
        setListings(data.listings || []);
        setAuditLogs(data.auditLogs || []);
        setStats(
          data.stats || {
            pendingMaterialsCount: (data.materials || []).length,
            pendingAccountsCount: (data.accounts || []).length,
            pendingListingsCount: (data.listings || []).length,
            totalAuditCount: (data.auditLogs || []).length,
          }
        );
      }
    } catch (err) {
      console.error('Failed to refresh queue:', err);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  // Handle Approve Material
  const handleApproveMaterial = async (item) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_material',
          id: item.id,
          targetSummary: `${item.title} (${item.paperCode})`,
        }),
      });

      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== item.id));
        setStats((prev) => ({
          ...prev,
          pendingMaterialsCount: Math.max(0, prev.pendingMaterialsCount - 1),
          totalAuditCount: prev.totalAuditCount + 1,
        }));
        setAuditLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            actorName: user?.name || 'Admin',
            actorEmail: user?.email || 'admin@jisuniversity.ac.in',
            action: 'approve_material',
            entityType: 'material',
            entityId: item.id,
            entitySummary: `${item.title} (${item.paperCode})`,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
        setStatusNotification(`Approved "${item.title}". Material is now live in catalog.`);
      }
    } catch (err) {
      console.error('Failed to approve material:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle Confirm Rejection
  const handleConfirmRejection = async (reason) => {
    if (!rejectItem) return;
    setIsProcessingAction(true);

    try {
      let actionName = 'reject_material';
      if (rejectItem.type === 'user') actionName = 'block_user';
      if (rejectItem.type === 'listing') actionName = 'reject_listing';

      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          id: rejectItem.id,
          reason,
          targetSummary: rejectItem.title,
        }),
      });

      if (res.ok) {
        if (rejectItem.type === 'material') {
          setMaterials((prev) => prev.filter((m) => m.id !== rejectItem.id));
          setStats((prev) => ({
            ...prev,
            pendingMaterialsCount: Math.max(0, prev.pendingMaterialsCount - 1),
            totalAuditCount: prev.totalAuditCount + 1,
          }));
        } else if (rejectItem.type === 'user') {
          setAccounts((prev) => prev.filter((a) => a.id !== rejectItem.id));
          setStats((prev) => ({
            ...prev,
            pendingAccountsCount: Math.max(0, prev.pendingAccountsCount - 1),
            totalAuditCount: prev.totalAuditCount + 1,
          }));
        } else if (rejectItem.type === 'listing') {
          setListings((prev) => prev.filter((l) => l.id !== rejectItem.id));
          setStats((prev) => ({
            ...prev,
            pendingListingsCount: Math.max(0, prev.pendingListingsCount - 1),
            totalAuditCount: prev.totalAuditCount + 1,
          }));
        }

        setAuditLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            actorName: user?.name || 'Admin',
            actorEmail: user?.email || 'admin@jisuniversity.ac.in',
            action: actionName,
            entityType: rejectItem.type,
            entityId: rejectItem.id,
            entitySummary: `${rejectItem.title} - Reason: ${reason}`,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);

        setStatusNotification(`Rejected "${rejectItem.title}". Feedback sent to contributor.`);
        setRejectItem(null);
      }
    } catch (err) {
      console.error('Failed to reject item:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle Verify Contributor Account
  const handleVerifyAccount = async (account) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_user',
          id: account.id,
          targetSummary: `${account.name} (${account.email})`,
        }),
      });

      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== account.id));
        setStats((prev) => ({
          ...prev,
          pendingAccountsCount: Math.max(0, prev.pendingAccountsCount - 1),
          totalAuditCount: prev.totalAuditCount + 1,
        }));
        setAuditLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            actorName: user?.name || 'Admin',
            actorEmail: user?.email || 'admin@jisuniversity.ac.in',
            action: 'verify_user',
            entityType: 'user',
            entityId: account.id,
            entitySummary: `${account.name} (${account.email})`,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
        setStatusNotification(`Verified contributor account for ${account.name}. Upload rights unlocked.`);
      }
    } catch (err) {
      console.error('Failed to verify user:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle Approve Listing
  const handleApproveListing = async (listing) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_listing',
          id: listing.id,
          targetSummary: `${listing.title} (₹${listing.price})`,
        }),
      });

      if (res.ok) {
        setListings((prev) => prev.filter((l) => l.id !== listing.id));
        setStats((prev) => ({
          ...prev,
          pendingListingsCount: Math.max(0, prev.pendingListingsCount - 1),
          totalAuditCount: prev.totalAuditCount + 1,
        }));
        setAuditLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            actorName: user?.name || 'Admin',
            actorEmail: user?.email || 'admin@jisuniversity.ac.in',
            action: 'approve_listing',
            entityType: 'listing',
            entityId: listing.id,
            entitySummary: `${listing.title} (₹${listing.price})`,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
        setStatusNotification(`Approved marketplace listing "${listing.title}".`);
      }
    } catch (err) {
      console.error('Failed to approve listing:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Verifying administrator privileges...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Visitor
  if (!user) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
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
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <ShieldAlert size={32} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Admin Moderation Suite
            </h1>

            <p style={{ color: '#4B5563', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              This section is strictly restricted to JIS University student administrators. Please sign in with an allowlisted administrator account.
            </p>

            <NeoButton
              onClick={() => openAuthModal('Sign in with an administrator account.')}
              variant="primary"
              style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }}
            >
              SIGN IN AS ADMIN
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
              Local Dev Tip: Click <strong>&quot;Admin&quot;</strong> in the Dev Switcher bar at the top of the page to inspect this moderation suite.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized User (Non-Admin 403)
  if (profile?.role !== 'admin') {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: '#FEE2E2',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#DC2626',
                color: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <Ban size={32} />
            </div>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              403 FORBIDDEN • ACCESS RESTRICTED
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Administrator Privileges Required
            </h1>

            <p style={{ color: '#374151', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Your account <strong>({user.email})</strong> is registered as a student contributor. Access to moderation queues, document approvals, and student verification is restricted to appointed student admins.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/me">
                <NeoButton variant="default">MY DASHBOARD</NeoButton>
              </Link>
              <Link href="/notes">
                <NeoButton variant="secondary">BROWSE NOTES</NeoButton>
              </Link>
            </div>

            <div
              style={{
                marginTop: '2.5rem',
                borderTop: '2px dashed var(--black)',
                paddingTop: '1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#6B7280',
              }}
            >
              Local Dev Tip: Click <strong>&quot;Admin&quot;</strong> in the Dev Switcher bar above to test moderation.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (materialFilterType === 'all') return true;
    return m.type === materialFilterType;
  });

  // 4. Authorized Admin Dashboard View
  return (
    <div style={{ padding: '3.5rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary-pink)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                fontWeight: 900,
                fontSize: '0.8rem',
                padding: '0.2rem 0.6rem',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              <ShieldCheck size={14} /> Admin Moderation Suite
            </div>
            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Moderation Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleRefreshQueue}
            disabled={isLoadingQueue}
            style={{
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              padding: '0.6rem 1.1rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textTransform: 'uppercase',
            }}
          >
            <RefreshCw size={14} className={isLoadingQueue ? 'animate-spin' : ''} />
            Refresh Queues
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusNotification && (
          <div
            style={{
              backgroundColor: '#DCFCE7',
              border: '3px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#166534',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={20} />
              <span>{statusNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Analytics Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--primary-yellow)',
              padding: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('materials')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Study Materials
              </span>
              <BookOpen size={20} />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.5rem' }}>
              {stats.pendingMaterialsCount}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
              Pending verification
            </div>
          </div>

          <div
            className="neo-card"
            style={{
              backgroundColor: '#E0E7FF',
              padding: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('accounts')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Student Accounts
              </span>
              <UserCheck size={20} />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.5rem' }}>
              {stats.pendingAccountsCount}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
              Awaiting first approval
            </div>
          </div>

          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--primary-cyan)',
              padding: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('listings')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Marketplace
              </span>
              <Store size={20} />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.5rem' }}>
              {stats.pendingListingsCount}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
              Pending item listings
            </div>
          </div>

          <div
            className="neo-card"
            style={{
              backgroundColor: '#F3F4F6',
              padding: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('audit')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Audit Actions
              </span>
              <History size={20} />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.5rem' }}>
              {stats.totalAuditCount}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
              Recorded actions
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '3px solid var(--black)',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 900,
              fontSize: '0.95rem',
              borderTop: '3px solid var(--black)',
              borderLeft: '3px solid var(--black)',
              borderRight: '3px solid var(--black)',
              borderBottom: activeTab === 'materials' ? 'none' : '3px solid var(--black)',
              backgroundColor: activeTab === 'materials' ? 'var(--white)' : '#E5E7EB',
              marginBottom: '-3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            <BookOpen size={16} />
            <span>Materials Queue ({stats.pendingMaterialsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 900,
              fontSize: '0.95rem',
              borderTop: '3px solid var(--black)',
              borderLeft: '3px solid var(--black)',
              borderRight: '3px solid var(--black)',
              borderBottom: activeTab === 'accounts' ? 'none' : '3px solid var(--black)',
              backgroundColor: activeTab === 'accounts' ? 'var(--white)' : '#E5E7EB',
              marginBottom: '-3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            <UserCheck size={16} />
            <span>Accounts ({stats.pendingAccountsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 900,
              fontSize: '0.95rem',
              borderTop: '3px solid var(--black)',
              borderLeft: '3px solid var(--black)',
              borderRight: '3px solid var(--black)',
              borderBottom: activeTab === 'listings' ? 'none' : '3px solid var(--black)',
              backgroundColor: activeTab === 'listings' ? 'var(--white)' : '#E5E7EB',
              marginBottom: '-3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            <Store size={16} />
            <span>Marketplace ({stats.pendingListingsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 900,
              fontSize: '0.95rem',
              borderTop: '3px solid var(--black)',
              borderLeft: '3px solid var(--black)',
              borderRight: '3px solid var(--black)',
              borderBottom: activeTab === 'audit' ? 'none' : '3px solid var(--black)',
              backgroundColor: activeTab === 'audit' ? 'var(--white)' : '#E5E7EB',
              marginBottom: '-3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
            }}
          >
            <History size={16} />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Tab 1: Materials Queue */}
        {activeTab === 'materials' && (
          <div>
            {/* Filter Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Filter By:
              </span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'notes', label: 'Lecture Notes' },
                { id: 'pyq', label: 'PYQ Papers' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMaterialFilterType(f.id)}
                  style={{
                    backgroundColor:
                      materialFilterType === f.id ? 'var(--primary-yellow)' : 'var(--white)',
                    border: '2px solid var(--black)',
                    boxShadow:
                      materialFilterType === f.id
                        ? '3px 3px 0px 0px var(--black)'
                        : '1px 1px 0px 0px var(--black)',
                    padding: '0.35rem 0.8rem',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredMaterials.length === 0 ? (
              <div
                className="neo-card"
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '3rem',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={40} style={{ color: '#22C55E', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  Queue is Clear!
                </h3>
                <p style={{ color: '#6B7280', fontWeight: 600, margin: 0 }}>
                  No pending study materials in this category. All submitted files have been reviewed.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredMaterials.map((item) => (
                  <div
                    key={item.id}
                    className="neo-card"
                    style={{
                      backgroundColor: 'var(--white)',
                      padding: '1.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        {/* Type & Dept Badges */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor:
                                item.type === 'notes' ? 'var(--primary-yellow)' : 'var(--primary-pink)',
                              border: '2px solid var(--black)',
                              padding: '0.15rem 0.55rem',
                              fontWeight: 900,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.type === 'notes' ? 'Notes' : 'PYQ'}
                          </span>

                          <span
                            style={{
                              backgroundColor: '#F3F4F6',
                              border: '2px solid var(--black)',
                              padding: '0.15rem 0.55rem',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                            }}
                          >
                            Sem {item.semester} • {item.paperCode}
                          </span>

                          <span
                            style={{
                              backgroundColor: '#FEF3C7',
                              border: '2px solid var(--black)',
                              padding: '0.15rem 0.55rem',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                            }}
                          >
                            {item.departmentName || item.departmentId}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 900,
                            margin: '0 0 0.4rem 0',
                          }}
                        >
                          {item.title}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#4B5563',
                            lineHeight: 1.5,
                            maxWidth: '720px',
                          }}
                        >
                          {item.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* File Size & Contributor Info */}
                      <div
                        style={{
                          backgroundColor: '#F9FAFB',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.75rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          minWidth: '220px',
                        }}
                      >
                        <div style={{ marginBottom: '0.3rem' }}>
                          <span style={{ color: '#6B7280' }}>Uploader: </span>
                          <strong>{item.uploaderName || 'Student'}</strong>
                        </div>
                        <div style={{ marginBottom: '0.3rem', wordBreak: 'break-all' }}>
                          <span style={{ color: '#6B7280' }}>Email: </span>
                          <span>{item.uploaderEmail}</span>
                        </div>
                        <div style={{ marginBottom: '0.3rem' }}>
                          <span style={{ color: '#6B7280' }}>Size: </span>
                          <strong>{formatBytes(item.fileSize)}</strong>
                        </div>
                        {item.facultyName && (
                          <div>
                            <span style={{ color: '#6B7280' }}>Faculty: </span>
                            <span>{item.facultyName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        borderTop: '2px dashed #E5E7EB',
                        paddingTop: '1rem',
                      }}
                    >
                      {/* Preview PDF */}
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewPdf({
                            url: `/api/pdf/stream?key=${encodeURIComponent(
                              item.storageKey || 'sample'
                            )}&title=${encodeURIComponent(item.title)}`,
                            title: item.title,
                          })
                        }
                        style={{
                          backgroundColor: 'var(--white)',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.5rem 1rem',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        <Eye size={16} /> Preview In Viewer
                      </button>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {/* Reject */}
                        <button
                          type="button"
                          disabled={isProcessingAction}
                          onClick={() =>
                            setRejectItem({
                              id: item.id,
                              title: item.title,
                              type: 'material',
                            })
                          }
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '2px solid var(--black)',
                            boxShadow: '2px 2px 0px 0px var(--black)',
                            padding: '0.5rem 1.1rem',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            cursor: isProcessingAction ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          <XCircle size={16} /> Reject
                        </button>

                        {/* Approve */}
                        <button
                          type="button"
                          disabled={isProcessingAction}
                          onClick={() => handleApproveMaterial(item)}
                          style={{
                            backgroundColor: '#22C55E',
                            color: 'var(--white)',
                            border: '2px solid var(--black)',
                            boxShadow: '3px 3px 0px 0px var(--black)',
                            padding: '0.5rem 1.3rem',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            cursor: isProcessingAction ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          <CheckCircle2 size={16} /> Approve & Publish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contributor Accounts */}
        {activeTab === 'accounts' && (
          <div>
            {accounts.length === 0 ? (
              <div
                className="neo-card"
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '3rem',
                  textAlign: 'center',
                }}
              >
                <UserCheck size={40} style={{ color: '#22C55E', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  All Accounts Verified
                </h3>
                <p style={{ color: '#6B7280', fontWeight: 600, margin: 0 }}>
                  No pending student Google accounts awaiting approval.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="neo-card"
                    style={{
                      backgroundColor: 'var(--white)',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'var(--primary-yellow)',
                            border: '2px solid var(--black)',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {acc.name ? acc.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>
                            {acc.name}
                          </h4>
                          <span style={{ color: '#4B5563', fontWeight: 700, fontSize: '0.85rem' }}>
                            {acc.email}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: '0.6rem',
                          display: 'flex',
                          gap: '0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#6B7280',
                        }}
                      >
                        <span>Dept: {acc.department || 'Not specified'}</span>
                        <span>•</span>
                        <span>Joined: {acc.createdAt ? acc.createdAt.split('T')[0] : 'Today'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        type="button"
                        disabled={isProcessingAction}
                        onClick={() =>
                          setRejectItem({
                            id: acc.id,
                            title: `${acc.name} (${acc.email})`,
                            type: 'user',
                          })
                        }
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.5rem 1rem',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        Block Account
                      </button>

                      <button
                        type="button"
                        disabled={isProcessingAction}
                        onClick={() => handleVerifyAccount(acc)}
                        style={{
                          backgroundColor: '#22C55E',
                          color: 'var(--white)',
                          border: '2px solid var(--black)',
                          boxShadow: '3px 3px 0px 0px var(--black)',
                          padding: '0.5rem 1.25rem',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        <CheckCircle2 size={16} /> Verify Contributor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Marketplace Queue */}
        {activeTab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div
                className="neo-card"
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '3rem',
                  textAlign: 'center',
                }}
              >
                <Store size={40} style={{ color: '#22C55E', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  No Pending Marketplace Listings
                </h3>
                <p style={{ color: '#6B7280', fontWeight: 600, margin: 0 }}>
                  All second-hand textbooks and instruments have been moderated.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="neo-card"
                    style={{
                      backgroundColor: 'var(--white)',
                      padding: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: 'var(--primary-cyan)',
                              border: '2px solid var(--black)',
                              padding: '0.15rem 0.5rem',
                              fontWeight: 900,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.category}
                          </span>

                          <span
                            style={{
                              backgroundColor: '#F3F4F6',
                              border: '2px solid var(--black)',
                              padding: '0.15rem 0.5rem',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                            }}
                          >
                            Condition: {item.condition}
                          </span>
                        </div>

                        <h3 style={{ margin: '0 0 0.35rem 0', fontWeight: 900, fontSize: '1.2rem' }}>
                          {item.title}
                        </h3>

                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#166534' }}>
                          ₹{item.price}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#F9FAFB',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.75rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          minWidth: '220px',
                        }}
                      >
                        <div style={{ marginBottom: '0.3rem' }}>
                          <span style={{ color: '#6B7280' }}>Seller: </span>
                          <strong>{item.sellerName}</strong>
                        </div>
                        <div style={{ marginBottom: '0.3rem' }}>
                          <span style={{ color: '#6B7280' }}>Phone: </span>
                          <span>{item.sellerPhone}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6B7280' }}>Email: </span>
                          <span>{item.sellerEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                        borderTop: '2px dashed #E5E7EB',
                        paddingTop: '1rem',
                      }}
                    >
                      <button
                        type="button"
                        disabled={isProcessingAction}
                        onClick={() =>
                          setRejectItem({
                            id: item.id,
                            title: item.title,
                            type: 'listing',
                          })
                        }
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.5rem 1rem',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        Reject Listing
                      </button>

                      <button
                        type="button"
                        disabled={isProcessingAction}
                        onClick={() => handleApproveListing(item)}
                        style={{
                          backgroundColor: '#22C55E',
                          color: 'var(--white)',
                          border: '2px solid var(--black)',
                          boxShadow: '3px 3px 0px 0px var(--black)',
                          padding: '0.5rem 1.25rem',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        <CheckCircle2 size={16} /> Approve Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--white)',
              padding: '2rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Moderation Activity History
            </h3>

            {auditLogs.length === 0 ? (
              <p style={{ color: '#6B7280', fontWeight: 600 }}>No audit actions recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      border: '2px solid var(--black)',
                      backgroundColor: '#F9FAFB',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            backgroundColor: log.action.includes('approve') || log.action.includes('verify')
                              ? '#DCFCE7'
                              : '#FEE2E2',
                            color: log.action.includes('approve') || log.action.includes('verify')
                              ? '#166534'
                              : '#991B1B',
                            border: '1px solid var(--black)',
                            padding: '0.1rem 0.4rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          {log.action.replace('_', ' ')}
                        </span>
                        <strong style={{ fontWeight: 800 }}>{log.entitySummary}</strong>
                      </div>
                      <div style={{ color: '#6B7280', marginTop: '0.2rem', fontSize: '0.8rem' }}>
                        By: {log.actorName} ({log.actorEmail})
                      </div>
                    </div>

                    <div style={{ color: '#6B7280', fontWeight: 700, fontSize: '0.8rem' }}>
                      {log.timestamp ? log.timestamp.split('T')[0] : 'Recent'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <RejectModal
        isOpen={Boolean(rejectItem)}
        title={rejectItem?.title}
        targetType={rejectItem?.type}
        onClose={() => setRejectItem(null)}
        onConfirm={handleConfirmRejection}
        isProcessing={isProcessingAction}
      />

      {/* PDF Preview Modal */}
      {previewPdf && (
        <PdfModal
          isOpen={Boolean(previewPdf)}
          onClose={() => setPreviewPdf(null)}
          pdfUrl={previewPdf.url}
          title={previewPdf.title}
          viewerEmail={user?.email || 'admin@jisuniversity.ac.in'}
        />
      )}
    </div>
  );
}
