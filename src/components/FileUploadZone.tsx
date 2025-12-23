import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, X, Sparkles, Send, Loader2, Target, TrendingUp, AlertCircle } from "lucide-react";

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
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  role: string;
  skills: string;
}

const FileUploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [webhookUrl] = useState("https://yeswanthvuddagiri.app.n8n.cloud/webhook-test/ats-resume");
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
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

  const simulateUpload = (file: File) => {
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
        return prev + Math.random() * 15;
      });
    }, 150);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && acceptedTypes.includes(file.type)) {
      setUploadedFile(file);
      simulateUpload(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && acceptedTypes.includes(file.type)) {
      setUploadedFile(file);
      simulateUpload(file);
    }
  }, []);

  const isFormValid = formData.name && formData.email && formData.role && formData.skills;

  const sendToWebhook = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
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

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formDataPayload,
      });

      const data = await response.json();
      setAtsResult(data);
      toast.success("ATS analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to get ATS results");
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
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5";
    if (score >= 60) return "from-yellow-500/20 to-yellow-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Form Fields */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 rounded-2xl gradient-border" />
        <div className="relative z-10 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className={inputClasses}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className={inputClasses}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Target Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              required
              className={inputClasses}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleFormChange}
              required
              className={inputClasses}
              placeholder="e.g., React, TypeScript, Node.js"
            />
          </div>
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
              min-h-[280px] p-8 rounded-2xl cursor-pointer
              glass-card overflow-hidden
              transition-all duration-300
              ${isDragging ? "glow-primary scale-[1.02]" : "hover:border-primary/30"}
            `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl gradient-border" />

            {/* Shimmer effect on drag */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
            )}

            <input
              id="file-upload"
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />

            <motion.div
              animate={isDragging ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: isDragging ? 360 : 0 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6"
              >
                <Upload className="w-10 h-10 text-background" />
              </motion.div>

              {/* Floating sparkles */}
              <motion.div
                animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </motion.div>

            <motion.h3
              className="text-xl font-semibold text-foreground mb-2"
              animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            >
              {isDragging ? "Drop it like it's hot! 🔥" : "Upload Resume (PDF/DOCX)"}
            </motion.h3>

            <p className="text-muted-foreground text-center mb-4">
              Drag & drop your file here, or{" "}
              <span className="text-primary font-medium">browse</span>
            </p>

            <div className="flex gap-2 flex-wrap justify-center">
              {["PDF", "DOC", "DOCX"].map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {type}
                </span>
              ))}
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl gradient-border" />

            {/* Success particles */}
            {isComplete && !atsResult && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                    }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: i % 2 === 0 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--secondary))",
                    }}
                  />
                ))}
              </>
            )}

            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0"
              >
                <FileText className="w-8 h-8 text-primary" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {uploadedFile.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
              )}

              <motion.button
                onClick={resetUpload}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-muted transition-colors"
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
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-primary font-medium">
                    {Math.min(100, Math.round(uploadProgress))}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, uploadProgress)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </motion.div>
            )}

            {isComplete && !atsResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 relative z-10"
              >
                <p className="text-primary font-medium text-center mb-4">
                  ✨ Resume uploaded successfully!
                </p>
                
                <motion.button
                  onClick={sendToWebhook}
                  disabled={isSendingToWebhook || !webhookUrl || !isFormValid}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-3 px-6 rounded-xl font-medium
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${webhookUrl && isFormValid
                      ? "bg-gradient-to-r from-primary to-secondary text-background hover:shadow-lg hover:shadow-primary/25" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"}
                  `}
                >
                  {isSendingToWebhook ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking ATS Score...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Check ATS Score
                    </>
                  )}
                </motion.button>

                {!isFormValid && (
                  <p className="text-xs text-amber-500 text-center mt-2">
                    Please fill in all form fields above
                  </p>
                )}

                <button
                  onClick={resetUpload}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Upload another file
                </button>
              </motion.div>
            )}

            {/* ATS Results Display */}
            {atsResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 relative z-10 space-y-4"
              >
                {/* Score Display */}
                {(atsResult.score !== undefined || atsResult.ats_score !== undefined || atsResult.match_percentage !== undefined) && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`rounded-xl bg-gradient-to-br ${getScoreBg(atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage ?? 0)} p-6 text-center`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage ?? 0)}`}>
                      {atsResult.score ?? atsResult.ats_score ?? atsResult.match_percentage}%
                    </div>
                  </motion.div>
                )}

                {/* Summary/Feedback */}
                {(atsResult.summary || atsResult.feedback) && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {atsResult.summary || atsResult.feedback}
                    </p>
                  </div>
                )}

                {/* Matched Keywords */}
                {atsResult.matched_keywords && atsResult.matched_keywords.length > 0 && (
                  <div className="rounded-xl bg-green-500/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Matched Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.matched_keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {atsResult.missing_keywords && atsResult.missing_keywords.length > 0 && (
                  <div className="rounded-xl bg-red-500/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">Missing Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.missing_keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Suggestions</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {atsResult.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Raw JSON fallback for unknown response structure */}
                {!atsResult.score && !atsResult.ats_score && !atsResult.match_percentage && !atsResult.summary && !atsResult.feedback && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Response</span>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-auto max-h-48 whitespace-pre-wrap">
                      {JSON.stringify(atsResult, null, 2)}
                    </pre>
                  </div>
                )}

                <button
                  onClick={resetUpload}
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Upload another resume
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUploadZone;  
