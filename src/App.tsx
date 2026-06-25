import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { ScrambleIn } from "./components/ScrambleIn";
import { SynapseXLogo } from "./components/SynapseXLogo";

export default function App() {
  const [entranceComplete, setEntranceComplete] = useState(false);

  // Trigger entrance animation after 800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Video URL conversion helper (converts Cloudinary embed URLs to direct MP4 sources)
  const getDirectVideoUrl = (embedUrl: string) => {
    try {
      const url = new URL(embedUrl);
      const cloudName = url.searchParams.get("cloud_name");
      const publicId = url.searchParams.get("public_id");
      if (!cloudName || !publicId) return embedUrl;
      return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;
    } catch (e) {
      return embedUrl;
    }
  };

  // Video URLs
  const video1 = getDirectVideoUrl("https://player.cloudinary.com/embed/?cloud_name=dsn0ks2hl&public_id=Video_Object_Remover-1782327851413_atvftm");
  const video2 = getDirectVideoUrl("https://player.cloudinary.com/embed/?cloud_name=dsn0ks2hl&public_id=sky_object_jlopn0");
  const video3 = getDirectVideoUrl("https://player.cloudinary.com/embed/?cloud_name=dsn0ks2hl&public_id=Video_Object_Remover-1782390666054_lq9da4");
  const video4 = getDirectVideoUrl("https://player.cloudinary.com/embed/?cloud_name=dsn0ks2hl&public_id=Black_hole_rotating_with_galaxy_202606251821_pnxu13");
  const video5 = getDirectVideoUrl("https://player.cloudinary.com/embed/?cloud_name=dsn0ks2hl&public_id=Video_Object_Remover-1782395935800_auov3d");

  // SECTION 1: Mouse-scrubbed Hero Video controls
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = heroVideoRef.current;
      if (!video) return;

      const clientX = e.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const prevX = prevXRef.current;
      prevXRef.current = clientX;

      // Invert delta so the motion inside the video aligns with the physical mouse movement direction
      const delta = (prevX - clientX) / window.innerWidth;
      const duration = video.duration || 10;
      const SENSITIVITY = 0.8;
      const timeOffset = delta * SENSITIVITY * duration;

      let nextTime = targetTimeRef.current + timeOffset;
      if (nextTime < 0) nextTime = 0;
      if (nextTime > duration) nextTime = duration;

      targetTimeRef.current = nextTime;

      // If not currently seeking, perform the seek
      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = nextTime;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      prevXRef.current = e.clientX;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  const handleSeeked = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    // Chain seek if targetTime has diverged from currentTime by more than 0.01s
    if (Math.abs(targetTimeRef.current - video.currentTime) > 0.01) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  // SECTION 2: Scroll Hooks Setup for Cinematic Parallax 3D Text
  const { scrollY, scrollYProgress } = useScroll();
  
  // Ultra-smooth spring-interpolated scrollY for cinematic inertia
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
    restDelta: 0.01
  });

  // Parallax: maps smoothed scroll (0-1000px) to vertical translation (0 to -120px)
  const yScaleValue = useTransform(smoothScrollY, [0, 1000], [0, -120]);

  // Composite 3D transform using motion template
  const transform = useMotionTemplate`rotateX(24deg) translateY(${yScaleValue}px) translateZ(15px)`;

  // Fade in/out opacity based on normalized scroll progress through the page
  const cinematicOpacity = useTransform(scrollYProgress, [0.08, 0.22, 0.42, 0.65], [0, 1, 1, 0]);

  // SECTION 3: Metrics Grid Stagger Variants
  const metricsGridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const metricItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div 
      className="bg-black text-white overflow-x-hidden w-full relative min-h-screen select-none"
      style={{ fontFamily: '"Space Mono", monospace' }}
    >
      {/* Fixed z-50 Navbar */}
      <Navbar entranceComplete={entranceComplete} />

      {/* SECTION 1: HERO (full viewport) */}
      <section 
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between"
        id="hero-section"
      >
        {/* Paused, mouse-scrubbed Hero background video */}
        <video
          ref={heroVideoRef}
          onSeeked={handleSeeked}
          src={video1}
          preload="auto"
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
        />

        {/* Soft bottom-up dark gradient for text legibility, leaving the top of the video completely clear */}
        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-black/95 via-black/40 to-transparent z-[1] pointer-events-none" />

        {/* Large background watermark text */}
        <div 
          style={{
            fontFamily: '"Anton SC", sans-serif',
            fontSize: 'clamp(120px, 30vw, 521px)',
            letterSpacing: '-4px',
            backgroundImage: 'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[2] opacity-10 uppercase translate-y-[50px]"
        >
          TRANSCENDENCE
        </div>

        {/* Hero Content Container */}
        <div className="relative z-[3] w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-8 sm:pb-12 flex flex-col justify-between pointer-events-none">
          
          {/* Top Column: Brain and Body (smaller) */}
          <motion.div
            animate={{ opacity: entranceComplete ? 1 : 0 }}
            transition={{ duration: 1.0 }}
            className="flex flex-col gap-4 max-w-md pointer-events-auto"
          >
            <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(38px,8vw,72px)] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)]">
              <ScrambleIn text="Brain" delay={200} triggered={entranceComplete} />
              <br />
              <ScrambleIn text="And Body" delay={500} triggered={entranceComplete} />
            </h1>
          </motion.div>

          {/* Bottom Column: Description (left) and One Network (right) */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full pointer-events-none">
            
            {/* Description (Bottom Left) */}
            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={entranceComplete ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
              transition={{
                y: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1.0], delay: 0.2 },
                opacity: { duration: 0.9, ease: "easeOut", delay: 0.2 }
              }}
              className="max-w-sm text-[13px] sm:text-[15px] text-white/85 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] pointer-events-auto"
            >
              Built at the intersection of neuroscience and artificial intelligence. SynapseX continuously maps neural pathways, cognitive load, and physiological states into a single adaptive intelligence layer.
            </motion.p>

            {/* One Network (Bottom Right) */}
            <motion.div
              animate={{ opacity: entranceComplete ? 1 : 0 }}
              transition={{ duration: 1.0 }}
              className="pointer-events-auto"
            >
              <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(38px,8vw,72px)] text-left md:text-right uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)]">
                <ScrambleIn text="One" delay={700} triggered={entranceComplete} />
                <br />
                <ScrambleIn text="Network" delay={1000} triggered={entranceComplete} />
              </h1>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 2: Cinematic Text (full viewport) */}
      <section
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-[#010103]"
        id="about-section"
      >
        {/* Autoplay Background Video */}
        <video
          src={video2}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-[1] pointer-events-none" />

        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b from-[#010103] to-transparent z-[2] pointer-events-none" />

        {/* Cinematic Parallax Animated Text Block */}
        <div 
          style={{
            transformStyle: "preserve-3d",
            perspective: "400px"
          }}
          className="relative w-full max-w-5xl mx-auto py-24 sm:py-32 pointer-events-none z-[3]"
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
              opacity: cinematicOpacity,
            }}
            className="w-full text-center"
          >
            <h2 className="font-sans font-normal text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] text-white leading-[1.35] tracking-[-0.02em] select-none px-6 sm:px-12">
              A neural-AI interface built on the architecture of the human nervous system. SynapseX translates synaptic activity into computational intelligence. Every signal becomes measurable, structured, and visible. It continuously reconstructs internal state as a dynamic neural map. Biological noise is filtered into actionable cognitive patterns. Closed-loop feedback systems calibrate your neural baseline in real-time, bridging the gap between intention and execution. Experience cognitive synchronization.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Metrics (min-h-screen) */}
      <section
        className="relative w-full min-h-screen overflow-hidden flex items-start justify-center pt-10 sm:pt-14 md:pt-16 pb-20 bg-[#000]"
        id="metrics-section"
      >
        {/* Autoplay Background Video */}
        <video
          src={video3}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none"
        />

        {/* Metrics content */}
        <div className="relative z-[2] w-full max-w-6xl px-6 flex flex-col items-center">

          {/* Metrics Grid */}
          <motion.div
            variants={metricsGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 w-full max-w-5xl"
          >
            {/* Metric 1 */}
            <motion.div
              variants={metricItemVariants}
              className="flex flex-col items-center md:items-start text-center md:text-left px-8 sm:px-12 py-6 sm:py-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-[6px] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 w-full max-w-sm justify-self-center md:justify-self-start"
            >
              <span className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                2.4ms
              </span>
              <span className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide font-normal uppercase">
                Synaptic Latency
              </span>
            </motion.div>

            {/* Metric 2 */}
            <motion.div
              variants={metricItemVariants}
              className="flex flex-col items-center md:items-end text-center md:text-right px-8 sm:px-12 py-6 sm:py-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-[6px] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 w-full max-w-sm justify-self-center md:justify-self-end"
            >
              <span className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                140B
              </span>
              <span className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide font-normal uppercase">
                Neural Parameters
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Technology / Adaptive Intelligence (full viewport) */}
      <section
        className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between"
        id="tech-section"
      >
        {/* Autoplay Background Video */}
        <video
          src={video4}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transform scale-125"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65 z-[1] pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-[2] w-full max-w-7xl mx-auto px-8 sm:px-12 md:px-16 py-12 sm:py-16 flex flex-col justify-between h-full">
          
          {/* Top area: Heading and paragraph */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 w-full">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em] uppercase"
            >
              Adaptive<br />Intelligence
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
              className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2 font-normal"
            >
              The system learns your neural baseline within 72 hours. From there, every cognitive state is mapped, predicted, and optimized in real time.
            </motion.p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Grid: 4 features */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full"
          >
            {[
              { title: "Cortical Mapping", desc: "Real-time spatial reconstruction of active neural regions." },
              { title: "Signal Isolation", desc: "Separates cognitive intent from biological noise." },
              { title: "State Prediction", desc: "Anticipates cognitive transitions before they occur." },
              { title: "Loop Feedback", desc: "Closed-loop adjustment based on outcome correlation." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                className="flex flex-col"
              >
                <h3 className="text-white text-[14px] sm:text-[16px] font-normal mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 5: Architecture (min-h-screen, pure black background) */}
      <section
        className="w-full min-h-screen bg-black relative flex items-center justify-center py-32"
        id="architecture-section"
      >
        <div className="w-full max-w-3xl px-6 text-center flex flex-col items-center">
          
          {/* Heading Block */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8 font-medium">
              Architecture
            </span>
            <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em] mb-10 uppercase">
              Three layers. Zero friction.
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto font-normal">
              Sensor layer captures raw bioelectric signals. Processing layer isolates intent. Interface layer delivers structured output to any connected system.
            </p>
          </motion.div>

          {/* Layer Cards Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mt-20 flex flex-col items-center gap-4 w-full max-w-md"
          >
            {[
              { num: "Layer 1", action: "Capture" },
              { num: "Layer 2", action: "Process" },
              { num: "Layer 3", action: "Interface" }
            ].map((layer, idx) => (
              <div
                key={idx}
                className="w-full h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300"
              >
                <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase font-medium">
                  {layer.num}
                </span>
                <span className="text-white text-[16px] sm:text-[18px] font-light uppercase">
                  {layer.action}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="w-full bg-black border-t border-white/5 overflow-hidden"
        id="footer-section"
      >
        <div className="flex flex-col md:flex-row min-h-[400px] w-full">
          
          {/* Left Column: Video background */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
            <video
              src={video5}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
          </div>

          {/* Right Column: Information & Copyright */}
          <div className="w-full md:w-1/2 p-10 sm:p-16 flex flex-col justify-between bg-black">
            
            {/* Top area */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-white/70 mb-8 select-none">
                <SynapseXLogo className="w-4.5 h-4.5 text-white/70" />
                <span className="font-medium tracking-tight text-[15px]">
                  SynapseX
                </span>
              </div>
              <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm font-normal">
                The next evolution of human-machine interaction. Built for those who refuse to be limited by biology alone.
              </p>
            </div>

            {/* Bottom area */}
            <div className="text-white/25 text-[12px] mt-12 font-normal">
              &copy; 2026 SynapseX Labs. All rights reserved.
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
