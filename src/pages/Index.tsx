import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Lock, Zap, Network, FileSearch, ArrowRight, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-security.jpg';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-apple-blue/10 text-apple-blue px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              <Shield className="w-4 h-4" />
              <span>Advanced Threat Detection</span>
            </div>

            {/* Headline */}
            <h1 
              className="text-5xl md:text-7xl font-bold text-foreground leading-tight opacity-0 animate-fade-in-up"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              Detect Malware with{' '}
              <span className="gradient-text">AI Precision</span>
            </h1>

            {/* Subheadline */}
            <p 
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Hybrid detection combining signature matching with deep learning anomaly detection. 
              Powered by federated learning for privacy-preserving security.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              <Link to="/analyze">
                <Button variant="hero" size="xl" className="gap-2">
                  Start Scanning
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#technology">
                <Button variant="glass" size="xl" className="gap-2">
                  Learn More
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto opacity-0 animate-fade-in-up"
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">99.5%</div>
                <div className="text-sm text-muted-foreground">Detection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">&lt;2s</div>
                <div className="text-sm text-muted-foreground">Scan Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">0%</div>
                <div className="text-sm text-muted-foreground">Data Stored</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Protection
            </h2>
            <p className="text-lg text-muted-foreground">
              Multi-layered security approach combining traditional and cutting-edge techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileSearch className="w-7 h-7 text-white" />}
              title="Signature Detection"
              description="RegEx-based pattern matching against comprehensive malware signature databases and SHA-256 hash comparisons."
              delay={0}
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7 text-white" />}
              title="Deep Autoencoder"
              description="Neural network trained on benign samples to detect unknown threats through reconstruction error analysis."
              delay={100}
            />
            <FeatureCard
              icon={<Network className="w-7 h-7 text-white" />}
              title="Federated Learning"
              description="Privacy-preserving collaborative model training. Your data never leaves your device."
              delay={200}
            />
            <FeatureCard
              icon={<Lock className="w-7 h-7 text-white" />}
              title="Sandboxed Analysis"
              description="Files are processed in complete isolation with no executable permissions to ensure system safety."
              delay={300}
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7 text-white" />}
              title="Real-time Results"
              description="Lightning-fast analysis with live progress tracking and detailed verdict explanations."
              delay={400}
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7 text-white" />}
              title="Zero Data Retention"
              description="Files are deleted immediately after analysis. Only metadata is logged for auditing purposes."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                How It Works
              </h2>
              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'File Upload & Hashing',
                    description: 'Files are securely uploaded and a SHA-256 hash is computed for signature matching.'
                  },
                  {
                    step: '02',
                    title: 'Signature Scanning',
                    description: 'Hash comparison against known malware database and RegEx pattern matching for suspicious strings.'
                  },
                  {
                    step: '03',
                    title: 'ML Analysis',
                    description: 'Deep Autoencoder extracts features (byte frequency, entropy) and computes reconstruction error.'
                  },
                  {
                    step: '04',
                    title: 'Verdict Generation',
                    description: 'Results are aggregated with confidence scores and detection method attribution.'
                  },
                ].map((item, index) => (
                  <div 
                    key={item.step}
                    className="flex gap-6 opacity-0 animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="gradient-blue text-white w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="glass-card rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">$</span>
                    <span className="text-foreground">analyze malware_sample.exe</span>
                  </div>
                  <div className="text-apple-blue">→ Computing SHA-256 hash...</div>
                  <div className="text-apple-blue">→ Scanning signature database...</div>
                  <div className="text-apple-blue">→ Running deep autoencoder...</div>
                  <div className="text-success">✓ Analysis complete</div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div><span className="text-muted-foreground">Verdict:</span> <span className="text-destructive font-semibold">MALICIOUS</span></div>
                    <div><span className="text-muted-foreground">Method:</span> Anomaly Detection</div>
                    <div><span className="text-muted-foreground">Confidence:</span> 94.7%</div>
                    <div><span className="text-muted-foreground">Details:</span> High entropy, suspicious API calls</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Secure Your Files?
            </h2>
            <p className="text-xl text-white/80">
              Upload a file now and experience enterprise-grade malware detection powered by cutting-edge AI.
            </p>
            <Link to="/analyze">
              <Button 
                size="xl" 
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start Free Scan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
