import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import AnalysisResult, { AnalysisStatus, Verdict } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  uploadFileForAnalysis,
  mapVerdictToFrontend,
  getDetectionMethod,
  calculateConfidence,
  generateDetails,
  MalwareAnalysisReport,
} from '@/services/malwareApi';

const AnalyzePage: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    verdict: Verdict;
    detectionMethod: 'signature' | 'anomaly' | 'none';
    confidence: number;
    details: string[];
    hash: string;
    scanTime: number;
    rawReport?: MalwareAnalysisReport;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (file: File) => {
    const startTime = Date.now();
    setSelectedFile(file);
    setResult(null);
    setError(null);

    try {
      // Show uploading status
      setStatus('uploading');

      // Call the real backend API
      const report = await uploadFileForAnalysis(file);
      const scanTime = (Date.now() - startTime) / 1000;

      // Process the response
      setResult({
        verdict: mapVerdictToFrontend(report.final_verdict),
        detectionMethod: getDetectionMethod(report),
        confidence: calculateConfidence(report),
        details: generateDetails(report),
        hash: report.hash,
        scanTime,
        rawReport: report,
      });
      setStatus('complete');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setStatus('idle');
      toast({
        title: 'Analysis Failed',
        description: err instanceof Error ? err.message : 'Could not connect to analysis backend. Make sure the server is running.',
        variant: 'destructive',
      });
    }
  }, []);

  const handleReset = () => {
    setStatus('idle');
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Analyze Your File
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload any file to scan for malware using our hybrid detection system combining 
            signature matching and deep learning anomaly detection.
          </p>
        </div>

        {/* Upload Section */}
        {status === 'idle' && (
          <FileUpload 
            onFileSelect={runAnalysis}
            isProcessing={false}
          />
        )}

        {/* Analysis Progress & Results */}
        {status !== 'idle' && (
          <div className="space-y-8">
            <AnalysisResult
              status={status}
              verdict={result?.verdict}
              fileName={selectedFile?.name}
              fileHash={result?.hash}
              detectionMethod={result?.detectionMethod}
              confidence={result?.confidence}
              details={result?.details}
              scanTime={result?.scanTime}
            />

            {/* Action Buttons */}
            {status === 'complete' && (
              <div className="flex justify-center gap-4 animate-fade-in">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another File
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Signature Detection</h3>
            <p className="text-sm text-muted-foreground">
              RegEx-based pattern matching against a comprehensive database of known malware signatures and hashes.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Anomaly Detection</h3>
            <p className="text-sm text-muted-foreground">
              Deep Autoencoder model trained on benign samples to identify unknown threats through reconstruction error analysis.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Files are processed in isolation and deleted immediately after analysis. No raw file content is stored.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyzePage;
