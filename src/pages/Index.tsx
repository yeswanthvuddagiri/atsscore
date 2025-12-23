import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, FileSearch, CheckCircle, Clock } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import FileUploadZone from "@/components/FileUploadZone";

const Index = () => {
  const features = [
    { icon: Zap, text: "Instant Analysis", description: "Get results in seconds" },
    { icon: Shield, text: "100% Private", description: "Your data stays secure" },
    { icon: FileSearch, text: "AI-Powered", description: "Advanced ATS detection" },
  ];

  const stats = [
    { value: "50K+", label: "Resumes Analyzed" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "2s", label: "Average Time" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden hero-gradient">
      <FloatingOrbs />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-14"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary tracking-wide">
              AI-Powered Resume Analysis
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-display tracking-tight"
          >
            <span className="text-foreground">AI-Powered</span>
            <br />
            <span className="gradient-text">ATS Resume Score</span>
            <br />
            <span className="text-foreground">Checker</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume and instantly get your ATS compatibility score.
            <br className="hidden md:block" />
            <span className="text-foreground/80">Optimize for recruiters. Land more interviews.</span>
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Upload Zone */}
        <FileUploadZone />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card-hover rounded-2xl p-6 text-center group"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-glow-sm transition-shadow duration-300"
              >
                <feature.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-foreground mb-1">{feature.text}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center mt-16 md:mt-20 space-y-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Trusted by recruiters & job seekers worldwide</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>Results in seconds</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Shield className="w-3 h-3" />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="hidden lg:block absolute left-6 top-1/4"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card px-4 py-3 rounded-xl"
          >
            <p className="text-sm font-medium text-foreground">📄 PDF, DOC</p>
            <p className="text-xs text-muted-foreground">Supported formats</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 }}
          className="hidden lg:block absolute right-6 top-1/3"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="glass-card px-4 py-3 rounded-xl"
          >
            <p className="text-sm font-medium text-foreground">🔒 Encrypted</p>
            <p className="text-xs text-muted-foreground">256-bit SSL</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8 }}
          className="hidden lg:block absolute right-10 bottom-1/4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass-card px-4 py-3 rounded-xl"
          >
            <p className="text-sm font-medium text-foreground">⚡ Instant</p>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;