import { motion } from "framer-motion";
import { Sparkles, Zap, Shield } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import FileUploadZone from "@/components/FileUploadZone";

const Index = () => {
  const features = [
    { icon: Zap, text: "Instant Processing" },
    { icon: Shield, text: "Secure & Private" },
    { icon: Sparkles, text: "AI-Powered Analysis" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingOrbs />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              ATS Resume Checker
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-foreground">ATS Resume</span>
            <br />
            <span className="gradient-text">Checker</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Check your resume's ATS compatibility. Get instant feedback and improve your chances of getting noticed.
          </motion.p>
        </motion.div>

        {/* Upload Zone */}
        <FileUploadZone />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12 md:mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/40 backdrop-blur-sm border border-foreground/5"
            >
              <feature.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-16 md:mt-20"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Trusted by</span>
            <span className="font-semibold text-foreground">10,000+</span>
            <span>professionals worldwide</span>
          </div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="hidden lg:block absolute left-8 top-1/3"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="glass-card px-4 py-3 rounded-xl"
          >
            <p className="text-sm font-medium text-foreground">📄 PDF</p>
            <p className="text-xs text-muted-foreground">Supported</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="hidden lg:block absolute right-8 top-1/2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="glass-card px-4 py-3 rounded-xl"
          >
            <p className="text-sm font-medium text-foreground">🔒 Encrypted</p>
            <p className="text-xs text-muted-foreground">256-bit SSL</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
