import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
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
  const [isSending, setIsSending] = useState(false);

  const webhookUrl =
    "https://yeswanthvuddagiri.app.n8n.cloud/webhook-test/ats-resume";

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
        return prev + 10;
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
      toast.error("Only PDF/DOC/DOCX allowed");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && acceptedTypes.includes(file.type)) {
      setUploadedFile(file);
      simulateUpload();
    } else {
      toast.error("Only PDF/DOC/DOCX allowed");
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.role &&
    formData.skills;

  // ✅ CORRECT WEBHOOK SEND (multipart/form-data)
  const sendToWebhook = async () => {
    if (!uploadedFile || !isFormValid) {
      toast.error("Complete all fields and upload resume");
      return;
    }

    setIsSending(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("role", formData.role);
      payload.append("skills", formData.skills);
      payload.append("resume", uploadedFile); // 🔥 CRITICAL

      await fetch(webhookUrl, {
        method: "POST",
        body: payload, // ❌ no headers
      });

      toast.success("ATS check submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setIsSending(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsComplete(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* FORM */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        {["name", "email", "role", "skills"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.toUpperCase()}
            value={(formData as any)[field]}
            onChange={handleFormChange}
            className={inputClasses}
            required
          />
        ))}
      </div>

      {/* UPLOAD */}
      <AnimatePresence>
        {!uploadedFile ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`glass-card flex flex-col items-center justify-center min-h-[250px] rounded-2xl cursor-pointer ${
              isDragging ? "border-primary" : ""
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              hidden
            />
            <Upload className="w-10 h-10 mb-4" />
            <p>Drag & drop resume or click to upload</p>
          </label>
        ) : (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <FileText />
              <span>{uploadedFile.name}</span>
              <button onClick={resetUpload}>
                <X />
              </button>
            </div>

            {isUploading && (
              <div className="mt-4">
                Uploading... {uploadProgress}%
              </div>
            )}

            {isComplete && (
              <button
                onClick={sendToWebhook}
                disabled={isSending}
                className="mt-6 w-full py-3 rounded-xl bg-primary text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin inline" /> Checking ATS...
                  </>
                ) : (
                  <>
                    <Send /> Check ATS Score
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
