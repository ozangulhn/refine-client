interface BadgeProps {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'default';
    children?: React.ReactNode;
}

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    default: 'Unknown',
};

export function Badge({ status, children }: BadgeProps) {
    const label = children ?? statusLabels[status] ?? statusLabels.default;

    return (
        <span className={`badge badge-${status}`}>
            {label}
        </span>
    );
}
