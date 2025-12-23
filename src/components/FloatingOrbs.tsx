import { motion } from "framer-motion";

const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full animate-float-delayed"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary) / 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
};

export default FloatingOrbs;
