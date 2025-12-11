'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms';
import { TabNav, FileUpload, Job } from '@/components/molecules';
import { Header, JobList, Modal } from '@/components/organisms';
import { jobsApi, uploadFile } from '@/utils/api';

type TabId = 'ongoing' | 'completed' | 'cancelled';

const TABS = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

const STATUS_MAP: Record<TabId, string | undefined> = {
  ongoing: 'processing,pending',
  completed: 'completed',
  cancelled: 'cancelled,failed',
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>('ongoing');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch jobs when tab changes
  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) return;

    setJobsLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const statusFilter = STATUS_MAP[activeTab];
      const response = await jobsApi.getMyJobs(token, statusFilter);
      setJobs(response.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, [isAuthenticated, activeTab, getAccessTokenSilently]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Poll for ongoing jobs
  useEffect(() => {
    if (activeTab !== 'ongoing') return;

    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [activeTab, fetchJobs]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const token = await getAccessTokenSilently();
      await uploadFile(token, selectedFile);
      setShowUploadModal(false);
      setSelectedFile(null);
      setActiveTab('ongoing');
      fetchJobs();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (!uploading) {
      setShowUploadModal(false);
      setSelectedFile(null);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner spinner-lg" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const emptyMessages: Record<TabId, string> = {
    ongoing: 'No active conversions',
    completed: 'No completed conversions yet',
    cancelled: 'No cancelled or failed conversions',
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Conversions</h1>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus size={18} />
            New Conversion
          </Button>
        </div>

        <TabNav
          tabs={TABS.map(tab => ({ ...tab }))}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
        />

        <JobList
          jobs={jobs}
          loading={jobsLoading}
          emptyMessage={emptyMessages[activeTab]}
        />
      </main>

      <Modal
        isOpen={showUploadModal}
        onClose={handleCloseModal}
        title="New Conversion"
      >
        <FileUpload onFileSelect={handleFileSelect} disabled={uploading} />

        {selectedFile && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3)',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.875rem' }}>{selectedFile.name}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}

        <div className="modal-footer">
          <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} loading={uploading}>
            Start Conversion
          </Button>
        </div>
      </Modal>
    </div>
  );
}
