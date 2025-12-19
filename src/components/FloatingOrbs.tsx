import { motion } from "framer-motion";

const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />
      
      {/* Secondary orb */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-secondary/25 to-secondary/5 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ top: "50%", right: "10%" }}
      />
      
      {/* Accent orb */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{ bottom: "10%", left: "30%" }}
      />

      {/* Small floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/60"
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          style={{
            left: `${15 + i * 15}%`,
            top: `${60 + (i % 3) * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;
