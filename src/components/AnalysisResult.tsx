import React from 'react';
import { Shield, ShieldAlert, FileSearch, Hash, Brain, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AnalysisStatus = 'idle' | 'uploading' | 'hashing' | 'signature-scan' | 'ml-analysis' | 'complete';
export type Verdict = 'safe' | 'malicious' | 'unknown';

interface AnalysisResultProps {
  status: AnalysisStatus;
  verdict?: Verdict;
  fileName?: string;
  fileHash?: string;
  detectionMethod?: 'signature' | 'anomaly' | 'none';
  confidence?: number;
  details?: string[];
  scanTime?: number;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  status,
  verdict,
  fileName,
  fileHash,
  detectionMethod,
  confidence = 0,
  details = [],
  scanTime,
}) => {
  const isComplete = status === 'complete';
  
  const getVerdictConfig = () => {
    if (!isComplete || !verdict) return null;
    
    switch (verdict) {
      case 'safe':
        return {
          icon: Shield,
          label: 'Safe',
          description: 'No threats detected',
          className: 'gradient-safe shadow-glow-success',
          textClass: 'text-success',
          bgClass: 'bg-success/10',
        };
      case 'malicious':
        return {
          icon: ShieldAlert,
          label: 'Malicious',
          description: 'Threat detected',
          className: 'gradient-danger shadow-glow-danger',
          textClass: 'text-destructive',
          bgClass: 'bg-destructive/10',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          description: 'Could not determine',
          className: 'bg-warning shadow-md',
          textClass: 'text-warning',
          bgClass: 'bg-warning/10',
        };
    }
  };

  const verdictConfig = getVerdictConfig();

  const steps = [
    { key: 'uploading', label: 'Uploading', icon: FileSearch },
    { key: 'hashing', label: 'Computing Hash', icon: Hash },
    { key: 'signature-scan', label: 'Signature Scan', icon: Shield },
    { key: 'ml-analysis', label: 'ML Analysis', icon: Brain },
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ['uploading', 'hashing', 'signature-scan', 'ml-analysis', 'complete'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (currentIndex > stepIndex) return 'complete';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  if (status === 'idle') return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Progress Steps */}
      {!isComplete && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepStatus = getStepStatus(step.key);
              const Icon = step.icon;
              
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                      stepStatus === 'complete' && "gradient-safe text-white",
                      stepStatus === 'active' && "gradient-blue text-white animate-pulse",
                      stepStatus === 'pending' && "bg-secondary text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-xs font-medium transition-colors",
                      stepStatus === 'active' ? "text-apple-blue" : 
                      stepStatus === 'complete' ? "text-success" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-3 rounded-full transition-all duration-500",
                      getStepStatus(steps[index + 1].key) !== 'pending' 
                        ? "gradient-blue" 
                        : "bg-border"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Card */}
      {isComplete && verdictConfig && (
        <div className={cn(
          "rounded-3xl p-8 transition-all duration-500 animate-scale-in",
          verdictConfig.bgClass
        )}>
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Verdict Icon */}
            <div className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center",
              verdictConfig.className
            )}>
              <verdictConfig.icon className="w-12 h-12 text-white" />
            </div>

            {/* Verdict Text */}
            <div className="space-y-1">
              <h2 className={cn("text-3xl font-bold", verdictConfig.textClass)}>
                {verdictConfig.label}
              </h2>
              <p className="text-muted-foreground">{verdictConfig.description}</p>
            </div>

            {/* File Info */}
            {fileName && (
              <div className="bg-background/50 rounded-xl px-6 py-4 w-full max-w-md">
                <p className="font-medium text-foreground truncate">{fileName}</p>
                {fileHash && (
                  <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                    SHA-256: {fileHash.substring(0, 16)}...{fileHash.substring(fileHash.length - 16)}
                  </p>
                )}
              </div>
            )}

            {/* Detection Details */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {detectionMethod && (
                <div className="bg-background/50 rounded-xl p-4 text-left">
                  <p className="text-xs text-muted-foreground mb-1">Detection Method</p>
                  <p className="font-semibold capitalize">
                    {detectionMethod === 'signature' ? 'Signature Match' : 
                     detectionMethod === 'anomaly' ? 'Anomaly Detection' : 'N/A'}
                  </p>
                </div>
              )}
              {confidence > 0 && (
                <div className="bg-background/50 rounded-xl p-4 text-left">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="font-semibold">{confidence.toFixed(1)}%</p>
                </div>
              )}
              {scanTime !== undefined && (
                <div className="bg-background/50 rounded-xl p-4 text-left">
                  <p className="text-xs text-muted-foreground mb-1">Scan Time</p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{scanTime.toFixed(2)}s</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {details.length > 0 && (
              <div className="bg-background/50 rounded-xl p-4 w-full max-w-md text-left">
                <p className="text-xs text-muted-foreground mb-2">Details</p>
                <ul className="space-y-1">
                  {details.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", 
                        verdict === 'malicious' ? 'bg-destructive' : 'bg-success'
                      )} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
