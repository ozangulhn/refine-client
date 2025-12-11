'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // in MB
    disabled?: boolean;
}

export function FileUpload({
    onFileSelect,
    accept = '.pdf',
    maxSize = 50,
    disabled = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): boolean => {
        setError(null);

        // Check file type
        if (accept && !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Please select a PDF file');
            return false;
        }

        // Check file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSize) {
            setError(`File size must be less than ${maxSize}MB`);
            return false;
        }

        return true;
    }, [accept, maxSize]);

    const handleFile = useCallback((file: File) => {
        if (validateFile(file)) {
            onFileSelect(file);
        }
    }, [validateFile, onFileSelect]);

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
        // Reset input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    return (
        <div>
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label="Upload PDF file"
                style={{ opacity: disabled ? 0.5 : 1 }}
            >
                <Upload className="upload-zone-icon" />
                <p className="upload-zone-text">
                    Drop your PDF here, or <span style={{ color: 'var(--accent-primary)' }}>browse</span>
                </p>
                <p className="upload-zone-hint">
                    Maximum file size: {maxSize}MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                    disabled={disabled}
                />
            </div>
            {error && (
                <p style={{
                    color: 'var(--accent-danger)',
                    fontSize: '0.875rem',
                    marginTop: 'var(--space-2)'
                }}>
                    {error}
                </p>
            )}
        </div>
    );
}
