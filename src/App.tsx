import { useRef, useState, useEffect } from 'react';
import { Instagram, Mail, ArrowRight, ChevronRight, ChevronLeft, Camera, Sparkles, CheckCircle2, Plus, Minus, Menu, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { get, set } from 'idb-keyval';

const PROCESS_STEPS = [
  {
    icon: <Camera size={32} className="text-brand-orange" />,
    title: "1. Send Raw Photos",
    desc: "Share your unedited, raw food photos from any camera or smartphone."
  },
  {
    icon: <Sparkles size={32} className="text-brand-orange" />,
    title: "2. AI Magic",
    desc: "I use advanced AI to retouch, color-grade, and enhance every delicious detail."
  },
  {
    icon: <CheckCircle2 size={32} className="text-brand-orange" />,
    title: "3. Get Results",
    desc: "Receive mouth-watering, social-media-ready images within 24 hours."
  }
];

const BEFORE_AFTER_DATA = [
  { 
    id: 1, 
    seed: 'brownie',
    beforeImage: 'https://i.postimg.cc/44hB6S5P/reimagen_everything_same_202603281751.jpg',
    afterImage: 'https://i.postimg.cc/sXC1txkG/reimagen-everything-same-202603281751-(1).jpg'
  },
  { 
    id: 2, 
    seed: 'pizza',
    beforeImage: 'https://i.postimg.cc/7P2r5XTP/Professional-studio-food-202603281822.jpg',
    afterImage: 'https://i.postimg.cc/rwYfCXvv/studio-level-bna-202603281826.jpg'
  },
  { 
    id: 3, 
    seed: 'sushi',
    beforeImage: 'https://i.postimg.cc/BQPbQxJF/everything-same-2K-202603281829.jpg',
    afterImage: 'https://i.postimg.cc/26Bj8YDY/studio-level-enhancement-202603281831.jpg'
  },
  { 
    id: 4, 
    seed: 'pasta',
    beforeImage: 'https://i.postimg.cc/BvFncFhS/everything-same-2K-202603281842.jpg',
    afterImage: 'https://i.postimg.cc/rFGGgdPC/studio-level-enhancement-202603281841.jpg'
  },
  { 
    id: 5, 
    seed: 'steak',
    beforeImage: 'https://i.postimg.cc/RhKYgMkY/everything-same-2K-202603281850.jpg',
    afterImage: 'https://i.postimg.cc/SNmdB7Cm/studio-level-enhancement-202603281852.jpg'
  },
  { 
    id: 6, 
    seed: 'dessert',
    beforeImage: 'https://i.postimg.cc/F1t4KC4D/everything-same-2K-202603281856.jpg',
    afterImage: 'https://i.postimg.cc/QxS2wMBp/studio-level-enhancement-202603281900.jpg'
  },
];

const FAQ_DATA = [
  {
    question: "How long does it take?",
    answer: "You will receive your fully edited, high-quality images within 24-48 hours."
  },
  {
    question: "Do I need a professional camera?",
    answer: "No, smartphone photos work perfectly fine! My AI process enhances and upscales even standard mobile shots."
  },
  {
    question: "What resolution will I get?",
    answer: "You will receive high-res, 4K quality images ready for social media, print, or delivery apps."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

function FAQItem({ faq, index }: { faq: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
      style={{ perspective: '1000px' }}
      className="mb-4"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex items-center justify-between transition-colors z-10 relative"
        whileHover={{ scale: 1.01, rotateX: 2 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-lg font-bold text-white/90">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-brand-orange"
        >
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, rotateX: -90, y: -20 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0, y: 0 }}
            exit={{ height: 0, opacity: 0, rotateX: -90, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            style={{ transformOrigin: "top center" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 text-white/60 leading-relaxed border-x border-b border-white/5 rounded-b-2xl bg-white/[0.01] -mt-4 pt-8">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BeforeAfterSlider({ item, onUpdateImage }: { item: any, onUpdateImage: (id: number, type: 'before' | 'after', url: string) => void }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateImage(item.id, type, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden group select-none cursor-ew-resize"
      onMouseDown={(e) => { 
        if ((e.target as HTMLElement).closest('button')) return;
        setIsDragging(true); handleMove(e.clientX); 
      }}
      onTouchStart={(e) => { 
        if ((e.target as HTMLElement).closest('button')) return;
        setIsDragging(true); handleMove(e.touches[0].clientX); 
      }}
    >
      {/* After Image (Bottom/Right) */}
      <img 
        src={item.afterImage || `https://picsum.photos/seed/${item.seed}/800/1000`} 
        alt="After" 
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${!item.afterImage ? 'saturate-150 brightness-110' : ''}`}
        referrerPolicy="no-referrer"
        draggable={false}
      />
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
        <span className="text-xs font-bold tracking-widest bg-brand-orange px-3 py-1.5 rounded shadow-lg pointer-events-none">AFTER</span>
      </div>

      {/* Before Image (Top/Left) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img 
          src={item.beforeImage || `https://picsum.photos/seed/${item.seed}/800/1000`} 
          alt="Before" 
          className={`absolute inset-0 w-full h-full object-cover ${!item.beforeImage ? 'grayscale brightness-50 contrast-75' : ''}`}
          referrerPolicy="no-referrer"
          draggable={false}
        />
        {!item.beforeImage && <div className="absolute inset-0 bg-black/20" />}
      </div>
      
      {/* Before Label (Outside clipped div so it's always accessible) */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
        <span className="text-xs font-bold tracking-widest bg-black/60 px-3 py-1.5 rounded backdrop-blur-sm pointer-events-none">BEFORE</span>
      </div>

      {/* Hidden File Inputs */}
      <input type="file" accept="image/*" className="hidden" ref={beforeInputRef} onChange={(e) => handleFileChange(e, 'before')} />
      <input type="file" accept="image/*" className="hidden" ref={afterInputRef} onChange={(e) => handleFileChange(e, 'after')} />

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
          <ChevronLeft size={18} className="text-black/80" />
          <ChevronRight size={18} className="text-black/80 -ml-2" />
        </div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-ew-resize');
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-brand-orange rounded-full pointer-events-none z-[10000] hidden md:block"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      {/* Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-brand-orange/40 bg-brand-orange/10 rounded-full pointer-events-none z-[9999] hidden md:block backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(232,80,26,0.2)" : "rgba(232,80,26,0.1)",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [galleryData, setGalleryData] = useState(BEFORE_AFTER_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    get('studioGalleryData_v13').then((saved) => {
      if (saved) {
        setGalleryData(saved);
      }
      setIsDataLoaded(true);
    }).catch((e) => {
      console.error("Failed to load gallery data from IndexedDB", e);
      setIsDataLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      set('studioGalleryData_v13', galleryData).catch((e) => {
        console.error("Failed to save gallery data to IndexedDB", e);
      });
    }
  }, [galleryData, isDataLoaded]);

  const handleUpdateImage = (id: number, type: 'before' | 'after', imageUrl: string) => {
    setGalleryData(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [type === 'before' ? 'beforeImage' : 'afterImage']: imageUrl };
      }
      return item;
    }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-orange selection:text-white bg-[#0d0d0d] relative">
      <CustomCursor />
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 flex items-center justify-between z-50">
        <div className="font-bubbly text-2xl text-white tracking-wide z-50">STUDiO</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Desktop CTA */}
        <a 
          href="https://instagram.com/studiobyibrahim" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden md:flex text-brand-orange font-bold text-sm items-center gap-2 hover:text-brand-orange/80 transition-colors"
        >
          DM on Instagram <ArrowRight size={16} />
        </a>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white/80 hover:text-white z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white/80 hover:text-white">Home</a>
            <a href="#process" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white/80 hover:text-white">Process</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white/80 hover:text-white">Gallery</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white/80 hover:text-white">FAQ</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white/80 hover:text-white">Contact</a>
            
            <a 
              href="https://instagram.com/studiobyibrahim" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-8 flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-full font-bold"
            >
              <Instagram size={20} />
              DM on Instagram
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="pt-48 pb-20 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <motion.p variants={itemVariants} className="text-white/60 mb-6 text-sm md:text-base">
            Dedicated to mouth-watering visuals, welcome to
          </motion.p>
          
          <motion.h1 variants={itemVariants} className="font-bubbly mb-8 flex flex-col items-center leading-[0.85] drop-shadow-lg uppercase">
            <span className="text-7xl md:text-[140px] tracking-tight text-white">STUDiO</span>
            <span className="text-5xl md:text-[100px] tracking-tight text-brand-orange">by Ibrahim</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-white/60 mb-12 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            AI-powered food photography with a multidisciplinary approach for restaurants and small brand-conscious food companies.
          </motion.p>
          
          <motion.a 
            variants={itemVariants}
            whileHover={{ x: 5 }}
            href="https://instagram.com/studiobyibrahim" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-orange font-bold text-lg transition-all"
          >
            DM on Instagram <ChevronRight size={20} />
          </motion.a>
        </motion.div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-6 relative z-10 bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">How it works.</h2>
            <p className="text-white/50">Three simple steps to mouth-watering visuals.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-[50px] rounded-full group-hover:bg-brand-orange/10 transition-colors" />
                <div className="mb-6 bg-black/40 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white/90 mb-3">{step.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Gallery (Styled like the bottom card in the image) */}
      <section id="gallery" className="pb-24 px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white/[0.03] border border-white/10 border-t-brand-orange/40 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_-20px_50px_-20px_rgba(232,80,26,0.2)]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-brand-orange/20 blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col items-center justify-center gap-2 mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white/90">Quick look at my work.</h2>
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={() => scroll('left')}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-brand-orange/80 hover:border-brand-orange transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <p className="text-white/50 text-sm flex items-center gap-2 animate-pulse mx-4">
                  Swipe or click <ArrowRight size={14} />
                </p>
                <button 
                  onClick={() => scroll('right')}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-brand-orange/80 hover:border-brand-orange transition-all backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar px-4 -mx-4 relative z-10 scroll-smooth" 
              style={{ perspective: '1200px' }}
            >
              {galleryData.map((item) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0.3, rotateY: 25, rotateX: 10, scale: 0.85, z: -100 }}
                  whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1, z: 0 }}
                  whileHover={{ scale: 1.02, rotateY: -2, rotateX: 2, z: 20 }}
                  viewport={{ amount: 0.6 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="min-w-full w-full snap-center bg-black/40 rounded-[32px] overflow-hidden border border-white/5 flex flex-col shadow-2xl transition-shadow hover:shadow-[0_0_40px_-10px_rgba(232,80,26,0.3)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <BeforeAfterSlider item={item} onUpdateImage={handleUpdateImage} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 relative z-10 bg-black/20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">Got questions?</h2>
            <p className="text-white/50">Everything you need to know about the process.</p>
          </motion.div>

          <div className="flex flex-col gap-2" style={{ perspective: '1000px' }}>
            {FAQ_DATA.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your menu?</h2>
          <p className="text-white/60 mb-12 text-lg">Get professional food photography powered by AI. Fast, affordable, and high-quality.</p>
          <div className="flex flex-col items-center gap-6 justify-center">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://instagram.com/studiobyibrahim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-bold transition-colors shadow-[0_0_30px_-10px_rgba(232,80,26,0.4)]"
            >
              <Instagram size={20} />
              DM on Instagram
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05, color: "#ffffff" }}
              href="mailto:studiobyibrahim@gmail.com" 
              className="text-white/60 transition-colors text-lg font-medium"
            >
              studiobyibrahim@gmail.com
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-white/20 text-xs border-t border-white/5">
        <p>© {new Date().getFullYear()} Studio by Ibrahim. All rights reserved.</p>
      </footer>

      {/* Custom Styles for hiding scrollbar and cursor */}
      <style>{`
        @media (pointer: fine) {
          body, a, button, .cursor-ew-resize {
            cursor: none !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
