'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Activity,
  Stethoscope,
  Users,
  Award,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Building2,
  Pill,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Star,
  UserCheck,
  Microscope,
  Baby,
  Bone,
  Brain,
  Heart,
  BriefcaseMedical,
  LogIn,
  Check,
  ArrowUpRight,
} from 'lucide-react';

// Framer motion animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeDepartment, setActiveDepartment] = useState(0);

  const partners = [
    'Mayo Clinical Network',
    'Johns Hopkins Medicine',
    'Stanford Health Care',
    'Cleveland Clinic Allied',
    'Mount Sinai Health',
    'Memorial Sloan Kettering',
    'Massachusetts General',
  ];

  const departments = [
    {
      id: 'pediatrics',
      title: 'Pediatrics',
      icon: Baby,
      tagline: 'Compassionate Care for Every Stage of Childhood',
      description:
        'Our pediatrics department ensures your child’s healthy growth, development, and emotional well-being through preventive and personalized care.',
      points: [
        'Wellness checkups and vaccination programs',
        'Growth and nutrition monitoring',
        'Child developmental assessments',
        'Preventive care and family education',
        '24×7 pediatric emergency response',
      ],
      badge: 'Child Health',
      stats: '12+ Pediatricians',
      image: 'https://framerusercontent.com/images/OhVZTS3dElIxK1Zxpz5HIggHQA8.png',
    },
    {
      id: 'orthopedics',
      title: 'Orthopedics',
      icon: Bone,
      tagline: 'Advanced Bone and Joint Care for Better Mobility',
      description:
        'From sports injuries to complex orthopedic surgeries, we restore confidence in your movement with cutting-edge diagnostics and physical therapy.',
      points: [
        'Sports injury diagnosis and recovery',
        'Joint replacement and spinal care',
        'Trauma and fracture management',
        'Rehabilitation and physiotherapy support',
        'Personalized surgical treatment plans',
      ],
      badge: 'Joint & Spine',
      stats: '8 Board Surgeons',
      image: 'https://framerusercontent.com/images/js5oJLlObYjJL8Rfq2iwUlXwYIE.png',
    },
    {
      id: 'cardiology',
      title: 'Cardiology',
      icon: Heart,
      tagline: 'Personalized Heart Health for Every Beat',
      description:
        'Comprehensive heart care combining prevention, monitoring, and advanced cardiac diagnostics to keep your cardiovascular system at its healthiest.',
      points: [
        'ECG, ECHO, and cardiac stress testing',
        'Hypertension and cholesterol management',
        'Lifestyle modification and wellness programs',
        'Emergency cardiac response care',
        'Continuous remote heart monitoring follow-up',
      ],
      badge: 'Cardiovascular',
      stats: '15+ Cardiologists',
      image: 'https://framerusercontent.com/images/ttJzm54OVCVKYkSIpitnos7wvbY.png',
    },
    {
      id: 'neurology',
      title: 'Neurology',
      icon: Brain,
      tagline: 'Precision Brain and Nerve Care You Can Trust',
      description:
        'Our neurology experts use advanced imaging and personalized therapies to diagnose and treat brain, nerve, and spine conditions effectively.',
      points: [
        'EEG, MRI, and brain scan evaluations',
        'Stroke and seizure management',
        'Headache and chronic pain treatment programs',
        'Memory and cognitive assessments',
        'Nerve rehabilitation and specialized therapy',
      ],
      badge: 'Neuro Care',
      stats: '10+ Neurologists',
      image: 'https://framerusercontent.com/images/OhVZTS3dElIxK1Zxpz5HIggHQA8.png',
    },
    {
      id: 'gastroenterology',
      title: 'Gastroenterology',
      icon: Activity,
      tagline: 'Digestive Health and Wellness, Simplified',
      description:
        'Focused on diagnosing and treating gastrointestinal conditions through advanced endoscopy, diet planning, and holistic digestive care.',
      points: [
        'Endoscopy and colonoscopy diagnostics',
        'Nutrition and personalized dietary management',
        'Liver, pancreas, and gut disorder care',
        'Lifestyle consultation for long-term digestion',
        'Preventive screening and health education',
      ],
      badge: 'Digestive Health',
      stats: '6 Specialists',
      image: 'https://framerusercontent.com/images/pXtMhwdgqvbd8B02WTUidcMH9s.png',
    },
    {
      id: 'general',
      title: 'General Care',
      icon: BriefcaseMedical,
      tagline: 'Everyday Health and Preventive Medical Support',
      description:
        'Our general care specialists provide trusted diagnosis, treatment, and continuous health monitoring for your everyday medical needs.',
      points: [
        'Annual physicals and health consultations',
        'Chronic disease management & prevention',
        'Vaccination and medication review',
        'Preventive and lifestyle health advice',
        'Family wellness and continuous follow-up care',
      ],
      badge: 'Primary Care',
      stats: '20+ Clinicians',
      image: 'https://framerusercontent.com/images/TwBLFuf0CZ6k3CBKWE7kBoTQxVc.png',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Book Appointment',
      desc: 'Easily schedule your visit online. Choose your preferred specialist, date, and convenient time slot without waiting in line.',
      badge: 'Online Booking',
    },
    {
      num: '02',
      title: 'Clinical Consultation',
      desc: 'Meet with caring, board-certified specialists who listen closely to your concerns, review history, and formulate a care pathway.',
      badge: 'Expert Review',
    },
    {
      num: '03',
      title: 'Personalized Treatment',
      desc: 'Receive tailored care, inpatient admission if required, and instantly generated digital e-prescriptions sent straight to your portal.',
      badge: 'Digital Care',
    },
    {
      num: '04',
      title: 'Continuous Follow-up',
      desc: 'Stay connected even after your visit. Access clinical test results, track medicine dispensation, and schedule follow-ups seamlessly.',
      badge: 'Recovery Support',
    },
  ];

  const faqs = [
    {
      q: 'How do I book an appointment?',
      a: 'You can easily book online by clicking the "Book Appointment" button. Select your department, preferred specialist, date, and time slot. You can also sign in to your Patient Portal to manage or reschedule existing bookings at any time.',
    },
    {
      q: 'Do you offer online or telehealth consultations?',
      a: 'Yes. Our platform provides secure, high-definition video consultations with board-certified physicians, with automated digital e-prescriptions and clinical notes updated directly to your medical file.',
    },
    {
      q: 'What insurance and payment options are accepted?',
      a: 'We work with all major health insurance providers and medical networks. We also support seamless self-pay options with clear, itemized digital invoicing available in your account.',
    },
    {
      q: 'Are your doctors qualified specialists?',
      a: 'All our physicians are fully board-certified specialists with an average of 15+ years of active clinical practice across leading teaching hospitals and specialized medical centers.',
    },
    {
      q: 'What should I bring for my first clinic visit?',
      a: 'Please bring a valid photo ID, your insurance card (if applicable), and any previous diagnostic scans or medical records. If you registered through our Patient Portal, your profile is already synced.',
    },
    {
      q: 'How is patient medical privacy protected?',
      a: 'Our Hospital Operating System is built with enterprise HIPAA-compliant security standards, end-to-end data encryption, and role-based access logs so only your authorized clinical team can review your medical charts.',
    },
  ];

  const testimonials = [
    {
      name: 'Daniel Thompson',
      role: 'Verified Patient',
      comment:
        'The doctors truly care, explain clearly, and make me feel completely comfortable. The online portal made managing appointments and seeing my prescription effortless.',
      rating: 5,
    },
    {
      name: 'Ryan Mitchell',
      role: 'Outpatient Care',
      comment:
        'I booked my cardiologist follow-up online within 2 minutes. The staff was attentive, punctual, and the digital prescriptions were already at the pharmacy when I arrived.',
      rating: 5,
    },
    {
      name: 'Joshua Reed',
      role: 'Family Medicine',
      comment:
        'My experience was exceptional. Everyone was kind and understanding. Managing my family’s health records and scheduling checkups has never been this stress-free.',
      rating: 5,
    },
    {
      name: 'Emily Rogers',
      role: 'Pediatric Care',
      comment:
        'I am deeply impressed by the pediatric team. Booking online was effortless, and the doctors were gentle and caring with my daughter. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E293B] font-sans antialiased selection:bg-[#1A5ABA]/20 selection:text-[#1A5ABA] overflow-x-hidden">
      {/* -------------------- Top Emergency Bar -------------------- */}
      <div className="bg-[#1A5ABA] text-white py-2 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Hospital Facility & Emergency Care Center Active</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <Phone className="w-3.5 h-3.5" /> Emergency Hotline: +1 (415) 555-0198
            </span>
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5" /> 123 Healthcare Blvd, Medical District
            </span>
          </div>
        </div>
      </div>

      {/* -------------------- Navigation Header -------------------- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1A5ABA] to-[#3B82F6] flex items-center justify-center text-white shadow-md shadow-blue-600/20"
            >
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Healcure
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                  H-OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Modern Hospital Operating System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-[#1A5ABA] transition-colors">
              Specialties
            </a>
            <a href="#features" className="hover:text-[#1A5ABA] transition-colors">
              Why Us
            </a>
            <a href="#facilities" className="hover:text-[#1A5ABA] transition-colors">
              Facilities
            </a>
            <a href="#workflow" className="hover:text-[#1A5ABA] transition-colors">
              How It Works
            </a>
            <a href="#portals" className="hover:text-[#1A5ABA] transition-colors">
              Portals
            </a>
            <a href="#testimonials" className="hover:text-[#1A5ABA] transition-colors">
              Reviews
            </a>
            <a href="#faq" className="hover:text-[#1A5ABA] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs (Patient Login & Staff Portal) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/staff/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
            >
              <Stethoscope className="w-4 h-4 text-[#1A5ABA]" />
              <span>Staff Portal</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A5ABA] hover:bg-[#154694] text-white text-sm font-semibold shadow-md shadow-blue-700/20 hover:shadow-lg hover:shadow-blue-700/30 transition-all duration-200 active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700">
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  Specialties
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  Why Us
                </a>
                <a
                  href="#facilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  Facilities
                </a>
                <a
                  href="#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  How It Works
                </a>
                <a
                  href="#portals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  Portals
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-slate-50"
                >
                  FAQ
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-50 text-[#1A5ABA] text-sm font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Patient Sign In
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/staff/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Clinical Staff Portal
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* -------------------- Hero Section with Framer-style Animations -------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-200/50 via-sky-100/30 to-transparent pointer-events-none -z-10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            {/* Pill Badge */}
            <motion.div variants={fadeInUp} className="inline-block">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20 shadow-2xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A5ABA] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A5ABA]"></span>
                </span>
                <span>Trusted Healthcare Platform</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">20,000+ Patients Worldwide</span>
              </div>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Healthcare for Good.{' '}
              <span className="text-[#1A5ABA] block sm:inline">
                Today. Tomorrow. Always.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal"
            >
              Take charge of your well-being and explore the many advantages of modern healthcare through our unified clinical platform. Seamless consultations, inpatient bed allocation, and digital prescriptions.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1A5ABA] hover:bg-[#144794] text-white text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all duration-200"
                >
                  <span>Book An Appointment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/staff/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-base font-semibold shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <Stethoscope className="w-4 h-4 text-[#1A5ABA]" />
                  <span>Clinical Staff Portal</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Social Proof & Rating Badge */}
            <motion.div
              variants={fadeInUp}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500 font-medium"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-slate-800 font-bold text-sm">4.9/5</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Based on 20,000+ verified clinical outcomes & patient reviews</span>
            </motion.div>
          </motion.div>

          {/* Hero Showcase Image with Floating Animated Badges */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-900/10 bg-slate-100">
              <img
                src="https://framerusercontent.com/images/yrivhbAv1ml2wj4JezJhA7eOo8.png"
                alt="Modern Hospital and Medical Center"
                className="w-full h-auto max-h-[560px] object-cover object-center"
              />

              {/* Overlay subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Bottom Left - with smooth Framer floating loop */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 flex items-center gap-4 max-w-md"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A5ABA] flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Live Operational Status
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    All Critical Care & OPD Wards Operational
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Real-time bed telemetry synced</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge Top Right - with smooth Framer floating loop */}
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="hidden sm:flex absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/60 items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">HIPAA Certified</div>
                  <div className="text-[11px] text-slate-500">256-bit encrypted data</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------- Animated Infinite Marquee Ticker -------------------- */}
      <section className="py-8 bg-slate-50/80 border-y border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Trusted by Top Hospital Networks & Medical Centres
          </p>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          <motion.div
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex items-center gap-12 whitespace-nowrap py-2"
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-sm font-semibold text-slate-500 hover:text-[#1A5ABA] transition-colors cursor-default"
              >
                <div className="w-2 h-2 rounded-full bg-[#1A5ABA]/40" />
                <span>{partner}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -------------------- Stats Counter Banner -------------------- */}
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100"
          >
            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A5ABA] tracking-tight">
                30+
              </div>
              <div className="text-sm font-semibold text-slate-800">Years Experience</div>
              <div className="text-xs text-slate-500">Trusted clinical excellence</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A5ABA] tracking-tight">
                20,000+
              </div>
              <div className="text-sm font-semibold text-slate-800">Patients Treated</div>
              <div className="text-xs text-slate-500">Across all hospital clinics</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A5ABA] tracking-tight">
                50+
              </div>
              <div className="text-sm font-semibold text-slate-800">Board Specialists</div>
              <div className="text-xs text-slate-500">Surgeons, doctors & nurses</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A5ABA] tracking-tight">
                99.8%
              </div>
              <div className="text-sm font-semibold text-slate-800">Patient Satisfaction</div>
              <div className="text-xs text-slate-500">Verified post-care reviews</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------- Why Choose Us (Value Proposition) -------------------- */}
      <section id="features" className="py-20 md:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Here’s What Sets Us Apart from Standard Clinics
            </h2>
            <p className="text-base text-slate-600">
              At our clinic, we are driven by a commitment to transform lives through clinical mastery, digital efficiency, and deep compassion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center group-hover:bg-[#1A5ABA] group-hover:text-white transition-colors duration-300">
                  <Award className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  30+ Years of Expertise
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Trusted care with consistent, proven clinical outcomes and medical service delivered worldwide over decades of dedicated practice.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#1A5ABA]">
                <span>Proven Outcomes</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Expert Medical Team
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Highly skilled medical professionals, surgeons, and nurses providing reliable, safe, and compassionate care with certified excellence.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span>Board Certified</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <HeartPulse className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Patient-Focused Care
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Personalized treatment plans tailored for comfort, faster recovery, and an enhanced outpatient and inpatient journey.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span>Personalized Plans</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Advanced Technology
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time bed occupancy telemetry, automated pharmacy dispensation tracking, and integrated digital e-prescriptions.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-sky-600">
                <span>Next-Gen Telemetry</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------- Clinical Specialties & Departments -------------------- */}
      <section id="services" className="py-20 md:py-28 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Our Specialties</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Healthcare Solutions for Every Need
            </h2>
            <p className="text-base text-slate-600">
              Get expert medical and specialized surgical care anytime, anywhere with trusted board professionals and digital ease.
            </p>
          </motion.div>

          {/* Department Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              const isActive = activeDepartment === idx;
              return (
                <motion.button
                  key={dept.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveDepartment(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1A5ABA] text-white shadow-md shadow-blue-700/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{dept.title}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Department Animated Showcase */}
          <AnimatePresence mode="wait">
            {(() => {
              const current = departments[activeDepartment];
              const Icon = current.icon;
              return (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#FAFAFA] rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1A5ABA] flex items-center justify-center">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1A5ABA]">
                          {current.badge}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                          {current.tagline}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base text-slate-600 leading-relaxed">
                      {current.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      {current.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A5ABA] hover:bg-[#144794] text-white text-sm font-semibold shadow-md shadow-blue-700/20 transition-all"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Book Consultation in {current.title}</span>
                        </Link>
                      </motion.div>
                      <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                        {current.stats} on duty
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
                      <img
                        src={current.image}
                        alt={current.title}
                        className="w-full h-80 object-cover object-center"
                      />
                      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Accredited Diagnostic Unit
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Immediate digital reports & telemetry
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Available Today
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </section>

      {/* -------------------- Dedicated H-OS Portals Gateway Section (Only Patient & Clinical Staff) -------------------- */}
      <section id="portals" className="py-20 md:py-28 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Operational Systems</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hospital Operating System Gateway
            </h2>
            <p className="text-base text-slate-600">
              Access the dedicated operational portal tailored to your role. Seamlessly connect patients and clinical medical practitioners.
            </p>
          </motion.div>

          {/* 2 Balanced Portal Cards (Patient & Clinical Staff) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Patient Portal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1A5ABA] flex items-center justify-center">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#1A5ABA] border border-blue-200">
                    Patient Hub
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Patient Portal
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Book and reschedule appointments, review clinical records, view verified electronic prescriptions, and track your health recovery.
                </p>

                <ul className="space-y-3 pt-2 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1A5ABA]" />
                    <span>Instant Online Appointment Booking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1A5ABA]" />
                    <span>Digital e-Prescriptions & Dosages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1A5ABA]" />
                    <span>Medical History & Visit Transcripts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1A5ABA] hover:bg-[#154694] text-white text-sm font-semibold shadow-md shadow-blue-700/20 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Patient Login</span>
                  </Link>
                </motion.div>
                <div className="text-center">
                  <Link
                    href="/register"
                    className="text-xs font-medium text-[#1A5ABA] hover:underline"
                  >
                    New patient? Create account &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Staff & Clinical Console */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Clinical Care
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Clinical Staff Portal
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Built for doctors, clinical specialists, registered nurses, and hospital pharmacists to conduct consultations and manage wards.
                </p>

                <ul className="space-y-3 pt-2 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Doctor Consultation Queue & Notes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Inpatient Ward & Bed Allocations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pharmacy Drug Dispensation Engine</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/staff/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <span>Clinical Staff Sign In</span>
                  </Link>
                </motion.div>
                <div className="text-center">
                  <span className="text-xs text-slate-400">
                    Authorized Medical Staff Only
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------- Facilities & Technology -------------------- */}
      <section id="facilities" className="py-20 md:py-28 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Facilities & Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Modern Facilities Delivering Better Health Outcomes
            </h2>
            <p className="text-base text-slate-600">
              Explore state-of-the-art medical equipment and digitally integrated hospital infrastructure engineered for patient safety.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Facility 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1A5ABA] flex items-center justify-center shrink-0">
                <Microscope className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">On-site Clinical Labs</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete bloodwork, cultures, and biochemistry on premises with barcoded tracking and same-day digital report transmission to your patient account.
                </p>
                <div className="pt-2 text-xs font-semibold text-[#1A5ABA] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Barcode-tracked specimens
                </div>
              </div>
            </motion.div>

            {/* Facility 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Activity className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Advanced Digital Imaging</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Digital X-ray, high-resolution ultrasound, and MRI scans deliver precise diagnostic imaging with instant radiologist review and portal sharing.
                </p>
                <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> High-resolution radiology
                </div>
              </div>
            </motion.div>

            {/* Facility 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Sterile Operating Theatres</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Laminar airflow, HEPA filtration, and multi-stage sterilization checkpoints minimize infection risks for routine and emergency day-care surgeries.
                </p>
                <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Multi-stage HEPA filtration
                </div>
              </div>
            </motion.div>

            {/* Facility 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-200 flex flex-col sm:flex-row gap-6 items-start hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Pill className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Telehealth & Digital Pharmacy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Secure video consults, e-prescriptions, and continuous medicine inventory tracking ensure timely dispensation without pharmacy bottlenecks.
                </p>
                <div className="pt-2 text-xs font-semibold text-purple-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Real-time stock verification
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------- How It Works (Workflow Steps) -------------------- */}
      <section id="workflow" className="py-20 md:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Care Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple Steps to Better Care, from Booking to Recovery
            </h2>
            <p className="text-base text-slate-600">
              From scheduling your first consultation to post-operative follow-up, our hospital team guides you every step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-slate-200 font-mono">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1A5ABA] border border-blue-200">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#1A5ABA]">
                  <span>Step {i + 1} of 4</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Patient Testimonials -------------------- */}
      <section id="testimonials" className="py-20 md:py-28 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>Patient Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hear from the People Who Trust Healcure
            </h2>
            <p className="text-base text-slate-600">
              Real experiences from patients and families who depend on our clinical teams for their care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-[#FAFAFA] rounded-3xl p-7 border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A5ABA] to-blue-400 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Frequently Asked Questions (FAQ) -------------------- */}
      <section id="faq" className="py-20 md:py-28 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1A5ABA]/10 text-[#1A5ABA] border border-[#1A5ABA]/20">
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600">
              Find clear answers to common inquiries about booking, clinical consultations, insurance, and medical safety.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-[#1A5ABA] transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-blue-50 text-[#1A5ABA]' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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

      {/* -------------------- Call to Action (High Impact Banner) -------------------- */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl bg-gradient-to-r from-[#143D73] via-[#1A5ABA] to-[#2563EB] text-white p-8 sm:p-14 overflow-hidden shadow-2xl shadow-blue-900/20"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-white border border-white/20 backdrop-blur-xs">
                Start Your Health Journey
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Ready to Experience Modern, Compassionate Healthcare?
              </h2>

              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                Connect with our certified medical staff or manage your clinical appointments online today. All hospital services are accessible 24/7.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-blue-50 text-[#1A5ABA] text-base font-bold shadow-lg transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book Appointment Now</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/staff/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-base font-semibold backdrop-blur-xs transition-all"
                  >
                    <Stethoscope className="w-5 h-5" />
                    <span>Clinical Staff Portal</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------- Footer -------------------- */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1A5ABA] to-[#3B82F6] flex items-center justify-center text-white shadow-md">
                  <HeartPulse className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Healcure <span className="text-sky-400 font-normal">H-OS</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Connecting patients and healthcare professionals, anytime, anywhere. Unified hospital operations, inpatient care, and intelligent pharmacy systems.
              </p>
              <div className="text-xs text-slate-500">
                123 Healthcare Blvd, Medical District, NY 10001
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Clinical Services
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Pediatrics Care
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Cardiology Center
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Orthopedic Surgery
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Neurology & Spine
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Gastroenterology
                  </a>
                </li>
              </ul>
            </div>

            {/* Portal Gateways (Only Patient & Clinical Staff) */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Portal Access
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Patient Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    New Patient Registration
                  </Link>
                </li>
                <li>
                  <Link href="/staff/login" className="hover:text-white transition-colors">
                    Clinical Staff Console
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Emergency & Support
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">+1 (415) 555-0198</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>support@healcure.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>24 Hours / 7 Days Open</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Healcure & H-OS Hospital System. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">HIPAA Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}