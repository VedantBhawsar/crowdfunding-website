"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  enabled?: boolean;
}

export function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Use motion values for smoother cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Add spring physics for more natural movement - lower stiffness and damping for lazier movement
  const springConfig = { damping: 15, stiffness: 150, mass: 1.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Controls for additional animations
  const ringAnimation = useAnimation();
  const dotAnimation = useAnimation();

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if the element or its parents have cursor:pointer
      let target = e.target as HTMLElement;
      while (target) {
        const cursor = window.getComputedStyle(target).cursor;
        if (cursor === "pointer") {
          setIsHovering(true);
          return;
        }
        target = target.parentElement as HTMLElement;
        if (!target) break;
      }
      setIsHovering(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      
      // Animate the dot on click
      dotAnimation.start({
        scale: 0.9,
        backgroundColor: "rgba(20, 47, 50, 0.3)",
        transition: { duration: 0.3, ease: "easeOut" }
      });
      
      // Animate the ring on click
      ringAnimation.start({
        scale: 1.5,
        opacity: 0.5,
        transition: { duration: 0.4, ease: "easeOut" }
      });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      
      // Reset animations
      dotAnimation.start({
        scale: isHovering ? 1.2 : 1,
        backgroundColor: isHovering ? "rgba(20, 47, 50, 0.2)" : "rgba(20, 47, 50, 0.1)",
        transition: { duration: 0.3, ease: "easeOut" }
      });
      
      ringAnimation.start({
        scale: isHovering ? 1.3 : 1,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, isHovering, cursorX, cursorY, dotAnimation, ringAnimation]);

  // Update animations when hover state changes
  useEffect(() => {
    if (isHovering) {
      ringAnimation.start({
        scale: 1.3,
        borderColor: "rgba(20, 47, 50, 0.8)",
        borderWidth: "3px",
        transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 }
      });
      
      dotAnimation.start({
        scale: 1.2,
        backgroundColor: "rgba(20, 47, 50, 0.2)",
        transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 }
      });
    } else {
      ringAnimation.start({
        scale: 1,
        borderColor: "rgba(20, 47, 50, 0.6)",
        borderWidth: "2px",
        transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 }
      });
      
      dotAnimation.start({
        scale: 1,
        backgroundColor: "rgba(20, 47, 50, 0.1)",
        transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 }
      });
    }
  }, [isHovering, ringAnimation, dotAnimation]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-50 w-4 h-4 rounded-full"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={dotAnimation}
        initial={{ scale: 1, backgroundColor: "rgba(20, 47, 50, 0.1)" }}
      />

      {/* Main cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-50 w-10 h-10 rounded-full border-2 border-primary"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(20, 47, 50, 0.6)",
        }}
        animate={ringAnimation}
        initial={{ scale: 1 }}
      />

      {/* Trailing effect */}
      <motion.div
        className="fixed pointer-events-none z-40 w-20 h-20 rounded-full"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.4, 0.8],
          opacity: [0.4, 0.2, 0],
        }}
        transition={{
          duration: 2.5,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="w-full h-full rounded-full border border-primary opacity-50" />
      </motion.div>
      
      {/* Additional trailing effect for more lazy feel */}
      <motion.div
        className="fixed pointer-events-none z-30 rounded-full"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ width: 30, height: 30, opacity: 0 }}
        animate={{
          width: [30, 60, 30],
          height: [30, 60, 30],
          opacity: [0.3, 0.1, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.2,
        }}
      >
        <div className="w-full h-full rounded-full bg-primary/10" />
      </motion.div>

      {/* Click ripple effect - only shows when clicking */}
      {isClicking && (
        <motion.div
          className="fixed pointer-events-none z-40 rounded-full border-2 border-primary"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 10, height: 10, opacity: 0.8 }}
          animate={{ 
            width: 80, 
            height: 80, 
            opacity: 0,
            borderColor: "rgba(20, 47, 50, 0.3)"
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </>
  );
} 