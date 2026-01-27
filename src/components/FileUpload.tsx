import React, { useCallback, useState } from 'react';
import { Upload, File, X, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isProcessing = false,
  maxSize = 50,
  acceptedTypes = ['*/*'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }
    
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer group",
          isDragging
            ? "border-apple-blue bg-apple-blue/5 scale-[1.02]"
            : "border-border hover:border-apple-blue/50 hover:bg-secondary/50",
          isProcessing && "pointer-events-none opacity-60",
          selectedFile && "border-success bg-success/5"
        )}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Icon */}
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
            selectedFile 
              ? "gradient-safe shadow-glow-success" 
              : isDragging
              ? "gradient-blue shadow-glow"
              : "bg-secondary group-hover:bg-apple-blue/10"
          )}>
            {selectedFile ? (
              <Shield className="w-10 h-10 text-white" />
            ) : (
              <Upload className={cn(
                "w-10 h-10 transition-colors duration-300",
                isDragging ? "text-white" : "text-muted-foreground group-hover:text-apple-blue"
              )} />
            )}
          </div>

          {/* Text */}
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 text-foreground">
                <File className="w-5 h-5 text-success" />
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-muted-foreground text-sm">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
              <p className="text-success font-medium">Ready for analysis</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xl font-semibold text-foreground">
                {isDragging ? "Drop your file here" : "Drop file to scan"}
              </p>
              <p className="text-muted-foreground">
                or click to browse • Max {maxSize}MB
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Clear button */}
        {selectedFile && !isProcessing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="absolute top-4 right-4 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
