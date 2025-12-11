import { Badge } from '../atoms';
import { FileText } from 'lucide-react';

export interface Job {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    original_filename: string | null;
    page_count: number | null;
    pages_processed: number;
    created_at: string;
    completed_at: string | null;
    error_message: string | null;
}

interface JobCardProps {
    job: Job;
    onClick?: (job: Job) => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function JobCard({ job, onClick }: JobCardProps) {
    const showProgress = job.status === 'processing' || job.status === 'pending';
    const filename = job.original_filename || 'Untitled document';

    return (
        <div
            className="job-card"
            onClick={() => onClick?.(job)}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className="job-info">
                <div className="job-filename" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FileText size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    {filename}
                </div>
                <div className="job-meta">
                    {job.page_count && `${job.pages_processed}/${job.page_count} pages • `}
                    {formatDate(job.created_at)}
                    {job.error_message && (
                        <span style={{ color: 'var(--accent-danger)' }}> • {job.error_message}</span>
                    )}
                </div>
            </div>

            {showProgress && (
                <div className="job-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${job.progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="job-status">
                <Badge status={job.status} />
            </div>
        </div>
    );
}
