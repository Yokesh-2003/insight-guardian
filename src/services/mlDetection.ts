// Client-side ML detection logic based on your Python implementation

export interface MalwareReport {
  hash: string;
  yaraMatches: YaraMatch[];
  anomalyScore: number;
  modelThreshold: number;
  federatedModelVersion: string;
  finalVerdict: 'Malicious' | 'Suspicious' | 'Clean';
  features: FeatureVector;
}

export interface YaraMatch {
  rule: string;
  metadata: Record<string, string>;
}

export interface FeatureVector {
  sizeMb: number;
  entropy: number;
  stringCount: number;
  suspiciousCount: number;
  normalized: number[];
}

// Anomaly detection threshold (from your model training)
const THRESHOLD = 0.015;

// YARA-like signature patterns for malware detection
const MALWARE_SIGNATURES = [
  { rule: 'SuspiciousShellCommand', pattern: /(cmd\.exe|powershell|bash\s+-c|\/bin\/sh)/gi, metadata: { severity: 'high', category: 'shell_execution' } },
  { rule: 'NetworkActivity', pattern: /(wget|curl|socket|urllib|requests\.get|http:\/\/|https:\/\/)/gi, metadata: { severity: 'medium', category: 'network' } },
  { rule: 'EncodedPayload', pattern: /(base64|atob|btoa|eval\(|exec\(|compile\()/gi, metadata: { severity: 'high', category: 'obfuscation' } },
  { rule: 'RegistryAccess', pattern: /(HKEY_|RegOpenKey|RegSetValue|winreg)/gi, metadata: { severity: 'high', category: 'persistence' } },
  { rule: 'ProcessManipulation', pattern: /(CreateProcess|ShellExecute|subprocess|os\.system|os\.popen)/gi, metadata: { severity: 'high', category: 'execution' } },
  { rule: 'FileSystemAccess', pattern: /(WriteFile|CreateFile|DeleteFile|rmdir|unlink)/gi, metadata: { severity: 'medium', category: 'filesystem' } },
  { rule: 'CryptoOperations', pattern: /(AES|RSA|encrypt|decrypt|cipher|hashlib)/gi, metadata: { severity: 'medium', category: 'crypto' } },
  { rule: 'AntiAnalysis', pattern: /(IsDebuggerPresent|CheckRemoteDebugger|vmware|virtualbox|sandbox)/gi, metadata: { severity: 'high', category: 'evasion' } },
];

// Suspicious keywords for feature extraction
const SUSPICIOUS_KEYWORDS = ['cmd', 'powershell', 'http', 'wget', 'curl', 'socket', 'exec', 'eval', 'system', 'shell'];

// Calculate SHA-256 hash of file
export async function calculateHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Calculate file entropy (measure of randomness)
export function calculateEntropy(data: Uint8Array): number {
  if (data.length === 0) return 0;

  const frequency = new Array(256).fill(0);
  for (let i = 0; i < data.length; i++) {
    frequency[data[i]]++;
  }

  let entropy = 0;
  const dataLen = data.length;
  for (let i = 0; i < 256; i++) {
    if (frequency[i] > 0) {
      const px = frequency[i] / dataLen;
      entropy -= px * Math.log2(px);
    }
  }

  return entropy;
}

// Extract readable strings from binary data
export function extractStrings(data: Uint8Array): string[] {
  const strings: string[] = [];
  let currentString = '';

  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    // Printable ASCII range (space to tilde)
    if (byte >= 32 && byte <= 126) {
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length >= 4) {
        strings.push(currentString);
      }
      currentString = '';
    }
  }

  if (currentString.length >= 4) {
    strings.push(currentString);
  }

  return strings;
}

// Count suspicious keywords in strings
export function countSuspiciousKeywords(strings: string[]): number {
  let count = 0;
  for (const str of strings) {
    const lowerStr = str.toLowerCase();
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (lowerStr.includes(keyword)) {
        count++;
        break;
      }
    }
  }
  return count;
}

// Extract features for ML model
export async function extractFeatures(file: File): Promise<FeatureVector> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);

  const sizeMb = file.size / 1_000_000;
  const entropy = calculateEntropy(data);
  const strings = extractStrings(data);
  const stringCount = strings.length;
  const suspiciousCount = countSuspiciousKeywords(strings);

  // Normalize features (same as your Python code)
  const normalized = [
    Math.min(sizeMb / 10, 1),           // normalize size
    Math.min(entropy / 8, 1),            // normalize entropy
    Math.min(stringCount / 2000, 1),     // normalize string count
    Math.min(suspiciousCount / 50, 1),   // normalize suspicious words
  ];

  return {
    sizeMb,
    entropy,
    stringCount,
    suspiciousCount,
    normalized,
  };
}

// Run YARA-like signature scan
export async function yaraSignatureScan(file: File): Promise<YaraMatch[]> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  
  // Convert to string for pattern matching
  let textContent = '';
  try {
    textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
  } catch {
    // Binary file - extract strings instead
    const strings = extractStrings(data);
    textContent = strings.join('\n');
  }

  const matches: YaraMatch[] = [];

  for (const signature of MALWARE_SIGNATURES) {
    const found = textContent.match(signature.pattern);
    if (found && found.length > 0) {
      matches.push({
        rule: signature.rule,
        metadata: { ...signature.metadata, matches: String(found.length) },
      });
    }
  }

  return matches;
}

// Simulate autoencoder anomaly scoring
// In a real implementation, this would use TensorFlow.js with your trained model
export function calculateAnomalyScore(features: FeatureVector): number {
  const input = features.normalized;
  
  // Simulate autoencoder reconstruction
  // Using typical benign file characteristics as "learned" representation
  const benignProfile = [0.2, 0.625, 0.2, 0.04]; // Typical benign: 2MB, entropy 5, 400 strings, 2 suspicious
  
  // Calculate Mean Squared Error (reconstruction error)
  let mse = 0;
  for (let i = 0; i < input.length; i++) {
    mse += Math.pow(input[i] - benignProfile[i], 2);
  }
  mse /= input.length;

  // Add variance based on suspicious indicators
  if (features.suspiciousCount > 5) {
    mse += 0.01 * (features.suspiciousCount / 10);
  }
  if (features.entropy > 7) {
    mse += 0.005 * ((features.entropy - 7) / 1);
  }

  return mse;
}

// Determine final verdict
export function determineVerdict(yaraMatches: YaraMatch[], anomalyScore: number): 'Malicious' | 'Suspicious' | 'Clean' {
  if (yaraMatches.length > 0) {
    return 'Malicious';
  }
  if (anomalyScore > THRESHOLD) {
    return 'Suspicious';
  }
  return 'Clean';
}

// Main analysis function
export async function analyzeFile(file: File): Promise<MalwareReport> {
  // Calculate hash
  const hash = await calculateHash(file);

  // Run YARA signature scan
  const yaraMatches = await yaraSignatureScan(file);

  // Extract features
  const features = await extractFeatures(file);

  // Calculate anomaly score
  const anomalyScore = calculateAnomalyScore(features);

  // Determine verdict
  const finalVerdict = determineVerdict(yaraMatches, anomalyScore);

  return {
    hash,
    yaraMatches,
    anomalyScore,
    modelThreshold: THRESHOLD,
    federatedModelVersion: 'v1.0-client',
    finalVerdict,
    features,
  };
}
