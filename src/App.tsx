"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Phone, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles, 
  DollarSign, 
  Calculator, 
  Wrench, 
  CheckCircle2, 
  Hammer,
  AlertTriangle,
  FileText
} from 'lucide-react';
import ChatBot from './components/ChatBot';

// Reusable Framer Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

// Reusable hook for scroll-triggered animations
function useAnimateOnView(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

// Counting number component for premium stats count-up animation
function CountingNumber({ target, isInView, suffix = "" }: { target: number; isInView: boolean; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500; // ms
    const increment = target / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, isInView]);

  return <>{count}{suffix}</>;
}

// Animated star ratings row for Testimonials section
function AnimatedStars({ rating, isInView }: { rating: number; isInView: boolean }) {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < rating;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: i * 0.08, type: "spring", stiffness: 200 }}
            className={`${isFilled ? 'text-orange-400' : 'text-gray-200'} text-base`}
          >
            ★
          </motion.span>
        );
      })}
    </div>
  );
}

// Portfolio images for the interactive slider in Section 2
const PORTFOLIO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    title: "Premium Residential Slate Roof",
    location: "Seattle, WA"
  },
  {
    url: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800",
    title: "Sleek Industrial Standing Seam Metal",
    location: "Austin, TX"
  },
  {
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    title: "Contemporary Architectural Shingles",
    location: "Atlanta, GA"
  },
  {
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    title: "Classic Terracotta Styled Roof Tiles",
    location: "San Diego, CA"
  }
];

const SERVICES_DATA = [
  {
    title: "New Roof Installation",
    description: "Transform your home with our cutting-edge roofing solutions, delivering unmatched durability and style in every project.",
    image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400"
  },
  {
    title: "Expert Roof Repair",
    description: "Prompt repairs for leaks, storm damage, and wear to extend your roof's life.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"
  },
  {
    title: "Full Roof Replacement",
    description: "Complete roof overhaul for renewed protection and aesthetic upgrade.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
  },
  {
    title: "Roof Inspection",
    description: "Professional inspection to identify issues early and protect your investment.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400"
  }
];

export default function App() {
  // Page Loader states
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Cursor Glow effect
  const cursorX = useSpring(0, { stiffness: 80, damping: 20 });
  const cursorY = useSpring(0, { stiffness: 80, damping: 20 });
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 128);
      cursorY.set(e.clientY - 128);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  // Section Refs for scroll-triggered animations
  const sec2Left = useAnimateOnView(0.15);
  const sec2Right = useAnimateOnView(0.15);
  const sec3Header = useAnimateOnView(0.15);
  const sec3Cards = useAnimateOnView(0.15);
  const sec4Quote = useAnimateOnView(0.15);
  const sec5ALeft = useAnimateOnView(0.15);
  const sec5ACenter = useAnimateOnView(0.15);
  const sec5ARight = useAnimateOnView(0.15);
  const sec5BLeft = useAnimateOnView(0.15);
  const sec5BContainer = useAnimateOnView(0.15);
  const sec6Testimonials = useAnimateOnView(0.15);
  const sec7Left = useAnimateOnView(0.15);
  const sec7Right = useAnimateOnView(0.15);
  const sec8Footer = useAnimateOnView(0.15);
  
  // Watermark parallax trigger for footer
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const watermarkX = useTransform(scrollYProgress, [0, 1], [-130, 40], { clamp: false });
  const watermarkXSpring = useSpring(watermarkX, { stiffness: 100, damping: 20 });

  // Navigation states
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Slider reference for Section 3
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Carousel slider state for Section 2 Portfolio Card
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modals / Interactivity states
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // Multi-step estimator form state
  const [estimateStep, setEstimateStep] = useState(1);
  const [roofType, setRoofType] = useState('metal'); // metal, shingle, tile, slate
  const [serviceType, setServiceType] = useState('replacement'); // installation, repair, inspection, replacement
  const [sqFootage, setSqFootage] = useState(2000);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  // Section 5 Tab state
  const [activeSec5Tab, setActiveSec5Tab] = useState<'mission' | 'vision' | 'value'>('mission');

  // Dynamic values calculation helper based on selections
  const calculateRoofingPrice = () => {
    let baseRate = 8.5; // Slate or high-end
    if (roofType === 'metal') baseRate = 12.0;
    if (roofType === 'shingle') baseRate = 6.5;
    if (roofType === 'tile') baseRate = 14.5;

    let multiplier = 1.0;
    if (serviceType === 'repair') multiplier = 0.3;
    if (serviceType === 'inspection') multiplier = 0.05;
    if (serviceType === 'installation') multiplier = 1.1;

    let total = sqFootage * baseRate * multiplier;
    // Add margin or labor constants
    let labor = total * 0.45;
    let materials = total * 0.55;
    return {
      total: Math.round(total),
      materials: Math.round(materials),
      labor: Math.round(labor),
      timelineDays: Math.max(3, Math.ceil(sqFootage / 500))
    };
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % PORTFOLIO_IMAGES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + PORTFOLIO_IMAGES.length) % PORTFOLIO_IMAGES.length);
  };

  const resetEstimateForm = () => {
    setEstimateStep(1);
    setIsCalculated(false);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800 selection:bg-orange-500 selection:text-white">
      
      {/* PAGE LOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 bg-white z-[99999] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/35">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white animate-pulse">
                  <path d="M11.47 3.82a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06L12 5.56 3.84 13.72a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
                  <path d="M12 5.4 3.12 14.28a.75.75 0 0 0-.22.53v6.44c0 .41.34.75.75.75h4.5a.75.75 0 0 0 .75-.75V15h6v6.25c0 .41.34.75.75.75h4.5a.75.75 0 0 0 .75-.75v-6.44a.75.75 0 0 0-.21-.53L12 5.4Z" />
                </svg>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="font-display font-black text-2xl tracking-tight text-gray-900 uppercase">
                  RoofGuard
                </span>
                <span className="text-orange-500 font-sans tracking-widest text-xs uppercase font-bold mt-1">
                  Solution
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CURSOR GLOW EFFECT */}
      {isDesktop && (
        <motion.div 
          style={{ x: cursorX, y: cursorY }} 
          className="fixed w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none z-[9999] hidden lg:block"
        />
      )}

      {/* -------------------- NAVBAR -------------------- */}
      <motion.nav 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-white px-4 md:px-6 lg:px-8 py-2.5 md:py-4 flex items-center justify-between border-b border-gray-100"
      >
        
        {/* LOGO (LEFT) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/35 group-hover:bg-orange-600 transition-colors duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M11.47 3.82a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06L12 5.56 3.84 13.72a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
              <path d="M12 5.4 3.12 14.28a.75.75 0 0 0-.22.53v6.44c0 .41.34.75.75.75h4.5a.75.75 0 0 0 .75-.75V15h6v6.25c0 .41.34.75.75.75h4.5a.75.75 0 0 0 .75-.75v-6.44a.75.75 0 0 0-.21-.53L12 5.4Z" />
            </svg>
          </div>
          
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tight text-gray-900 leading-none">
              RoofGuard
            </span>
            <span className="text-orange-500 font-sans tracking-widest text-[10px] uppercase font-bold mt-0.5">
              Solution
            </span>
          </div>
        </motion.div>

        {/* DESKTOP NAV LINKS */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:flex items-center gap-2"
        >
          {['Home', 'Services', 'Gallery', 'About', 'Testimonials'].map((link) => {
            const isActive = activeTab === link;
            return (
              <button
                key={link}
                onClick={() => {
                  setActiveTab(link);
                  if (link === 'About' || link === 'Gallery' || link === 'Services') {
                    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-5 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                }`}
              >
                {link}
              </button>
            );
          })}
        </motion.div>

        {/* DESKTOP CONTACT BUTTON */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center gap-4"
        >
          <button
            onClick={() => {
              resetEstimateForm();
              setEstimateModalOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100 transition-all duration-350 cursor-pointer flex items-center gap-2"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 hover:text-orange-400 p-2 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden sticky top-[72px] left-0 w-full bg-white border-b border-gray-100 z-40 px-6 py-8 flex flex-col gap-5 text-center shadow-md"
          >
            <div className="flex flex-col gap-3">
              {['Home', 'Services', 'Gallery', 'About', 'Testimonials'].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setActiveTab(link);
                    setMobileMenuOpen(false);
                    if (link === 'About' || link === 'Gallery' || link === 'Services') {
                      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`py-2 text-base font-semibold rounded-lg ${
                    activeTab === link 
                      ? 'text-orange-500 bg-orange-500/5' 
                      : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
            
            <div className="h-px bg-gray-100 my-2" />
            
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  resetEstimateForm();
                  setEstimateModalOpen(true);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-full shadow-lg"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- SECTION 1: HERO SECTION -------------------- */}
      <header id="hero-section"
        className="relative flex items-end overflow-hidden bg-cover bg-center bg-no-repeat m-4 md:mx-[28px] md:mb-[28px] md:mt-[24px] rounded-[18px] md:rounded-[22px] min-h-[82vh] md:min-h-[78vh]"
        style={{
          backgroundImage: 'url(\'/background-image.jpg\')',
        }}>
        
        {/* ROOFING WATERMARK TEXT */}
        <div 
          style={{
            position: 'absolute',
            fontWeight: 900,
            color: '#ffffff',
            opacity: 1,
            letterSpacing: '-2px',
            lineHeight: 1,
            zIndex: 1,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontSize: 'clamp(48px, 18vw, 90px)',
            top: '10%',
            paddingLeft: '16px',
            left: 0,
            right: 0,
          }}
          className="font-display uppercase select-none md:text-[clamp(120px,18vw,220px)] md:top-[15%] md:pl-6"
        >
          ROOFING
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-full md:max-w-[55%] px-5 md:pl-11 pb-10 md:pb-[52px] flex flex-col items-start gap-0">
          
          {/* HEADLINE */}
          <h2 style={{
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'left',
            fontSize: '24px',
            lineHeight: 1.3,
            margin: '0 0 12px 0',
          }} className="font-display md:text-[clamp(28px,3.5vw,42px)] md:leading-[1.2] md:mb-[14px]">
            Shield Your Home with Sleek, Modern Roofing Solutions
          </h2>

          {/* SUBTITLE */}
          <p style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.88)',
            lineHeight: 1.6,
            margin: '0 0 20px 0',
            width: '100%',
            textAlign: 'left',
          }} className="md:max-w-[440px] md:mb-[26px]">
            From innovative installations to swift repairs, our expert team delivers durability, style, and peace of mind. Get your free estimate today!
          </p>

          {/* BUTTONS ROW */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
            <button
              onClick={() => {
                resetEstimateForm();
                setEstimateModalOpen(true);
              }}
              style={{
                backgroundColor: '#f97316',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                padding: '14px 20px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              className="w-full md:w-auto"
            >
              Get Your Free Estimate
            </button>

            <button
              onClick={() => setCallModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                fontSize: '14px',
                fontWeight: 600,
                padding: '14px 20px',
                borderRadius: '50px',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
              className="w-full md:w-auto"
            >
              <Phone className="w-4 h-4" style={{ color: '#1a1a1a' }} />
              <span>Call Now</span>
            </button>
          </div>

        </div>

      </header>
      {/* -------------------- SECTION 2: INTRO / ABOUT SECTION -------------------- */}
      <section id="about-section" className="relative w-full py-20 md:py-32 bg-white overflow-hidden">
        
        {/* Subtle Background Details */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: INFORMATION & ACCENTS */}
            <motion.div 
              ref={sec2Left.ref}
              initial="hidden"
              animate={sec2Left.isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="flex flex-col justify-center text-left"
            >
              
              {/* Small Orange Label Above Heading */}
              <motion.div variants={fadeLeft} className="inline-flex items-center gap-2 mb-4">
                <span className="inline-block w-8 h-[2px] bg-orange-500" />
                <span className="text-orange-500 font-display font-semibold text-sm tracking-wider uppercase">
                  Your Primary Home
                </span>
              </motion.div>

              {/* Large bold heading */}
              <motion.h2 variants={fadeLeft} className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                Deserves Top-Tier Roofing
              </motion.h2>

              {/* Paragraph Text */}
              <motion.p variants={fadeLeft} className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed mb-8">
                From innovative premium installations to swift, structural storm damage repairs, our cutting-edge roofing solutions deliver unmatched, certified durability and structural style in every project. We work closely with leading manufacturers to secure architectural-grade materials that withstand the elements.
              </motion.p>

              {/* STATS ROW WITH 2 STATS SIDE BY SIDE */}
              <motion.div variants={fadeLeft} className="grid grid-cols-2 gap-6 sm:gap-8 border-y border-slate-100 py-6 mb-8 bg-slate-50/50 p-4 rounded-2xl">
                
                {/* Stat 1 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-black text-orange-500 leading-none">
                      <CountingNumber target={15} isInView={sec2Left.isInView} suffix="+" />
                    </span>
                    <span className="text-orange-500 text-lg font-bold">Years</span>
                  </div>
                  <span className="text-slate-500 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wide">
                    Experience
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Industry-trusted master class</p>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-black text-orange-500 leading-none">
                      <CountingNumber target={500} isInView={sec2Left.isInView} suffix="+" />
                    </span>
                    <span className="text-orange-500 text-lg font-bold">Done</span>
                  </div>
                  <span className="text-slate-500 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wide">
                    Projects Done
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">Certified residential builds</p>
                </div>

              </motion.div>

              {/* Orange CTA Button */}
              <motion.button
                variants={fadeLeft}
                onClick={() => setPricingModalOpen(true)}
                className="w-full sm:w-max bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 hover:scale-102 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                <span>Explore Pricing</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.button>

            </motion.div>


            {/* RIGHT COLUMN: OVERLAPPING IMAGE CARDS LAYOUT */}
            <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center mt-6 lg:mt-0">
              
              {/* LARGE CARD (Left/Bottom): Portfolio Gallery Slider */}
              <motion.div 
                ref={sec2Right.ref}
                initial="hidden"
                animate={sec2Right.isInView ? "visible" : "hidden"}
                variants={scaleIn}
                id="portfolio-main-card"
                className="absolute left-0 bottom-0 w-[82%] h-[360px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-100 group transition-all duration-300 hover:shadow-orange-500/5"
              >
                {/* Image Transition Canvas */}
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={PORTFOLIO_IMAGES[currentSlide].url}
                      alt={PORTFOLIO_IMAGES[currentSlide].title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  {/* Top-left image index badge */}
                  <div className="absolute top-4 left-4 bg-slate-950/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                      Gallery {currentSlide + 1}/{PORTFOLIO_IMAGES.length}
                    </span>
                  </div>

                  {/* Gradient bottom bar overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Bottom descriptive footer content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-white font-semibold text-base sm:text-lg tracking-tight leading-snug">
                        {PORTFOLIO_IMAGES[currentSlide].title}
                      </p>
                      <p className="text-orange-400 text-xs mt-0.5 flex items-center gap-1 font-mono">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400" />
                        {PORTFOLIO_IMAGES[currentSlide].location}
                      </p>
                    </div>

                    {/* Nav actions underneath (arrows + title indicator) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevSlide();
                        }}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 text-white hover:text-white border border-white/20 hover:border-orange-500 flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-md"
                        aria-label="Previous portfolio project"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextSlide();
                        }}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 text-white hover:text-white border border-white/20 hover:border-orange-500 flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-md"
                        aria-label="Next portfolio project"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom label overlay bar requested by instructions */}
                  <div className="absolute top-4 right-4 bg-orange-500/90 text-white font-semibold text-xs py-1.5 px-4 rounded-full shadow-md">
                    Our Portfolio Gallery
                  </div>
                </div>
              </motion.div>


              {/* SMALL FLOATING CARD (Top Right, overlapping) with fadeRight entrance and slight spring delay */}
              <motion.div 
                id="overlapping-price-card"
                initial="hidden"
                animate={sec2Right.isInView ? "visible" : "hidden"}
                variants={fadeRight}
                transition={{ delay: 0.3 }}
                className="absolute top-0 right-0 w-[55%] sm:w-[46%] rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-150 z-10 transform hover:-translate-y-2 hover:scale-103 transition-all duration-350 cursor-pointer flex flex-col"
                onClick={() => setPricingModalOpen(true)}
              >
                {/* Image of Close-up roof tiles */}
                <div className="relative h-[130px] sm:h-[150px] w-full overflow-hidden bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" 
                    alt="Close-up of premium structural roof tiles"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle blur tag icon */}
                  <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-xs text-[10px] text-white font-bold py-1 px-2.5 rounded-full">
                    Expert Grade Material
                  </div>
                </div>

                {/* Sub text Details */}
                <div className="p-4 sm:p-5 flex flex-col text-left">
                  <p className="text-slate-400 text-[10px] tracking-wider uppercase font-semibold">Verified Estimate Base</p>
                  <p className="text-slate-900 font-display font-bold text-base sm:text-lg mt-0.5">
                    Pricing Starts at $40k
                  </p>
                  <p className="text-slate-500 text-xs font-light mt-1">Includes dual insulation & full structural framing replacement guarantee.</p>
                  
                  {/* Small trigger link below */}
                  <div className="text-orange-500 hover:text-orange-600 hover:underline text-xs font-bold mt-3.5 inline-flex items-center gap-1 cursor-pointer transition-colors duration-200">
                    <span>Explore Pricing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

      </section>

      {/* SECTION DIVIDER LINE */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        whileInView={{ scaleX: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "left" }}
        className="h-[1px] bg-gray-100 w-full"
      />


      {/* -------------------- SECTION 3: SERVICES SLIDER -------------------- */}
      <section id="services-section" className="relative w-full py-16 px-8 lg:px-16 bg-white border-t border-slate-100/60 overflow-hidden">
        
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* TWO-COLUMN HEADER LAYOUT */}
          <motion.div 
            ref={sec3Header.ref}
            initial="hidden"
            animate={sec3Header.isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            
            {/* LEFT COLUMN */}
            <motion.div variants={fadeLeft} className="flex flex-col justify-end h-full md:pb-2">
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                From brand new roof installations to rapid emergency repairs, our expert team delivers top-quality craftsmanship and lasting protection to keep your home secure and stylish in any situation.
              </p>
            </motion.div>

            {/* RIGHT COLUMN (top) */}
            <motion.div variants={fadeRight} className="flex flex-row justify-between items-center md:items-end gap-6">
              <div>
                <h3 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  Durable, Stylish
                </h3>
                <h3 className="text-4xl font-bold text-orange-500 leading-tight tracking-tight">
                  Roofing Solutions
                </h3>
              </div>
              
              {/* TWO SMALL CIRCULAR ARROW NAVIGATION BUTTONS */}
              <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
                <button 
                  onClick={scrollLeft}
                  className="border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500 hover:bg-slate-50 transition-all cursor-pointer active:scale-90"
                  aria-label="Scroll services left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={scrollRight}
                  className="border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500 hover:bg-slate-50 transition-all cursor-pointer active:scale-90"
                  aria-label="Scroll services right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

          </motion.div>

          {/* CARDS ROW */}
          <motion.div 
            ref={(node) => {
              // Dual assignment of ref for scroll trigger and viewport detector
              sec3Cards.ref.current = node;
              (sliderRef as any).current = node;
            }}
            initial="hidden"
            animate={sec3Cards.isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="flex flex-row gap-5 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* CARD 1 - Special "Call Now" Card */}
            <motion.div 
              variants={staggerItem}
              className="w-56 flex-shrink-0 bg-[#d9c7b8] rounded-[22px] flex flex-col justify-between relative overflow-hidden"
              style={{ padding: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}
            >
              <div className="relative z-10 flex flex-col h-full">
                <span className="inline-block bg-[#f97316]/20 text-[#f97316] text-xs font-semibold px-4 py-1.5 rounded-full">
                  CALL NOW
                </span>

                <div className="flex-grow"></div>

                <a 
                  href="tel:+97132435757"
                  className="bg-[#f97316] text-white font-bold text-[14px] rounded-full shadow-lg flex items-center gap-2 w-auto transition-all duration-200 cursor-pointer hover:bg-orange-600 active:bg-orange-700"
                  style={{ padding: '12px 22px', boxShadow: '0 8px 20px rgba(249,115,22,0.35)' }}
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>+971 32435 757</span>
                </a>
              </div>

              <img
                src="/png-men-image.png"
                alt="Call support"
                className="absolute object-contain pointer-events-none max-h-[260px] md:max-h-[340px]"
                style={{ right: '-25px', bottom: '-10px' }}
              />
            </motion.div>

            {/* CARDS 2 to 5 */}
            {SERVICES_DATA.map((service, index) => (
              <motion.div 
                key={index}
                variants={staggerItem}
                className="w-56 flex-shrink-0 bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-[390px] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-2 group"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 text-base tracking-tight group-hover:text-orange-500 transition-colors duration-200">
                    {service.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* BOTTOM REGION: Image with absolute arrow overlay */}
                <div className="relative mt-auto pt-4 rounded-2xl overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="rounded-2xl h-28 w-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Bottom right circular arrow button */}
                  <div className="absolute bottom-2 right-2 border border-gray-200 bg-white/95 backdrop-blur-xs rounded-full w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300 shadow-xs cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}

          </motion.div>

          {/* Quick hidden scrollbar style injection for non-supported browsers */}
          <style dangerouslySetInnerHTML={{__html: `
            [ref="sliderRef"]::-webkit-scrollbar,
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
          `}} />

        </div>

      </section>

      {/* SECTION DIVIDER LINE */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        whileInView={{ scaleX: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "left" }}
        className="h-[1px] bg-gray-100 w-full"
      />


      {/* -------------------- SECTION 4: QUOTE BANNER -------------------- */}
      <section id="quote-banner" className="relative w-full py-16 px-8 bg-gradient-to-br from-orange-50 to-rose-100 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <motion.p 
            ref={sec4Quote.ref}
            initial="hidden"
            animate={sec4Quote.isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center max-w-3xl mx-auto leading-snug"
          >
            Roofing is more than a structure—it's your home's foundation. We empower <span className="text-orange-500">homeowners</span> with quality craftsmanship, clear pricing, and durable solutions for lasting security and value.
          </motion.p>
        </div>
      </section>

      {/* SECTION DIVIDER LINE */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        whileInView={{ scaleX: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "left" }}
        className="h-[1px] bg-gray-100 w-full"
      />


      {/* -------------------- SECTION 5: TWO SUBSECTIONS -------------------- */}
      <section id="features-and-process-section" className="relative w-full bg-white divide-y divide-slate-100">
        
        {/* SUBSECTION A — "Transform Your Home" */}
        <div className="py-16 px-8 md:px-16 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1 (left) */}
            <motion.div 
              ref={sec5ALeft.ref}
              initial="hidden"
              animate={sec5ALeft.isInView ? "visible" : "hidden"}
              variants={fadeLeft}
              className="flex flex-col text-left font-sans"
            >
              <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                Transform Your Home
              </h3>
              <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                with Premium Roofing
              </h3>
              <p className="text-gray-400 text-sm mt-3 max-w-xs leading-relaxed">
                Reinvest trust is key to the confidence of your home's protection. We empower homeowners with expert craftsmanship, ease of living, and durable solutions for lasting security and real value.
              </p>
              
              <div>
                <button
                  onClick={() => {
                    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-full px-6 py-3 mt-6 inline-block text-sm font-semibold transition-all shadow-md shadow-orange-500/10 cursor-pointer text-center"
                >
                  More About Us
                </button>
              </div>
            </motion.div>

            {/* COLUMN 2 (center) */}
            <motion.div 
              ref={sec5ACenter.ref}
              initial="hidden"
              animate={sec5ACenter.isInView ? "visible" : "hidden"}
              variants={scaleIn}
              className="w-full h-72 rounded-3xl overflow-hidden shadow-lg border border-slate-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600" 
                alt="Two licensed professional roofers working on building layout structure safely" 
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* COLUMN 3 (right): Stacked interactive tab cards */}
            <motion.div 
              ref={sec5ARight.ref}
              initial="hidden"
              animate={sec5ARight.isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="flex flex-col gap-3"
            >
              
              {/* TAB 1 — Our Mission */}
              <motion.div 
                variants={fadeRight}
                onClick={() => setActiveSec5Tab('mission')}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 border ${
                  activeSec5Tab === 'mission'
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/15'
                    : 'bg-white border-gray-100 hover:border-slate-300 text-gray-950'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-sm ${activeSec5Tab === 'mission' ? 'text-white' : 'text-gray-900'}`}>
                    Our Mission
                  </span>
                  <i className={`ti ${activeSec5Tab === 'mission' ? 'ti-chevron-down' : 'ti-chevron-right'} text-lg`} style={{ color: activeSec5Tab === 'mission' ? '#ffffff' : '#f97316' }} />
                </div>
                
                {activeSec5Tab === 'mission' && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-white/80 text-xs mt-2 leading-relaxed"
                  >
                    We dedicate to each roof for quality and lasting. Our team blends skill with superior materials and innovation.
                  </motion.p>
                )}
              </motion.div>

              {/* TAB 2 — Our Vision */}
              <motion.div 
                variants={fadeRight}
                onClick={() => setActiveSec5Tab('vision')}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 border ${
                  activeSec5Tab === 'vision'
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/15'
                    : 'bg-white border-gray-100 hover:border-slate-300 text-gray-950'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-sm ${activeSec5Tab === 'vision' ? 'text-white' : 'text-gray-900'}`}>
                    Our Vision
                  </span>
                  <i className={`ti ${activeSec5Tab === 'vision' ? 'ti-chevron-down' : 'ti-chevron-right'} text-lg`} style={{ color: activeSec5Tab === 'vision' ? '#ffffff' : '#f97316' }} />
                </div>
                
                {activeSec5Tab === 'vision' && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-white/80 text-xs mt-2 leading-relaxed"
                  >
                    To be the leading pioneer in high-durability roofing solutions, providing sustainable structural engineering for safe, eco-efficient houses worldwide.
                  </motion.p>
                )}
              </motion.div>

              {/* TAB 3 — Our Value */}
              <motion.div 
                variants={fadeRight}
                onClick={() => setActiveSec5Tab('value')}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-300 border ${
                  activeSec5Tab === 'value'
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/15'
                    : 'bg-white border-gray-100 hover:border-slate-300 text-gray-950'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-sm ${activeSec5Tab === 'value' ? 'text-white' : 'text-gray-900'}`}>
                    Our Value
                  </span>
                  <i className={`ti ${activeSec5Tab === 'value' ? 'ti-chevron-down' : 'ti-chevron-right'} text-lg`} style={{ color: activeSec5Tab === 'value' ? '#ffffff' : '#f97316' }} />
                </div>
                
                {activeSec5Tab === 'value' && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-white/80 text-xs mt-2 leading-relaxed"
                  >
                    Uncompromising integrity, rigorous architectural safety standards, high transparency in cost, and complete commitment to customer peace of mind.
                  </motion.p>
                )}
              </motion.div>

            </motion.div>

          </div>
        </div>

        {/* SUBSECTION B — "Our Simple Process" */}
        <div className="py-12 px-8 md:px-16 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* LEFT COLUMN */}
            <motion.div 
              ref={sec5BLeft.ref}
              initial="hidden"
              animate={sec5BLeft.isInView ? "visible" : "hidden"}
              variants={fadeLeft}
              className="flex flex-col text-left font-sans"
            >
              <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                Our Simple
              </h3>
              <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                Process
              </h3>
              <p className="text-gray-400 text-sm mt-3 max-w-xs leading-relaxed">
                From consultation to completion, we make roofing seamless.
              </p>
            </motion.div>

            {/* RIGHT COLUMN: Three process step cards in a row */}
            <motion.div 
              ref={sec5BContainer.ref}
              initial="hidden"
              animate={sec5BContainer.isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              
              {/* CARD 1 — "Free Consultation" */}
              <motion.div 
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-start shadow-xs hover:shadow-md transition-shadow duration-300 text-left"
              >
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <i className="ti ti-phone" style={{ fontSize: '20px', color: '#f97316' }}></i>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mt-3">
                  Free Consultation
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Chat with our experts to understand your roofing needs and explore solutions.
                </p>
              </motion.div>

              {/* CARD 2 — "Proper Detailed Plan" */}
              <motion.div 
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-start shadow-xs hover:shadow-md transition-shadow duration-300 text-left"
              >
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <i className="ti ti-clipboard-list" style={{ fontSize: '20px', color: '#f97316' }}></i>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mt-3">
                  Proper Detailed Plan
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Comprehensive planning with clear timeline, cost estimates, and quality materials.
                </p>
              </motion.div>

              {/* CARD 3 — "Expert Installation" */}
              <motion.div 
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-start shadow-xs hover:shadow-md transition-shadow duration-300 text-left"
              >
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <i className="ti ti-tools" style={{ fontSize: '20px', color: '#f97316' }}></i>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mt-3">
                  Expert Installation
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Professional execution using quality materials and expert craftsmanship.
                </p>
              </motion.div>

            </motion.div>

          </div>
        </div>

      </section>


      {/* -------------------- SECTION 6 — TESTIMONIALS "Clients Speak for Us" -------------------- */}
      <section id="testimonials-section" className="relative w-full py-16 px-8 md:px-16 bg-white overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          
          {/* Centered heading */}
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold text-gray-900 text-center mb-12"
          >
            Clients Speak for Us
          </motion.h3>

          {/* Cards Row - Left Aligned row starting from left edge */}
          <motion.div 
            ref={sec6Testimonials.ref}
            initial="hidden"
            animate={sec6Testimonials.isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="flex flex-row gap-6 overflow-x-auto pb-4 scroll-smooth select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* CARD 1 */}
            <motion.div 
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400" 
                  alt="Sarah Johnson - Verified Homeowner Chicago IL" 
                  className="w-full h-56 object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 pb-0 text-left">
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    "Outstanding service! The crew had been amazing, and the team was professional from start to finish."
                  </p>
                </div>
              </div>
              
              <div className="p-5 text-left mt-auto">
                <p className="font-bold text-gray-900 text-sm mt-3">
                  Sarah Johnson
                </p>
                <p className="text-gray-400 text-xs">
                  Homeowner, IL
                </p>
                <AnimatedStars rating={5} isInView={sec6Testimonials.isInView} />
              </div>
            </motion.div>

            {/* CARD 2 - FEATURED (Mike Rodriguez - Border 2 and scale-105) */}
            <motion.div 
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="w-72 flex-shrink-0 bg-white border-2 border-gray-800 rounded-3xl overflow-hidden scale-105 shadow-lg z-10 relative transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400" 
                  alt="Mike Rodriguez - Verified Homeowner Dallas TX" 
                  className="w-full h-56 object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 pb-0 text-left">
                  <span className="bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                    FEATURED REVIEW
                  </span>
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    "Quick response after storm damage. The repair was perfect, and communication was excellent."
                  </p>
                </div>
              </div>

              <div className="p-5 text-left mt-auto">
                <p className="font-bold text-gray-900 text-sm mt-3">
                  Mike Rodriguez
                </p>
                <p className="text-gray-400 text-xs">
                  Homeowner, TX
                </p>
                <AnimatedStars rating={5} isInView={sec6Testimonials.isInView} />
              </div>
            </motion.div>

            {/* CARD 3 -> 4 Stars + 1 Gray Star */}
            <motion.div 
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400" 
                  alt="Jennifer Chen - Owner Seattle WA" 
                  className="w-full h-56 object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 pb-0 text-left">
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    "The roof replacement exceeded expectations. Great quality and top-notch communication throughout."
                  </p>
                </div>
              </div>

              <div className="p-5 text-left mt-auto">
                <p className="font-bold text-gray-900 text-sm mt-3">
                  Jennifer Chen
                </p>
                <p className="text-gray-400 text-xs">
                  Homeowner, CA
                </p>
                <AnimatedStars rating={4} isInView={sec6Testimonials.isInView} />
              </div>
            </motion.div>

            {/* CARD 4 */}
            <motion.div 
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" 
                  alt="David Thompson - General Partner Atlanta GA" 
                  className="w-full h-56 object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 pb-0 text-left">
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    "Highly recommend! Clean work, fair pricing, and they finished ahead of schedule."
                  </p>
                </div>
              </div>

              <div className="p-5 text-left mt-auto">
                <p className="font-bold text-gray-900 text-sm mt-3">
                  David Thompson
                </p>
                <p className="text-gray-400 text-xs">
                  Homeowner, NY
                </p>
                <AnimatedStars rating={5} isInView={sec6Testimonials.isInView} />
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* -------------------- SECTION 7 — CONTACT / CTA BANNER -------------------- */}
      <section id="contact-section" className="relative w-full bg-gray-50 py-16 px-8 md:px-16 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT COLUMN — FORM CARD */}
          <motion.div 
            ref={sec7Left.ref}
            initial="hidden"
            animate={sec7Left.isInView ? "visible" : "hidden"}
            variants={fadeLeft}
            className="bg-white rounded-3xl shadow-sm p-10 w-full text-left"
          >
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              Book a Roof Inspection
            </h3>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              & Receive a Free Estimate
            </h3>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Your roof inspection request has been submitted successfully. A representative will reach out to you shortly.");
              }}
              className="flex flex-col gap-4 mt-6"
            >
              {/* ROW 1 — two inputs side by side */}
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  required
                  placeholder="First Name" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
                <input 
                  type="text" 
                  required
                  placeholder="Last Name" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
              </div>

              {/* ROW 2 — two inputs side by side */}
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
                <input 
                  type="tel" 
                  required
                  placeholder="Phone" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
              </div>

              {/* ROW 3 — two inputs side by side */}
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Email" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
                <input 
                  type="text" 
                  required
                  placeholder="City" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
              </div>

              {/* ROW 4 — two inputs side by side */}
              <div className="grid grid-cols-2 gap-3">
                <select 
                  required
                  defaultValue=""
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50 text-gray-700"
                >
                  <option value="" disabled>Roof Size</option>
                  <option value="Small">Small (&lt; 1,500 sqft)</option>
                  <option value="Medium">Medium (1,500 - 3,000 sqft)</option>
                  <option value="Large">Large (3,000 - 5,000 sqft)</option>
                  <option value="Extra Large">Extra Large (5,000+ sqft)</option>
                </select>
                <input 
                  type="text" 
                  required
                  placeholder="Zip/Postal Code" 
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-400 bg-slate-50/50"
                />
              </div>

              {/* CHECKBOX ROW */}
              <div className="flex items-start gap-2.5 mt-1">
                <input 
                  id="consent-checkbox-fixed"
                  type="checkbox" 
                  required
                  className="mt-1 accent-orange-500 rounded cursor-pointer"
                />
                <label htmlFor="consent-checkbox-fixed" className="text-xs text-gray-400 leading-normal cursor-pointer select-none">
                  I consent to receiving text messages regarding my case on my Whatsapp and other terms may apply.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-full py-4 w-full font-semibold text-sm mt-2 transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                Get a Free Roof Inspection
              </button>
            </form>
          </motion.div>

          {/* RIGHT COLUMN — IMAGE CARD WITH OVERLAY CONTENT */}
          <motion.div 
            ref={sec7Right.ref}
            initial="hidden"
            animate={sec7Right.isInView ? "visible" : "hidden"}
            variants={fadeRight}
            className="relative rounded-3xl overflow-hidden min-h-[500px]"
          >
            {/* Absolute positioning to emulate fill */}
            <img 
              src="https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800" 
              alt="Beautiful secure rooftop" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark overlay div */}
            <div className="absolute inset-0 bg-black/55" />
            
            {/* Content div */}
            <div className="absolute inset-0 flex flex-col justify-between p-10 z-10 text-left">
              
              {/* TOP OF CONTENT */}
              <div>
                <h2 className="text-5xl font-bold text-white leading-tight tracking-tight">
                  Let's Get in
                </h2>
                <h2 className="text-5xl font-bold text-orange-500 tracking-tight">
                  Contact
                </h2>
              </div>

              {/* BOTTOM OF CONTENT — FROSTED CONTACT CARD */}
              <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-sm">
                <h4 className="text-white font-bold text-xs tracking-widest mb-4 uppercase">
                  CONTACT INFO
                </h4>
                
                <div className="flex flex-col gap-4">
                  {/* Row 1 */}
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center shadow-xs">
                      <i className="ti ti-phone text-white" style={{ fontSize: '18px' }}></i>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-medium pt-1.5 font-sans">
                      +1 (800) 123-ROOF | +1 (800) 987-6543
                    </p>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center shadow-xs">
                      <i className="ti ti-mail text-white" style={{ fontSize: '18px' }}></i>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-medium pt-1.5 break-all font-sans">
                      info@roofguardsolution.com | support@roofguardsolution.com
                    </p>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center shadow-xs">
                      <i className="ti ti-map-pin text-white" style={{ fontSize: '18px' }}></i>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-medium pt-1.5 font-sans">
                      456 Rooftop Avenue, Suite 200 | Springfield, IL 62704
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* -------------------- SECTION 8 — FOOTER -------------------- */}
      <footer id="footer-section" className="relative w-full bg-white border-t border-gray-100 py-12 px-8 md:px-16 text-left">
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          
          {/* FOOTER TOP GRID */}
          <motion.div 
            ref={sec8Footer.ref}
            initial="hidden"
            animate={sec8Footer.isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10"
          >
            
            {/* COLUMN 1 — Brand */}
            <motion.div variants={staggerItem} className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-xs">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M11.47 3.82a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06L12 5.56 3.84 13.72a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900 text-lg tracking-tight">
                  RoofGuard Solution
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mt-3 max-w-xs leading-relaxed">
                The trusted first for all roofing needs—customer results and committed to excellence.
              </p>

              {/* Social icons row */}
              <div className="mt-5 flex gap-2.5">
                {[
                  'ti-brand-facebook', 
                  'ti-brand-instagram', 
                  'ti-brand-twitter', 
                  'ti-brand-linkedin', 
                  'ti-brand-youtube'
                ].map((iconName, idx) => (
                  <a 
                    key={idx}
                    href="#"
                    className="border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50/10 transition-colors cursor-pointer"
                    aria-label={`Visit our social profile active row ${idx}`}
                  >
                    <i className={`ti ${iconName} text-base`}></i>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* COLUMN 2 — Pages */}
            <motion.div variants={staggerItem} className="flex flex-col">
              <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wider">
                Pages
              </h4>
              <ul className="flex flex-col gap-2.5 text-gray-400 text-sm">
                {['Home', 'Services', 'Gallery', 'About', 'Testimonials'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* COLUMN 3 — Support */}
            <motion.div variants={staggerItem} className="flex flex-col">
              <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wider">
                Support
              </h4>
              <ul className="flex flex-col gap-2.5 text-gray-400 text-sm">
                {['Help', 'FAQ', 'Checkout'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* COLUMN 4 — Legal */}
            <motion.div variants={staggerItem} className="flex flex-col">
              <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="flex flex-col gap-2.5 text-gray-400 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* COLUMN 5 — Map */}
            <motion.div variants={staggerItem} className="flex flex-col">
              <div className="bg-gray-100 rounded-2xl h-32 w-full flex items-center justify-center border border-gray-200 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 ml-1" />
                <div className="relative z-10 w-10 h-10 bg-white shadow-sm border border-slate-200/50 rounded-full flex items-center justify-center text-orange-500 transform group-hover:scale-110 transition-transform duration-300">
                  <i className="ti ti-map-pin text-lg"></i>
                </div>
              </div>
              <p className="text-gray-400 text-xs text-center mt-2.5 font-medium">
                Springfield, IL
              </p>
            </motion.div>

          </motion.div>

          {/* FOOTER BOTTOM WATERMARK & COPYRIGHT */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-gray-100 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden animate-gpu"
          >
            {/* Left Watermark */}
            <div className="text-gray-100/70 font-black text-6xl sm:text-7xl lg:text-8xl tracking-widest select-none leading-none uppercase pointer-events-none -ml-4 font-sans max-w-full truncate">
              ROOF GUA...
            </div>
            
            {/* Copyright */}
            <p className="text-gray-400 text-xs md:text-right flex-shrink-0">
              © 2026 RoofGuard Solution. All rights reserved.
            </p>
          </motion.div>

        </div>
      </footer>


      {/* -------------------- INTERACTIVE ELEMENT A: MULTI-STEP FREE ESTIMATOR MODAL -------------------- */}
      <AnimatePresence>
        {estimateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEstimateModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-150 flex flex-col z-50 text-left"
            >
              
              {/* Top Banner with Orange Accent */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 text-white relative">
                
                {/* Brand Logo micro */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path d="M11.47 3.82a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06L12 5.56 3.84 13.72a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">RoofGuard Estimator</span>
                </div>

                <h3 className="font-display font-black text-2xl tracking-tight text-white m-0">
                  {isCalculated ? "Your Roofing Estimate" : "Free Roofing Cost Calculator"}
                </h3>
                
                <p className="text-white/60 text-xs mt-1">Get an instant calculation based on real regional contracting models.</p>

                {/* Close Button */}
                <button 
                  onClick={() => setEstimateModalOpen(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-white hover:bg-orange-500 transition-all duration-200 cursor-pointer"
                  aria-label="Close Estimate Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar (Visible during estimate input steps) */}
              {!isCalculated && (
                <div className="w-full bg-slate-100 h-1">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-300" 
                    style={{ width: `${(estimateStep / 3) * 100}%` }}
                  />
                </div>
              )}

              {/* Steps Body */}
              <div className="p-6 flex-grow overflow-y-auto max-h-[480px]">
                
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Roof Type Selection */}
                  {estimateStep === 1 && !isCalculated && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <p className="text-slate-700 font-semibold text-sm">Step 1 of 3: Select Material Type</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'metal', name: 'Premium Metal', price: '$12.00 / sqft', desc: 'Standing seam architectural grade.' },
                          { id: 'shingle', name: 'Asphalt Shingle', price: '$6.50 / sqft', desc: 'Reliable three-tab traditional style.' },
                          { id: 'tile', name: 'Spanish Clay Tile', price: '$14.50 / sqft', desc: 'Beautiful, lifetime structural clay.' },
                          { id: 'slate', name: 'Natural Slate Shingle', price: '$16.00 / sqft', desc: 'Classic, luxury stone tile detailing.' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setRoofType(item.id)}
                            className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-250 ${
                              roofType === item.id 
                                ? 'border-orange-500 bg-orange-500/5' 
                                : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-semibold text-slate-900 block text-sm">{item.name}</span>
                            <span className="text-slate-400 text-[10px] mt-0.5 block">{item.desc}</span>
                            <span className="text-orange-500 font-bold text-xs mt-2 block">{item.price}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => setEstimateStep(2)}
                          className="flex-grow bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-full text-center text-sm cursor-pointer flex items-center justify-center gap-1"
                        >
                          Next Step
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}


                  {/* STEP 2: Service Type & Square Footage Selection */}
                  {estimateStep === 2 && !isCalculated && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <p className="text-slate-700 font-semibold text-sm">Step 2 of 3: Technical Details</p>
                      
                      {/* Service Grid Selection */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Required</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'installation', name: 'New Installation', desc: 'Complete framing & tile structure' },
                            { id: 'replacement', name: 'Re-roof replacement', desc: 'Remove old and replace' },
                            { id: 'repair', name: 'Swift Repair Works', desc: 'Fix leakages, replace broken pieces' },
                            { id: 'inspection', name: 'Full Inspection', desc: 'Complete check-up with report' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setServiceType(item.id)}
                              className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 text-xs ${
                                serviceType === item.id
                                  ? 'border-orange-500 bg-orange-500/5 text-slate-900'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <span className="font-bold block">{item.name}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Square Footage Slider */}
                      <div className="flex flex-col gap-2 mt-2 bg-slate-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center text-sm">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Roof Surface Area</label>
                          <span className="font-mono font-bold text-orange-500 text-base">{sqFootage.toLocaleString()} sq. ft.</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="8000"
                          step="100"
                          value={sqFootage}
                          onChange={(e) => setSqFootage(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                          <span>500 sqft (Cottage)</span>
                          <span>8,000 sqft (Estate)</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setEstimateStep(1)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-full text-sm cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setEstimateStep(3)}
                          className="flex-grow bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-full text-center text-sm cursor-pointer flex items-center justify-center gap-1"
                        >
                          Next: Contact Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}


                  {/* STEP 3: Contact Form Integration */}
                  {estimateStep === 3 && !isCalculated && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <p className="text-slate-700 font-semibold text-sm">Step 3 of 3: Secure Your Estimate Copy</p>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Doe" 
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone number</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="(555) 000-0000" 
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="johndoe@example.com" 
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setEstimateStep(2)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-full text-sm cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => {
                            if (!clientName || !clientPhone) {
                              alert("Please enter both your name and phone number to generate the report!");
                              return;
                            }
                            setIsCalculated(true);
                          }}
                          className="flex-grow bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-full text-center text-sm cursor-pointer flex items-center justify-center gap-1 shadow-lg shadow-orange-500/15"
                        >
                          Calculate Free Estimate
                          <Sparkles className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}


                  {/* CALCULATION RESULTS SCREEN */}
                  {isCalculated && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col gap-4 text-slate-800"
                    >
                      <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Quote Successfully Generated</p>
                          <p className="text-xs text-slate-500">A copy of this contract-grade reference report has been generated for {clientName}.</p>
                        </div>
                      </div>

                      {/* Cost Sheet Display */}
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col gap-3 font-sans">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/80">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Roofing Blueprint</span>
                            <span className="text-xs text-slate-600 font-bold block capitalize">{roofType} — {serviceType}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Area Spec</span>
                            <span className="text-xs font-mono font-bold block text-slate-800">{sqFootage} SQFT</span>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="flex flex-col gap-2.5 text-xs py-1 text-slate-600">
                          <div className="flex justify-between">
                            <span>Certified Architectural Materials</span>
                            <span className="font-mono text-slate-800">${calculateRoofingPrice().materials.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Licensed Labor &amp; Protection Setup</span>
                            <span className="font-mono text-slate-800">${calculateRoofingPrice().labor.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Disposal &amp; Local Permitting Fees</span>
                            <span className="font-mono text-slate-800 text-green-600">INCLUDED</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200/40 pt-2.5">
                            <span>Project Timeline Estimate</span>
                            <span className="font-semibold text-slate-800">{calculateRoofingPrice().timelineDays} Working Days</span>
                          </div>
                        </div>

                        {/* Total Grand Cost */}
                        <div className="flex justify-between items-center pt-3.5 border-t-2 border-dashed border-slate-200">
                          <span className="font-bold text-slate-900 text-base">Estimated Price Range:</span>
                          <div className="text-right">
                            <span className="font-mono font-black text-2xl text-orange-600">
                              ${calculateRoofingPrice().total.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5 font-light">Price variance based on exact pitch &amp; site safety</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-2">
                        <a 
                          href={`tel:${clientPhone}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-full text-center text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Lock In Quote Rate — Call Us Now</span>
                        </a>
                        <button
                          onClick={resetEstimateForm}
                          className="bg-slate-100 hover:bg-slate-250 text-slate-600 font-bold py-3 px-4 rounded-full text-center text-xs cursor-pointer"
                        >
                          Calculate Another Property
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>


      {/* -------------------- INTERACTIVE ELEMENT B: ACTIVE CALL NOW DIALOG -------------------- */}
      <AnimatePresence>
        {callModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCallModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-6 z-50 text-center"
            >
              <button 
                onClick={() => setCallModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                aria-label="Close Caller Info"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Phone className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-display font-black text-xl mb-1">Call RoofGuard Directly</h3>
              <p className="text-white/60 text-xs mb-6 px-1">Connect instantly with one of our certified structural project managers.</p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block mb-1">Direct Hotline</span>
                <a 
                  href="tel:18007663482" 
                  className="text-orange-400 hover:text-orange-300 font-mono font-bold text-2xl tracking-tight transition-colors"
                >
                  1-800-ROOF-GUARD
                </a>
                <span className="text-[10px] text-white/50 block mt-2">Certified crew dispatched in Seattle, Austin, Atlanta &amp; San Diego</span>
              </div>

              <div className="flex gap-2.5">
                <a 
                  href="tel:18007663482"
                  className="flex-grow bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full text-sm block transition-all"
                >
                  Dial Now
                </a>
                <button 
                  onClick={() => setCallModalOpen(false)}
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white py-3 px-5 rounded-full text-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>


      {/* -------------------- INTERACTIVE ELEMENT C: EXPLORE PRICING PRICING PANEL (FROM CTA) -------------------- */}
      <AnimatePresence>
        {pricingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPricingModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-150 z-50 text-left"
            >
              
              {/* Header block */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 text-white text-left relative">
                <h3 className="font-display font-black text-2xl">Roofing Material Pricing Matrix</h3>
                <p className="text-white/60 text-xs mt-1">Understanding our core construction, replacement, and warranty costs.</p>
                <button 
                  onClick={() => setPricingModalOpen(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-white hover:bg-orange-500 transition-all cursor-pointer"
                  aria-label="Close Pricing Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[420px] text-slate-800">
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  We maintain strict architectural honesty with transparent per-square-foot modeling. Discover the best-fit system based on durability goals and property design types:
                </p>

                <div className="flex flex-col gap-4">
                  
                  {/* Metal details */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900 text-sm">Industrial Standing Seam Metal</span>
                        <span className="bg-orange-500/10 text-orange-600 font-bold px-2 py-0.5 rounded text-[10px]">Best Durability</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Sleek minimalist steel lines with active high-reflective rust-free sealants. High wind and fire resistance rating.</p>
                    </div>
                    <div className="text-left sm:text-right min-w-[120px]">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Est. Cost Frame</span>
                      <span className="text-orange-600 font-bold text-base block">$11.50 - $14.00</span>
                      <span className="text-[9px] text-slate-400 block">per square foot</span>
                    </div>
                  </div>

                  {/* Spanish clay tile */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900 text-sm">Spanish Terracotta Clay Tiles</span>
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">Lifetime Guarantee</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Classic architecture matching warm climates. Extremely heavy, long lasting structure insulating heat efficiently.</p>
                    </div>
                    <div className="text-left sm:text-right min-w-[120px]">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Est. Cost Frame</span>
                      <span className="text-orange-600 font-bold text-base block">$14.00 - $17.50</span>
                      <span className="text-[9px] text-slate-400 block">per square foot</span>
                    </div>
                  </div>

                  {/* Asphalt Shingle */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900 text-sm">Architectural Asphalt Shingles</span>
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">Most Budget-Friendly</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Reliable traditional 3-tab aesthetic that balances price and safety perfectly. Multiple architectural color variations.</p>
                    </div>
                    <div className="text-left sm:text-right min-w-[120px]">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Est. Cost Frame</span>
                      <span className="text-orange-600 font-bold text-base block">$6.00 - $8.50</span>
                      <span className="text-[9px] text-slate-400 block">per square foot</span>
                    </div>
                  </div>

                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-slate-800 text-xs">Ready for customized accurate pricing?</p>
                    <p className="text-[11px] text-slate-400">Launch our structural slider for direct blueprint output quotes.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPricingModalOpen(false);
                      resetEstimateForm();
                      setEstimateModalOpen(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Cost Estimator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      <ChatBot />

    </div>
  );
}
