import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SynapseXLogo } from "./SynapseXLogo";
import { SquashHamburger } from "./SquashHamburger";
import { ScrambleText } from "./ScrambleText";

interface NavbarProps {
  entranceComplete: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ entranceComplete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<"about" | "metrics" | null>(null);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu if transitioning to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  const scrollToY = (y: number) => {
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
    setIsMenuOpen(false);
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 350,
    damping: 28
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 z-50 px-4 sm:px-6 md:px-8 flex items-center pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left Group: Logo & Menu Capsule */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial mr-4">
          
          {/* Logo Pill */}
          <motion.div
            animate={isMenuOpen && isMobile ? "open" : "closed"}
            variants={{
              closed: {
                width: "auto",
                opacity: 1,
                paddingLeft: isMobile ? 12 : 20,
                paddingRight: isMobile ? 12 : 20,
                display: "flex",
                transition: springTransition
              },
              open: {
                width: 0,
                opacity: 0,
                paddingLeft: 0,
                paddingRight: 0,
                transition: springTransition,
                transitionEnd: {
                  display: "none"
                }
              }
            }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.22)" }}
            whileTap={{ scale: 0.98 }}
            className="h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] items-center gap-1.5 sm:gap-2 text-white cursor-pointer select-none overflow-hidden shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            id="logo-pill"
          >
            <SynapseXLogo className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white shrink-0" />
            <span className="font-medium tracking-tight text-[13px] sm:text-[16px] whitespace-nowrap">
              SynapseX
            </span>
          </motion.div>

          {/* Expanding Menu Pill */}
          <motion.div
            onClick={() => {
              if (!isMenuOpen) {
                setIsMenuOpen(true);
              }
            }}
            animate={isMenuOpen ? "open" : "closed"}
            variants={{
              closed: {
                width: isMobile ? 36 : 48,
                transition: springTransition
              },
              open: {
                width: isMobile ? "100%" : 290,
                transition: springTransition
              }
            }}
            className="h-9 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-white/15 backdrop-blur-md flex items-center overflow-hidden shrink-0 cursor-pointer pointer-events-auto"
            id="menu-capsule"
          >
            {/* Hamburger Button */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                closed: {
                  width: isMobile ? 36 : 48,
                  height: isMobile ? 36 : 48,
                  borderRadius: isMobile ? 10 : 14,
                  backgroundColor: "rgba(255,255,255,0)",
                  marginLeft: 0,
                  transition: springTransition
                },
                open: {
                  width: isMobile ? 28 : 36,
                  height: isMobile ? 28 : 36,
                  borderRadius: isMobile ? 8 : 11,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  marginLeft: isMobile ? 4 : 6, // ml-1 (4px) or ml-1.5 (6px)
                  transition: springTransition
                }
              }}
              className="flex items-center justify-center text-white focus:outline-none shrink-0 cursor-pointer pointer-events-auto"
              id="menu-hamburger-btn"
            >
              <SquashHamburger isOpen={isMenuOpen} />
            </motion.div>

            {/* Nav Links */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center gap-4 sm:gap-6 ml-4 sm:ml-6 pr-4 sm:pr-6 text-white shrink-0 text-[13px] sm:text-[16px]"
                >
                  <button
                    onClick={() => scrollToY(window.innerHeight)}
                    onMouseEnter={() => setHoveredLink("about")}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="font-normal text-white/85 hover:text-white transition-colors duration-200 focus:outline-none whitespace-nowrap"
                    id="link-about"
                  >
                    <ScrambleText text="About" isHovered={hoveredLink === "about"} />
                  </button>
                  <button
                    onClick={() => scrollToY(window.innerHeight * 2)}
                    onMouseEnter={() => setHoveredLink("metrics")}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="font-normal text-white/85 hover:text-white transition-colors duration-200 focus:outline-none whitespace-nowrap"
                    id="link-metrics"
                  >
                    <ScrambleText text="Metrics" isHovered={hoveredLink === "metrics"} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right: Download Button */}
        <motion.div
          animate={isMenuOpen && isMobile ? "open" : "closed"}
          variants={{
            closed: {
              width: "auto",
              opacity: 1,
              scale: 1,
              display: "block",
              transition: springTransition
            },
            open: {
              width: 0,
              opacity: 0,
              scale: 0.8,
              transition: springTransition,
              transitionEnd: {
                display: "none"
              }
            }
          }}
        >
          <motion.button
            onMouseEnter={() => setIsDownloadHovered(true)}
            onMouseLeave={() => setIsDownloadHovered(false)}
            onClick={() => alert("Downloading SynapseX Installer...")}
            whileHover={{ scale: 1.03, backgroundColor: "#e2e2e6" }}
            whileTap={{ scale: 0.97 }}
            className="h-9 sm:h-12 px-3.5 sm:px-6 bg-white text-black rounded-full flex items-center gap-1.5 sm:gap-2 font-medium text-[13px] sm:text-[16px] whitespace-nowrap cursor-pointer focus:outline-none transition-colors duration-200"
            id="download-btn"
          >
            <i className="bi bi-apple text-[14px] sm:text-[18px] leading-none"></i>
            <ScrambleText text="Download" isHovered={isDownloadHovered} />
          </motion.button>
        </motion.div>

      </div>
    </motion.header>
  );
};
