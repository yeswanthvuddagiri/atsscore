import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Loader2, 
  Target, 
  TrendingUp, 
  AlertCircle,
  User,
  Mail,
  Briefcase,
  Code,
  FileCheck,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface ATSResult {
  score?: number;
  ats_score?: number;
  match_percentage?: number;
  feedback?: string;
  suggestions?: string[];
  missing_keywords?: string[];
  matched_keywords?: string[];
  summary?: string;
  [key: string]: unknown;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  skills: string;
}

const WEBHOOK_URL = "https://yeswanthvuddagiri.app.n8n.cloud/webhook/ats-resume";

const FileUploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    skills: "",
  });

  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsComplete(true);
          return 100;
        }
        return prev + Math.random() * 20 + 10;
      });
    }, 120);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && acceptedTypes.includes(file.type)) {
      setUploadedFile(file);
      simulateUpload();
    } else {
      toast.error("Please upload a PDF, DOC, or DOCX file");
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && acceptedTypes.includes(file.type)) {
      setUploadedFile(file);
      simulateUpload();
    } else if (file) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
    }
  }, []);

  const isFormValid = formData.name && formData.email && formData.role && formData.skills;

  const sendToWebhook = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a resume file");
      return;
    }

    if (!isFormValid) {
      toast.error("Please fill in all form fields");
      return;
    }

    setIsSendingToWebhook(true);
    setAtsResult(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("name", formData.name);
      formDataPayload.append("email", formData.email);
      formDataPayload.append("role", formData.role);
      formDataPayload.append("skills", formData.skills);
      formDataPayload.append("resume", uploadedFile);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formDataPayload,
      });

      const data = await response.json();
      setAtsResult(data);
      setIsSubmitted(true);
      toast.success("ATS analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsSendingToWebhook(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsComplete(false);
    setAtsResult(null);
    setIsSubmitted(false);
  };

  const resetAll = () => {
    resetUpload();
    setFormData({ name: "", email: "", role: "", skills: "" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 via-emerald-500/10 to-transparent";
    if (score >= 60) return "from-amber-500/20 via-amber-500/10 to-transparent";
    return "from-red-500/20 via-red-500/10 to-transparent";
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return "ring-emerald-500/30";
    if (score >= 60) return "ring-amber-500/30";
    return "ring-red-500/30";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formFields = [
    { name: "name", label: "Full Name", placeholder: "John Doe", icon: User, type: "text" },
    { name: "email", label: "Email Address", placeholder: "john@example.com", icon: Mail, type: "email" },
    { name: "role", label: "Target Job Role", placeholder: "Senior Software Engineer", icon: Briefcase, type: "text" },
    { name: "skills", label: "Skills (comma separated)", placeholder: "React, TypeScript, Node.js, Python", icon: Code, type: "text" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Form Fields Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card-hover rounded-3xl p-6 md:p-8 relative overflow-hidden"
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 rounded-3xl gradient-border" />
        
        {/* Header */}
        <div className="relative z-10 mb-6">
          <h2 className="text-xl font-semibold text-foreground font-display flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Your Details
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Fill in your information for personalized analysis</p>
        </div>

        {/* Form grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={field.name === "skills" ? "md:col-span-2" : ""}
            >
              <label className="block text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2">
                <field.icon className="w-4 h-4 text-primary/70" />
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof FormData]}
                onChange={handleFormChange}
                required
                className="neumorphic-input w-full"
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* File Upload Zone */}
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.label
            key="upload-zone"
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center
              min-h-[300px] p-8 rounded-3xl cursor-pointer
              glass-card-hover overflow-hidden
              transition-all duration-500
              ${isDragging ? "glow-primary scale-[1.02] border-primary/40" : "hover:border-primary/20"}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl gradient-border" />

            {/* Shimmer effect on drag */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
            )}

            {/* Decorative sparkles */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-8 right-8"
            >
              <Sparkles className="w-6 h-6 text-primary/40" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-8 left-8"
            >
              <Sparkles className="w-5 h-5 text-secondary/40" />
            </motion.div>

            <input
              id="file-upload"
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />

            <motion.div
              animate={isDragging ? { scale: 1.15, y: -15, rotate: 5 } : { scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative mb-6"
            >
              <motion.div
                animate={isDragging ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Upload className="w-12 h-12 text-background" />
              </motion.div>

              {/* Animated rings */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
              />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-2xl border-2 border-primary/20"
              />
            </motion.div>

            <motion.h3
              className="text-2xl font-bold text-foreground mb-3 font-display text-center"
              animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            >
              {isDragging ? "Drop your resume here! ✨" : "Upload Your Resume"}
            </motion.h3>

            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Drag & drop your file here, or{" "}
              <span className="text-primary font-semibold hover:underline">browse files</span>
            </p>

            <div className="flex gap-3 flex-wrap justify-center">
              {["PDF", "DOC", "DOCX"].map((type, i) => (
                <motion.span
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-muted/80 text-muted-foreground border border-border/50"
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-hover rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 rounded-3xl gradient-border" />

            {/* Success particles */}
            {isComplete && !atsResult && !isSendingToWebhook && (
              <>
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.5,
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 300,
                    }}
                    transition={{ duration: 1.2, delay: i * 0.03 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: i % 3 === 0 
                        ? "hsl(var(--primary))" 
                        : i % 3 === 1
                        ? "hsl(var(--secondary))"
                        : "hsl(var(--accent))",
                    }}
                  />
                ))}
              </>
            )}

            {/* File info */}
            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center flex-shrink-0 border border-primary/20"
              >
                <FileText className="w-8 h-8 text-primary" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate text-lg">
                  {uploadedFile.name}
                </h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </motion.div>
              )}

              <motion.button
                onClick={resetUpload}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Progress bar */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 relative z-10"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Processing...</span>
                  <span className="text-primary font-semibold">
                    {Math.min(100, Math.round(uploadProgress))}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, uploadProgress)}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Ready to submit */}
            {isComplete && !atsResult && !isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 relative z-10 space-y-4"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Resume uploaded successfully!</span>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={sendToWebhook}
                  disabled={isSendingToWebhook || !isFormValid}
                  whileHover={!isSendingToWebhook && isFormValid ? { scale: 1.02 } : {}}
                  whileTap={!isSendingToWebhook && isFormValid ? { scale: 0.98 } : {}}
                  className={`
                    cta-button w-full flex items-center justify-center gap-3 text-lg
                    ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSendingToWebhook ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing Your Resume...
                      </>
                    ) : (
                      <>
                        Check My ATS Score
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </motion.button>

                {!isFormValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-amber-400 text-center flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Please complete all fields above
                  </motion.p>
                )}

                <button
                  onClick={resetUpload}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Choose a different file
                </button>
              </motion.div>
            )}

            {/* Loading state while analyzing */}
            {isSendingToWebhook && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 relative z-10"
              >
                <div className="flex flex-col items-center gap-4 py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
                  />
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">Analyzing your resume...</p>
                    <p className="text-sm text-muted-foreground mt-1">Our AI is checking ATS compatibility</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ATS Results Display */}
            {atsResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 relative z-10 space-y-5"
              >
                {/* Score Display */}
                {(atsResult.score !== undefined || atsResult.ats_score !== undefined || atsResult.match_percentage !== undefined) && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`rounded-2xl bg-gradient-to-br ${getScoreBg(atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage ?? 0)} p-8 text-center ring-2 ${getScoreRing(atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage ?? 0)}`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Your ATS Score</span>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className={`text-6xl md:text-7xl font-bold ${getScoreColor(atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage ?? 0)} font-display`}
                    >
                      {atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage}%
                    </motion.div>
                  </motion.div>
                )}

                {/* Summary/Feedback */}
                {(atsResult.summary || atsResult.feedback) && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-muted/30 p-5 border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Analysis Summary</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {atsResult.summary || atsResult.feedback}
                    </p>
                  </motion.div>
                )}

                {/* Matched Keywords */}
                {atsResult.matched_keywords && atsResult.matched_keywords.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-semibold text-emerald-400">Matched Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.matched_keywords.map((keyword, i) => (
                        <motion.span 
                          key={i} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Missing Keywords */}
                {atsResult.missing_keywords && atsResult.missing_keywords.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl bg-red-500/10 p-5 border border-red-500/20"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="font-semibold text-red-400">Missing Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.missing_keywords.map((keyword, i) => (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className="px-3 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Suggestions */}
                {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-2xl bg-muted/30 p-5 border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Improvement Suggestions</span>
                    </div>
                    <ul className="space-y-2">
                      {atsResult.suggestions.map((suggestion, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Raw JSON fallback */}
                {!atsResult.score && !atsResult.ats_score && !atsResult.match_percentage && !atsResult.summary && !atsResult.feedback && (
                  <div className="rounded-2xl bg-muted/30 p-5 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">Response Data</span>
                    </div>
                    <pre className="text-sm text-muted-foreground overflow-auto max-h-48 whitespace-pre-wrap bg-background/50 rounded-xl p-4">
                      {JSON.stringify(atsResult, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Reset button */}
                <motion.button
                  onClick={resetAll}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 text-foreground font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Analyze Another Resume
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUploadZone;