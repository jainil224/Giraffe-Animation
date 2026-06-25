import React from "react";
import { motion } from "framer-motion";

interface SquashHamburgerProps {
  isOpen: boolean;
  onClick?: () => void;
}

export const SquashHamburger: React.FC<SquashHamburgerProps> = ({ isOpen, onClick }) => {
  const transition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 20
  };

  return (
    <div
      onClick={onClick}
      className="w-[15px] sm:w-[18px] h-[10px] sm:h-[12px] relative flex flex-col justify-between cursor-pointer focus:outline-none pointer-events-none"
      id="hamburger-btn"
    >
      {/* Top Bar */}
      <motion.span
        animate={
          isOpen
            ? { top: "50%", y: "-50%", rotate: 45 }
            : { top: "0%", y: 0, rotate: 0 }
        }
        transition={transition}
        className="absolute left-0 w-full h-[1.2px] sm:h-[1.5px] bg-white rounded-full origin-center"
      />

      {/* Middle Bar */}
      <motion.span
        animate={
          isOpen
            ? { top: "50%", y: "-50%", opacity: 0, scale: 0 }
            : { top: "50%", y: "-50%", opacity: 1, scale: 1 }
        }
        transition={transition}
        className="absolute left-0 w-full h-[1.2px] sm:h-[1.5px] bg-white rounded-full origin-center"
      />

      {/* Bottom Bar */}
      <motion.span
        animate={
          isOpen
            ? { bottom: "50%", y: "50%", rotate: -45 }
            : { bottom: "0%", y: 0, rotate: 0 }
        }
        transition={transition}
        className="absolute left-0 w-full h-[1.2px] sm:h-[1.5px] bg-white rounded-full origin-center"
      />
    </div>
  );
};
