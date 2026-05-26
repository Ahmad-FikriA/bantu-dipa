import React, { useState, useRef, useEffect, RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Calendar, Users, ArrowDown, Sparkles, MapPin, 
  CheckCircle, Shield, Phone, Mail, Search, Menu, X, 
  HelpCircle, ChevronDown, CheckCircle2, LayoutGrid, Award, 
  Plus, MessageSquare, HeartHandshake, Zap, ChevronRight, School
} from 'lucide-react';

import { CATEGORIES, INITIAL_REGISTRATIONS, TIMELINE_EVENTS, FAQ_LIST, Registration } from './types';
import CategoryCard from './components/CategoryCard';
import RegistrationForm from './components/RegistrationForm';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'all' | 'olahraga' | 'kreativitas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryForForm, setSelectedCategoryForForm] = useState<string | null>(null);
  const [isRegistartionOpen, setIsRegistrationOpen] = useState(false);
  const [registrationsList, setRegistrationsList] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('healthrise_registrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REGISTRATIONS;
      }
    }
    return INITIAL_REGISTRATIONS;
  });

  // Mobile Menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Success Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // DOM Refs
  const categoriesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const liveFeedRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('healthrise_registrations', JSON.stringify(registrationsList));
  }, [registrationsList]);

  // Handler for new registration
  const handleRegistrationSubmit = (newReg: Registration) => {
    const updated = [newReg, ...registrationsList];
    setRegistrationsList(updated);
    
    // Play sound / Show dynamic toast confirmation
    setToastMessage(`Pendaftaran ${newReg.schoolName} untuk ${CATEGORIES.find(c => c.id === newReg.categoryId)?.name} berhasil terekam!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Scroll Helpers
  const scrollTo = (elementRef: RefObject<HTMLDivElement | null>) => {
    setIsMobileMenuOpen(false);
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openRegistrationWithCategory = (catId?: string) => {
    setSelectedCategoryForForm(catId || CATEGORIES[0].id);
    setIsRegistrationOpen(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      if (registerRef.current) {
        registerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filter & Search logic
  const filteredCategories = CATEGORIES.filter(cat => {
    const matchesTab = activeTab === 'all' || cat.type === activeTab;
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cat.rules.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] selection:bg-brand-100 selection:text-brand-900 font-sans text-navy-900 relative">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-8 z-50 p-4 max-w-md bg-navy-900 text-white rounded-none shadow-xl flex gap-3 items-start border border-brand-500"
            id="success-toast-banner"
          >
            <CheckCircle className="h-5 w-5 text-brand-500 flex-none mt-0.5" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block text-brand-500">Sistem Terverifikasi</span>
              <p className="text-xs text-navy-50/90 leading-relaxed mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High Contrast Header */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-navy-900/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brandmark */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="brand-logo"
          >
            <div className="text-xl font-extrabold tracking-tighter uppercase text-navy-950">
              HealthRise <span className="text-brand-500">EduSport</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-navy-900">
            <button 
              onClick={() => scrollTo(categoriesRef)}
              className="hover:text-brand-500 transition cursor-pointer"
              id="nav-link-categories"
            >
              Cabang Lomba
            </button>
            <button 
              onClick={() => scrollTo(timelineRef)}
              className="hover:text-brand-500 transition cursor-pointer"
              id="nav-link-timeline"
            >
              Jadwal
            </button>
            <button 
              onClick={() => scrollTo(liveFeedRef)}
              className="hover:text-brand-500 transition flex items-center gap-1.5 cursor-pointer"
              id="nav-link-feed"
            >
              <span>Registrasi</span>
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            </button>
            <button 
              onClick={() => scrollTo(faqRef)}
              className="hover:text-brand-500 transition cursor-pointer"
              id="nav-link-faq"
            >
              FAQ
            </button>
          </nav>

          {/* Call to action button header */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => openRegistrationWithCategory()}
              className="py-3 px-6 bg-navy-900 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-widest rounded-none transition duration-150 cursor-pointer border border-transparent"
              id="header-cta-register"
            >
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-navy-600 hover:bg-navy-50 rounded-xl transition"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-navy-100 px-6 py-6 space-y-4 shadow-lg"
              id="mobile-nav-panel"
            >
              <button 
                onClick={() => scrollTo(categoriesRef)}
                className="block w-full text-left py-2 font-bold text-navy-800 hover:text-brand-600 transition"
              >
                1. Cabang Lomba Utama
              </button>
              <button 
                onClick={() => scrollTo(timelineRef)}
                className="block w-full text-left py-2 font-bold text-navy-800 hover:text-brand-600 transition"
              >
                2. Timeline Agenda
              </button>
              <button 
                onClick={() => scrollTo(liveFeedRef)}
                className="block w-full text-left py-2 font-bold text-navy-800 hover:text-brand-600 transition"
              >
                3. Live Registrasi (Feed)
              </button>
              <button 
                onClick={() => scrollTo(faqRef)}
                className="block w-full text-left py-2 font-bold text-navy-800 hover:text-brand-600 transition"
              >
                4. Pertanyaan (FAQ)
              </button>
              <div className="pt-4 border-t border-navy-100 flex flex-col gap-2">
                <button
                  onClick={() => openRegistrationWithCategory()}
                  className="w-full py-3 bg-brand-600 text-white font-extrabold text-sm rounded-xl text-center shadow-xs cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-[#faf9f6]" id="hero-masthead">
        {/* Editorial alignment lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-navy-900/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-center">
            
            {/* Left Texts & Calls to Action */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div>
                <span className="px-3.5 py-1.5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-none">Pendaftaran Terbuka Nasional 2026</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[76px] leading-[0.95] font-black uppercase tracking-tighter text-navy-950" id="hero-main-title">
                Tetap Sehat<br/>
                <span className="text-brand-500">Tetap Kreatif.</span>
              </h1>

              <p className="text-sm sm:text-base text-navy-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0" id="hero-subtitle">
                Kompetisi olahraga dan kreativitas bergengsi untuk siswa/siswi berprestasi. Raih gelar juaranya dan tunjukkan bakat terbaikmu!
              </p>

              {/* CTA Button layout matching exact user prompts */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => openRegistrationWithCategory()}
                  className="py-4.5 px-8 bg-navy-900 hover:bg-brand-500 text-[#faf9f6] font-black text-xs uppercase tracking-widest rounded-none shadow-none transition duration-150 inline-flex items-center gap-2 cursor-pointer"
                  id="cta-register-now"
                >
                  <Plus className="h-4 w-4" />
                  <span>Daftar sekarang</span>
                </button>
                <button
                  onClick={() => scrollTo(categoriesRef)}
                  className="py-4.5 px-6 bg-white hover:bg-navy-50 text-navy-900 font-black text-xs uppercase tracking-widest rounded-none transition inline-flex items-center gap-2 cursor-pointer border border-navy-900/15"
                  id="cta-view-categories"
                >
                  <span>Lihat kategori</span>
                  <ArrowDown className="h-4 w-4 text-brand-500 animate-bounce" />
                </button>
              </div>

              {/* Dynamic Metrics Badge Group */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white border border-navy-900/15 rounded-none mt-8 max-w-xl mx-auto lg:mx-0 text-left shadow-[4px_4px_0px_0px_#1a1a1b]">
                <div className="p-2 border-r last:border-0 border-navy-900/5">
                  <span className="text-2xl font-black text-navy-900 block font-mono">15JT+</span>
                  <span className="text-[9px] uppercase font-black tracking-wider text-navy-400 block">Total Hadiah</span>
                </div>
                <div className="p-2 border-r last:border-0 border-navy-900/5">
                  <span className="text-2xl font-black text-navy-900 block font-mono">32+</span>
                  <span className="text-[9px] uppercase font-black tracking-wider text-navy-400 block">Sekolah</span>
                </div>
                <div className="p-2 border-r last:border-0 border-navy-900/5">
                  <span className="text-2xl font-black text-brand-500 block font-mono">8+</span>
                  <span className="text-[9px] uppercase font-black tracking-wider text-navy-400 block">Kategori</span>
                </div>
                <div className="p-2 last:border-0">
                  <span className="text-2xl font-black text-navy-900 block font-mono">100%</span>
                  <span className="text-[9px] uppercase font-black tracking-wider text-navy-400 block">Sistem Fair</span>
                </div>
              </div>
            </div>

            {/* Right Side Visual Highlight Art (No messy gradients, premium visuals) */}
            <div className="lg:col-span-4 relative">
              <div className="p-1 bg-white border border-navy-900/15 rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,27,1)] hover:shadow-[6px_6px_0px_0px_#2d5bff] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
                <div className="bg-navy-900 text-white rounded-none p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-widest text-brand-100 font-black uppercase">OFFICIAL CERTIFICATE CARD</span>
                    <Award className="h-5 w-5 text-brand-500" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-lg font-black tracking-tight block uppercase">Rise Above Limits!</span>
                    <p className="text-xs text-navy-300 leading-relaxed">Gelar juara nasional menantangmu di cabang Esport, Futsal, Badminton, dan Kreativitas Poster/Sinema.</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-none border border-white/10 space-y-3">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[10px]">
                      <span className="text-white/60">Registrasi Gelombang I:</span>
                      <span className="font-bold text-brand-200">Sedang Dibuka</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-white/5 pt-2 font-semibold uppercase tracking-wider text-[10px]">
                      <span className="text-white/60">Sistem Pertandingan:</span>
                      <span className="font-bold text-brand-200">Fisik & Semi-Online</span>
                    </div>
                  </div>

                  {/* Aesthetic visual illustration block representing sports unity */}
                  <div className="flex items-center gap-3 bg-[#1a1a1b]/60 p-3.5 rounded-none border border-white/5">
                    <div className="p-2 bg-brand-500 rounded-none">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider block">Sertifikat Resmi Kemendikbud</span>
                      <span className="text-[10px] text-navy-300 leading-normal block">Ekuivalen dengan poin prestasi siswa pendaftaran PTN.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PORTAL WIZARD CONTAINER - CONDITIONAL TRIGGER */}
      <div ref={registerRef}>
        <AnimatePresence>
          {isRegistartionOpen && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="py-12 px-4 max-w-7xl mx-auto border-t border-navy-100"
              id="registration-portal-panel"
            >
              <div className="text-center mb-8">
                <div className="inline-flex gap-1 items-center bg-brand-50 text-brand-800 text-xs px-2.5 py-1 rounded-full font-bold mb-2">
                  <Plus className="h-3.5 w-3.5" /> Portal Pendaftaran Sekolah
                </div>
                <h2 className="text-3xl font-extrabold text-navy-950">Form Registrasi Peserta</h2>
                <p className="text-xs text-navy-400 mt-1 max-w-lg mx-auto">Isi form di bawah ini secara runut untuk mendapatkan ticket booking pertandingan resmi EduSport.</p>
              </div>

              <RegistrationForm
                initialCategoryId={selectedCategoryForForm || undefined}
                onCancel={() => {
                  setIsRegistrationOpen(false);
                  setSelectedCategoryForForm(null);
                }}
                onSubmitSuccess={handleRegistrationSubmit}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* CATEGORIES DIRECTORY SECTION */}
      <section ref={categoriesRef} className="py-20 bg-[#faf9f6] border-t border-navy-900/10" id="categories-directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Categories Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-none mb-2">
                <LayoutGrid className="h-3.5 w-3.5" /> Cabang Perlombaan
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-navy-950">Eksplorasi Cabang Olahraga & Kreativitas</h2>
              <p className="text-xs text-navy-400 mt-1 max-w-2xl font-medium">Kami menyediakan berbagai cabang pertandingan fisik (olahraga) dan digital (kreativitas) untuk melatih kecerdasan ganda.</p>
            </div>

            {/* Live Counter Info */}
            <div className="p-3 bg-white border border-navy-900/15 rounded-none text-xs flex items-center gap-2 shadow-[2px_2px_0px_#1a1a1b]">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-navy-400">Pendaftaran ditutup dalam: <strong className="text-brand-500 font-black">15 Hari (10 Juni)</strong></span>
            </div>
          </div>

          {/* Filtration Controls & Search Field */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Tab Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition cursor-pointer border ${
                  activeTab === 'all' 
                    ? 'bg-navy-900 text-white border-navy-900 shadow-none' 
                    : 'bg-white text-navy-900 border-navy-900/15 hover:border-brand-500 hover:text-brand-500'
                }`}
                id="tab-all-categories"
              >
                Semua Kategori ({CATEGORIES.length})
              </button>
              <button
                onClick={() => setActiveTab('olahraga')}
                className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition cursor-pointer border ${
                  activeTab === 'olahraga' 
                    ? 'bg-[#2d5bff] text-white border-[#2d5bff] shadow-none' 
                    : 'bg-white text-navy-900 border-navy-900/15 hover:border-[#2d5bff] hover:text-[#2d5bff]'
                }`}
                id="tab-sports-only"
              >
                Olahraga ({CATEGORIES.filter(c => c.type === 'olahraga').length})
              </button>
              <button
                onClick={() => setActiveTab('kreativitas')}
                className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition cursor-pointer border ${
                  activeTab === 'kreativitas' 
                    ? 'bg-navy-950 text-white border-navy-950 shadow-none' 
                    : 'bg-white text-navy-900 border-navy-900/15 hover:border-navy-950 hover:text-navy-950'
                }`}
                id="tab-creativity-only"
              >
                Kreativitas ({CATEGORIES.filter(c => c.type === 'kreativitas').length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 text-navy-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lomba (misal: futsal, mlbb)..."
                className="w-full bg-white text-xs rounded-none py-2.5 pl-10 pr-4 border border-navy-900/15 focus:outline-hidden focus:border-brand-500 font-bold uppercase tracking-wider text-[11px]"
                id="search-category-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 p-0.5 text-navy-400 hover:text-navy-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of cards */}
          {filteredCategories.length > 0 ? (
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              id="categories-card-grid"
            >
              <AnimatePresence>
                {filteredCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onRegisterClick={(id) => openRegistrationWithCategory(id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-navy-100 rounded-2xl p-6" id="empty-categories-alert">
              <HelpCircle className="h-12 w-12 text-navy-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy-900">Cabang Lomba Tidak Ditemukan</h3>
              <p className="text-xs text-navy-400 mt-1 max-w-sm mx-auto">Tidak dapat melacak cabang kompetisi dengan kata kunci &quot;{searchQuery}&quot;. Coba cari kata kunci olahraga atau kreativitas lainnya.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-4 px-4 py-2 bg-navy-50 text-navy-700 hover:bg-navy-100 rounded-lg text-xs font-bold transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

        </div>
      </section>

      {/* TIMELINE ARCHITECTURE SECTION */}
      <section ref={timelineRef} className="py-20 bg-[#faf9f6]/40 border-t border-navy-900/10" id="timeline-roadmap">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="px-3 py-1.5 bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest rounded-none">
              Agenda Acara 2026
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-navy-950 mt-3">Jadwal & Agenda Penting EduSport</h2>
            <p className="text-xs text-navy-400 mt-1 max-w-lg mx-auto">Pastikan sekolah Anda tidak terlewat deadline rangkaian gelombang pendaftaran, technical meeting hingga Match day.</p>
          </div>

          {/* Beautiful Flowing Timeline Track */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative" id="timeline-grids">
            {TIMELINE_EVENTS.map((evt, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-navy-900/15 hover:border-brand-500 rounded-none relative shadow-none hover:shadow-[4px_4px_0px_0px_#2d5bff] transition-all flex flex-col justify-between"
              >
                {/* Visual order bubble badge */}
                <div className="absolute top-4 right-4 h-7 w-7 rounded-none border border-navy-900/10 bg-brand-50 font-mono text-xs font-black text-brand-500 flex items-center justify-center">
                  0{index + 1}
                </div>

                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-brand-500 block">{evt.date}</span>
                  <h3 className="text-base font-extrabold uppercase tracking-tight text-navy-950 mt-2 mb-1">{evt.title}</h3>
                  <p className="text-xs text-navy-400 leading-relaxed font-normal">{evt.desc}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-navy-900/10 flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none border ${
                    evt.status === 'Berlangsung' 
                      ? 'bg-brand-50 text-brand-500 border-brand-500/30' 
                      : 'bg-navy-50 text-navy-600 border-navy-600/20'
                  }`}>
                    {evt.status}
                  </span>
                  
                  {index < 3 && (
                    <ChevronRight className="hidden md:block h-4 w-4 text-navy-300 absolute -right-3.5 top-1/2 -translate-y-1/2 z-10" />
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* REGISTRATION LIVE FEED / LEADERBOARD SUMMARY SECTION */}
      <section ref={liveFeedRef} className="py-20 bg-[#fafbfd] border-t border-navy-100" id="live-registration-feed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left information Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-none">
                <span className="h-1.5 w-1.5 bg-white animate-pulse" />
                <span>Live Feed Registrasi</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-navy-950 leading-tight">Daftar Pendaftar Terkini & Status Tim</h2>
              <p className="text-xs text-navy-400 leading-relaxed font-normal">
                Daftar tim sekolah yang baru saja melakukan submisi pendaftaran akan terupdate secara instan di feed ini. Total terdapat <strong className="text-navy-950 font-black">{registrationsList.length} tim terdaftar</strong> dari wilayah DKI Jakarta & sekitarnya.
              </p>
              
              <div className="p-5 bg-white border border-navy-900/15 rounded-none text-xs space-y-3 shadow-none">
                <span className="font-black text-navy-800 uppercase text-[10px] block border-b border-navy-900/10 pb-1">Ketentuan Verifikasi:</span>
                <ul className="space-y-2 text-navy-400 font-normal">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 flex-none" />
                    <span>Verifikasi berkas berlangsung maksimal 1x24 jam setelah bukti pembayaran valid diupload.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 flex-none" />
                    <span>Anggota dan NISN akan diverifikasi kesesuaian rapor/kartu pelajar siswa.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Feed Stream Column */}
            <div className="lg:col-span-7 bg-white border border-navy-900/15 rounded-none p-5 md:p-6 shadow-[5px_5px_0px_0px_#1a1a1b]">
              <h3 className="text-xs font-black text-navy-950 uppercase tracking-widest mb-4 border-b border-navy-900/10 pb-2">Stream Aktivitas Terbaru:</h3>
              
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2" id="live-stream-items">
                {registrationsList.map((reg, index) => {
                  const cat = CATEGORIES.find(c => c.id === reg.categoryId);
                  const isUserCreated = reg.id.startsWith('REG-2026-') && !['REG-2026-001', 'REG-2026-002', 'REG-2026-003', 'REG-2026-004'].includes(reg.id);
                  
                  return (
                    <div 
                      key={reg.id}
                      className={`p-4 rounded-none border transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                        isUserCreated 
                          ? 'bg-brand-50/50 border-brand-500 shadow-none animate-fade-in' 
                          : 'bg-white border-navy-900/10'
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`p-2 rounded-none border ${
                          isUserCreated ? 'bg-brand-100/50 border-brand-500 text-brand-500' : 'bg-navy-50 border-navy-900/5 text-navy-600'
                        }`}>
                          <School className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-navy-950 sm:text-sm">{reg.schoolName}</h4>
                            {isUserCreated && (
                              <span className="px-1.5 py-0.5 bg-brand-500 text-white text-[8px] font-black rounded-none uppercase tracking-wider">
                                Anda
                              </span>
                            )}
                          </div>
                          
                          <div className="text-[10px] uppercase font-black tracking-wider text-navy-400 mt-1 flex flex-wrap items-center gap-x-2">
                            <span>Lomba: <strong className="text-navy-900">{cat?.name || 'Kategori'}</strong></span>
                            <span>•</span>
                            <span>Pemain: <strong className="text-navy-900">{reg.participants.length} Siswa</strong></span>
                            {reg.teamName && (
                              <>
                                <span>•</span>
                                <span>Tim: <strong className="text-brand-500">{reg.teamName}</strong></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="text-right flex sm:flex-col justify-between sm:justify-center items-end w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-dashed border-navy-900/10">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none inline-flex items-center gap-1 border ${
                          reg.status === 'Terverifikasi' 
                            ? 'bg-brand-55 bg-brand-50 text-brand-500 border-brand-500/20' 
                            : 'bg-amber-50 text-amber-500 border-amber-500/20'
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${reg.status === 'Terverifikasi' ? 'bg-brand-500' : 'bg-amber-505 bg-amber-500 animate-pulse'}`} />
                          {reg.status}
                        </span>
                        <span className="text-[10px] font-mono text-navy-400 block mt-1.5 sm:mt-1 font-semibold">
                          {new Date(reg.registeredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS / VALUE PROPS BANNER */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden" id="key-values">
        <div className="absolute top-0 left-0 p-8 opacity-5">
          <Trophy className="h-48 w-48" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-500 bg-brand-50 text-[10px] px-3.5 py-1.5 uppercase tracking-widest block font-black w-fit mx-auto border border-brand-500/20 rounded-none">Kenapa Memilih Kami?</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-4">Ukir Prestasi Dengan Sertifikasi Kompetitif</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-navy-950 border border-white/10 rounded-none relative shadow-[4px_4px_0px_0px_#2d5bff]">
              <div className="p-3 bg-white/5 border border-white/10 text-brand-500 rounded-none w-fit mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white">Wasit & Juri Berlisensi</h3>
              <p className="text-xs text-navy-200 leading-relaxed">Seluruh pertandingan olahraga dipimpin oleh juri dan wasit bersertifikasi PGRI dan PBSI untuk menjamin sportivitas tanpa bias.</p>
            </div>

            <div className="p-6 bg-navy-950 border border-white/10 rounded-none relative shadow-[4px_4px_0px_0px_#2d5bff]">
              <div className="p-3 bg-white/5 border border-white/10 text-brand-500 rounded-none w-fit mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white">Sertifikat Digital Nasional</h3>
              <p className="text-xs text-navy-200 leading-relaxed">Tiap peserta & official mendapatkan e-sertifikat resmi bernomor induk pendaftaran yang terintegrasi dengan portofolio SNMPTN/PPDB Jalur Prestasi.</p>
            </div>

            <div className="p-6 bg-navy-950 border border-white/10 rounded-none relative shadow-[4px_4px_0px_0px_#2d5bff]">
              <div className="p-3 bg-white/5 border border-white/10 text-brand-500 rounded-none w-fit mb-4">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white">Fasilitas Lengkap & Sehat</h3>
              <p className="text-xs text-navy-200 leading-relaxed">GOR didukung tim medis PMI siaga penuh, air mineral hidrasi gratis bagi seluruh tim atletik, serta live board score digital.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <section ref={faqRef} className="py-20 bg-white border-t border-navy-900/10" id="faqs-accordion">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="px-3 py-1.5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-none">Tanya Jawab</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-navy-950 mt-2">Pertanyaan Populer Terkait Pendaftaran</h2>
            <p className="text-xs text-navy-400 mt-1">Masih bingung seputar ketentuan administrasi pendaftaran lomba? Temukan jawabannya di bawah ini.</p>
          </div>

          <div className="space-y-4" id="faq-accordions-group">
            {FAQ_LIST.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="border border-navy-900/15 rounded-none overflow-hidden bg-white transition-all duration-200 shadow-none hover:border-brand-500"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left font-bold text-navy-900 hover:bg-navy-50/50 transition cursor-pointer"
                    id={`btn-faq-item-${index}`}
                  >
                    <span className="text-xs uppercase tracking-wider pr-4 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-brand-500 flex-none" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`h-4.5 w-4.5 text-navy-400 transition-transform duration-200 flex-none ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-dashed border-navy-900/10 bg-[#faf9f6]"
                      >
                        <div className="p-5 text-xs text-navy-400 leading-relaxed font-normal">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FOOTER ARCHITECTURE */}
      <footer className="bg-white border-t border-navy-900/10 pt-16 pb-8" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-navy-900/10">
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-brand-500 rounded-none flex items-center justify-center font-extrabold text-white">
                  <Trophy className="h-4.5 w-4.5" />
                </div>
                <span className="text-base font-black uppercase tracking-tight text-navy-950">EduSport 2026</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed font-normal max-w-sm">
                Ajang kompetisi olahraga dan visual kreativitas digital tingkat nasional bergengsi bagi siswa SMA, SMK, MA sederajat terpercaya se-Indonesia.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-navy-600 pt-1">
                <a href="mailto:info@healthrise-edusport.id" className="flex items-center gap-1.5 hover:text-brand-500 transition">
                  <Mail className="h-4 w-4" /> info@healthrise-edusport.id
                </a>
                <a href="tel:08123456789" className="flex items-center gap-1.5 hover:text-brand-500 transition">
                  <Phone className="h-4 w-4" /> Whatsapp Panitia
                </a>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <h4 className="text-[10px] font-black text-navy-900 uppercase tracking-widest mb-4">Navigasi Landing</h4>
              <ul className="space-y-2.5 text-xs text-navy-400">
                <li>
                  <button onClick={() => scrollTo(categoriesRef)} className="hover:text-brand-500 transition text-left cursor-pointer">
                    Daftar Cabang Lomba
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(timelineRef)} className="hover:text-brand-500 transition text-left cursor-pointer">
                    Roadmap & Agenda
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(liveFeedRef)} className="hover:text-brand-500 transition text-left cursor-pointer">
                    Live Registrasi List
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(faqRef)} className="hover:text-brand-500 transition text-left cursor-pointer">
                    Panduan & FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Location Spot */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-navy-900 uppercase tracking-widest">Tempat Pelaksanaan</h4>
              <div className="flex gap-2 items-start text-xs text-navy-400 leading-relaxed font-normal">
                <MapPin className="h-4.5 w-4.5 text-brand-500 mt-0.5 flex-none" />
                <span>GOR Gelanggang Olahraga Remaja EduSport, Menteng, Kota Jakarta Pusat, DKI Jakarta – 10310.</span>
              </div>
            </div>
          </div>

          {/* Social details & copyright */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-navy-400">
            <span className="font-medium">© 2026 HealthRise EduSport Committee. All rights reserved.</span>
            <span className="flex items-center gap-1.5 font-bold text-navy-900 uppercase tracking-wider text-[10px]">
              <Shield className="h-4 w-4 text-brand-500" /> Platform Pendaftaran Digital Terverifikasi
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
