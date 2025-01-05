import { AnimatePresence, motion } from "framer-motion";

export function HeaderText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div className="text-center mb-10">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-primary tracking-wide mb-2"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg text-foreground max-w-2xl mx-auto font-semibold tracking-wide"
        >
          {description}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
