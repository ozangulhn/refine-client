import { JobCard, Job } from '../molecules';
import { FileText } from 'lucide-react';

interface JobListProps {
    jobs: Job[];
    loading?: boolean;
    emptyMessage?: string;
    onJobClick?: (job: Job) => void;
}

export function JobList({ jobs, loading, emptyMessage = 'No jobs found', onJobClick }: JobListProps) {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                <div className="spinner spinner-md" style={{ margin: '0 auto var(--space-4)' }} />
                Loading jobs...
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="empty-state">
                <FileText className="empty-state-icon" />
                <h3 className="empty-state-title">{emptyMessage}</h3>
                <p className="empty-state-text">
                    Start a new conversion by uploading a PDF file.
                </p>
            </div>
        );
    }

    return (
        <div>
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={onJobClick} />
            ))}
        </div>
    );
}
