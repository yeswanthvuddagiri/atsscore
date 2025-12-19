import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, X, Sparkles, Link, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
}

const FileUploadZone = ({ onFileUpload }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);

  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

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
          onFileUpload(file);
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

  const sendToWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setIsSendingToWebhook(true);
    setWebhookResponse(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(",")[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(uploadedFile);
      const base64Content = await base64Promise;

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          fileSize: uploadedFile.size,
          fileContent: base64Content,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      // Since we're using no-cors, we won't get a proper response
      toast.success("Request sent to webhook!", {
        description: "Check your webhook's history to confirm it was received.",
      });

      setWebhookResponse(`
        <div style="padding: 20px; text-align: center;">
          <h3 style="color: #10b981;">✓ Webhook Triggered Successfully</h3>
          <p>File: ${uploadedFile.name}</p>
          <p>Size: ${formatFileSize(uploadedFile.size)}</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      `);
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast.error("Failed to send to webhook", {
        description: "Please check the URL and try again.",
      });
    } finally {
      setIsSendingToWebhook(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsComplete(false);
    setWebhookResponse(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Webhook URL Input */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="glass-card rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 rounded-xl gradient-border" />
          <div className="flex items-center gap-3">
            <Link className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter your webhook URL (e.g., n8n, Zapier)"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>
      </motion.div>

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
              min-h-[320px] p-8 rounded-2xl cursor-pointer
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
              {isDragging ? "Drop it like it's hot! 🔥" : "Upload your resume"}
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
            {isComplete && !webhookResponse && (
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

            <div className="flex items-center gap-4">
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
                className="mt-6"
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

            {isComplete && !webhookResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <p className="text-primary font-medium text-center mb-4">
                  ✨ Resume uploaded successfully!
                </p>
                
                {/* Send to Webhook Button */}
                <motion.button
                  onClick={sendToWebhook}
                  disabled={isSendingToWebhook || !webhookUrl}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-3 px-6 rounded-xl font-medium
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${webhookUrl 
                      ? "bg-gradient-to-r from-primary to-secondary text-background hover:shadow-lg hover:shadow-primary/25" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"}
                  `}
                >
                  {isSendingToWebhook ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending to Webhook...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send to Webhook
                    </>
                  )}
                </motion.button>

                {!webhookUrl && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Enter a webhook URL above to enable sending
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

            {/* Webhook Response Display */}
            {webhookResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <div 
                  className="rounded-xl bg-muted/50 p-4 overflow-auto max-h-64"
                  dangerouslySetInnerHTML={{ __html: webhookResponse }}
                />
                <button
                  onClick={resetUpload}
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Upload another file
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
