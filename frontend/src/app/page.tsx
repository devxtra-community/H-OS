'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Menu,
  Phone,
  Plus,
  Smile,
  Star,
  Stethoscope,
  User,
  UserCheck,
  Users,
  X,
  Award,
  Heart,
  Sliders,
  Sparkles,
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
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
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const stats = [
    {
      icon: Clock,
      value: '10+',
      label: 'Years Experience',
    },
    {
      icon: User,
      value: '5000+',
      label: 'Patients Treated',
    },
    {
      icon: Users,
      value: '50+',
      label: 'Specialists',
    },
    {
      icon: Smile,
      value: '100%',
      label: 'Patient Satisfaction',
    },
  ];

  const partners = [
    'FeatherDev',
    'Spherule',
    'GlobalBank',
    'Nietzsche',
    'Boltshift',
  ];

  const faqs = [
    {
      q: 'How do I book an appointment?',
      a: 'Easily schedule your appointment online through our portal. Select your medical department, choose an available specialist, and pick a date and time that fits your schedule. You can manage and reschedule bookings anytime.',
    },
    {
      q: 'Do you offer online or telehealth consultations?',
      a: 'Yes, our certified practitioners offer secure video consultations with automated digital e-prescriptions and clinical visit summaries synced directly to your patient records.',
    },
    {
      q: 'What insurance plans do you accept?',
      a: 'We accept all major health insurance providers and medical networks. Clear digital itemized statements and claims paperwork are available directly in your account.',
    },
    {
      q: 'Are your doctors qualified specialists?',
      a: 'All our clinicians are board-certified specialists with extensive hospital experience across their respective medical domains.',
    },
    {
      q: 'What should I bring for my first visit?',
      a: 'Please bring your government ID, insurance card, and any relevant prior test results or medications. If you have registered online, your profile is already synced.',
    },
    {
      q: 'How is patient medical privacy protected?',
      a: 'Our systems utilize enterprise HIPAA-compliant architecture, encrypted medical record handling, and strictly audited clinical access logs.',
    },
  ];

  const testimonials = [
    {
      name: 'Daniel Thompson',
      role: 'Visitor',
      comment:
        'The doctors truly care, explain clearly, and make me comfortable. Support that really listens.',
    },
    {
      name: 'Ryan Mitchell',
      role: 'Patient',
      comment:
        'I booked follow-ups online with quick communication and punctual doctors. Highly recommended.',
    },
    {
      name: 'Joshua Reed',
      role: 'Patient',
      comment:
        'My experience was excellent. Everyone was kind and understanding, and managing everything online was easy.',
    },
    {
      name: 'Emily Rogers',
      role: 'Visitor',
      comment:
        'I’m impressed with the professional team. Scheduling online was easy, and the doctors made me feel supported.',
    },
  ];

  const avatarImages = [
    'https://framerusercontent.com/images/kDelAbc9M3Z5dNow8E9FyzRmFa4.webp',
    'https://framerusercontent.com/images/MfDrMhvjdKkMTMIwDbmxsEPRGk.webp',
    'https://framerusercontent.com/images/Z9Dtr5uelHg3AJw3UOQHF3JUnU.webp',
    'https://framerusercontent.com/images/zJac98vwEJ5W3dpuCR6NpSixnl8.webp',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E293B] font-sans antialiased selection:bg-[#1A5ABA]/15 selection:text-[#1A5ABA]">
      {/* -------------------- Top Hero with Full-Bleed Dark Hospital Backdrop -------------------- */}
      <section className="relative min-h-[92vh] sm:min-h-screen bg-[#0B1320] text-white flex flex-col justify-between overflow-hidden">
        {/* Full-bleed background photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://framerusercontent.com/images/yrivhbAv1ml2wj4JezJhA7eOo8.png"
            alt="Modern Hospital Architecture at Dusk"
            className="w-full h-full object-cover object-center brightness-85"
          />
          {/* Subtle gradient vignette to guarantee left-aligned text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1320]/95 via-[#0B1320]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-[#0B1320]/60" />
        </div>

        {/* -------------------- Minimal Floating Navigation -------------------- */}
        <header className="relative z-20 w-full pt-6 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-3">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#1A5ABA] flex items-center justify-center text-white shadow-md shadow-blue-900/30">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Healcure
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
              <a href="#services" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#services" className="hover:text-white transition-colors">
                Services
              </a>
              <a href="#facilities" className="hover:text-white transition-colors">
                Facilities
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Portals
              </a>
            </nav>

            {/* Right Action Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/staff/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Staff Portal
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A5ABA] hover:bg-[#154897] text-white text-sm font-medium transition-all duration-200 active:scale-98 shadow-sm"
              >
                <span>Book An Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden mt-3 rounded-2xl bg-[#0F172A]/95 backdrop-blur-md border border-white/10 p-5 space-y-4 shadow-2xl"
              >
                <div className="flex flex-col gap-3 text-sm font-medium text-white/90">
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Services
                  </a>
                  <a
                    href="#about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    About Us
                  </a>
                  <a
                    href="#facilities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Facilities
                  </a>
                  <a
                    href="#portals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Portals
                  </a>
                </div>
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full bg-[#1A5ABA] text-white text-sm font-medium"
                  >
                    Book An Appointment &rarr;
                  </Link>
                  <Link
                    href="/staff/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium"
                  >
                    Clinical Staff Portal &rarr;
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* -------------------- Hero Content (Editorial Left-Aligned) -------------------- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full py-16 md:py-24 my-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl space-y-6"
          >
            {/* Pill Eyebrow */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-white/10 border border-white/15 text-white/90 backdrop-blur-xs">
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white">
                  Trusted
                </span>
                <span>20,000+ Patients Worldwide</span>
              </div>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.12]"
            >
              Healthcare for Good
              <br />
              Today. Tomorrow. Always.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-white/80 font-normal leading-relaxed max-w-xl"
            >
              Take charge of your well-being and explore the many advantages of modern healthcare through our trusted platform.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-white/90 text-slate-900 text-sm font-semibold transition-all duration-200 active:scale-98 shadow-md"
              >
                <span>Book An Appointment</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </Link>

              <Link
                href="/staff/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/30 text-white text-sm font-semibold transition-all duration-200 active:scale-98 backdrop-blur-xs"
              >
                <span>Staff Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeInUp}
              className="pt-6 flex items-center gap-3"
            >
              {/* Avatars */}
              <div className="flex -space-x-2">
                {avatarImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Patient review"
                    className="w-8 h-8 rounded-full border-2 border-[#0B1320] object-cover"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#0B1320] bg-white text-slate-900 flex items-center justify-center text-xs font-bold">
                  +
                </div>
              </div>

              {/* Stars & text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-white/70 font-medium mt-0.5">
                  Based on 20K+ Reviews
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* -------------------- Hero Bottom Partner Logos -------------------- */}
        <div className="relative z-10 w-full border-t border-white/10 py-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/60">
          <span className="font-medium text-white/50">Proudly worked with:</span>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 opacity-80">
            {partners.map((partner, index) => (
              <span
                key={index}
                className="font-semibold tracking-wide text-white/70 hover:text-white transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Stats Row -------------------- */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 -mt-8 sm:-mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* -------------------- About Us / "Here's What Sets Us Apart" -------------------- */}
      <section id="about" className="py-24 sm:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ About Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Here’s What Sets Us Apart
              <br />
              from Standard Clinics
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              At our clinic, we’re driven by a commitment to transform lives through knowledge, care, and compassion.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A5ABA] hover:bg-[#154897] text-white text-sm font-semibold transition-all shadow-sm"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Asymmetric 3-Column Layout Matching the Framer Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (2 Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <Star className="w-5 h-5 fill-[#1A5ABA]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    30+ years of expertise
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Trusted care with consistent, proven outcomes and medical service delivered worldwide over decades.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Expert Medical Team
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Highly skilled professionals providing reliable, safe, and compassionate medical care with proven excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Column: Tall Editorial Photo */}
            <div className="lg:col-span-4 rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 min-h-[420px] lg:min-h-full">
              <img
                src="https://framerusercontent.com/images/OomZnQqqJpejEmBnGXgKtRvCwT8.png"
                alt="Medical staff walking together in hospital hallway"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Column (2 Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <Heart className="w-5 h-5 fill-[#1A5ABA]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Patient-Focused Care
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Personalized treatment plans designed for comfort, faster recovery, and an enhanced patient experience.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Advanced Technology
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Advanced medical technology and systems delivering accurate diagnosis and consistent results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Services Section: Editorial Layout -------------------- */}
      <section id="services" className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Comprehensive
              <br />
              Healthcare Solutions
              <br />
              for Every Need
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Get expert medical and mental healthcare anytime, anywhere with trusted professionals and digital ease.
            </p>
          </div>

          {/* Service Block 1: Full-width Pediatrics Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#FAFAFA] rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Image */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden h-72 sm:h-96 shadow-xs border border-slate-200/60">
              <img
                src="https://framerusercontent.com/images/TwBLFuf0CZ6k3CBKWE7kBoTQxVc.png"
                alt="Pediatrician examining a young patient"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                Pediatrics
              </span>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Compassionate Care for Every Stage of Childhood
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Our pediatrics department ensures your child’s healthy growth, development, and emotional well-being through preventive and personalized care.
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  'Wellness checkups and vaccination programs',
                  'Growth and nutrition monitoring',
                  'Child developmental assessment',
                  'Preventive care and family education',
                  '24×7 pediatric emergency support',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1A5ABA] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Service Block 2: Two Split Cards (Orthopedics & Gastroenterology) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card A: Orthopedics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#FAFAFA] rounded-3xl border border-slate-200/80 p-8 sm:p-10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                  Orthopedics
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Advanced Bone and Joint Care for Better Mobility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  From sports injuries to complex orthopedic surgeries, we restore confidence in your movement with cutting-edge diagnostics and physical therapy.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 sm:h-72 shadow-xs border border-slate-200/60">
                <img
                  src="https://framerusercontent.com/images/oGzMUEnH8hgkKhHoglFcTOfBkgQ.png"
                  alt="Doctor consulting patient about orthopedic health"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>

            {/* Card B: Gastroenterology */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#FAFAFA] rounded-3xl border border-slate-200/80 p-8 sm:p-10 flex flex-col justify-between space-y-6"
            >
              <div className="rounded-2xl overflow-hidden h-64 sm:h-72 shadow-xs border border-slate-200/60">
                <img
                  src="https://framerusercontent.com/images/OhVZTS3dElIxK1Zxpz5HIggHQA8.png"
                  alt="Doctor showing digestive tablet diagram to patient"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                  Gastroenterology
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Digestive Health and Wellness, Simplified
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Focused on diagnosing and treating gastrointestinal conditions through advanced endoscopy, diet planning, and holistic digestive care.
                </p>
                <ul className="space-y-2.5 pt-1">
                  {[
                    'Endoscopy and colonoscopy diagnostics',
                    'Nutrition and dietary management',
                    'Liver, pancreas, and gut disorder care',
                    'Lifestyle consultation for digestion',
                    'Preventive screening and health education',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1A5ABA] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------- Dedicated H-OS Portals Gateway (Patient & Staff Only) -------------------- */}
      <section id="portals" className="py-24 sm:py-32 bg-[#F6F7F9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ System Access
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Hospital Operating System
              <br />
              Secure Portals
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Direct access for registered patients and authorized medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient Portal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center">
                    <UserCheck className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                    Patient Hub
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Patient Portal
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Book and reschedule appointments, review digital prescriptions, and view diagnostic visit transcripts.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#1A5ABA] hover:bg-[#154897] text-white text-sm font-semibold transition-all shadow-sm"
                >
                  <span>Sign In as Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center">
                  <Link
                    href="/register"
                    className="text-xs font-medium text-slate-500 hover:text-[#1A5ABA] transition-colors"
                  >
                    New patient? Create your account &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Clinical Staff Portal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    Clinical Care
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Staff & Doctors Portal
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Doctor consultation queues, inpatient ward and bed occupancy, and pharmacy medicine dispensation.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/staff/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm"
                >
                  <span>Staff & Doctor Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-medium">
                    Authorized Clinical Practitioners Only
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------- How It Works (4 Clean Steps) -------------------- */}
      <section className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Simple Steps to Better Care,
              <br />
              from Booking to Recovery.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              From booking an appointment to follow-up care, we guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Book Appointment',
                desc: 'Easily schedule your visit online or by phone. Choose a time that fits your routine, and our team ensures the booking process stays smooth and stress-free.',
              },
              {
                num: '02',
                title: 'Consultation',
                desc: 'Meet with our caring specialists who listen closely to your concerns and history. Together, we’ll create a clear path toward better health with guidance you can trust.',
              },
              {
                num: '03',
                title: 'Treatment',
                desc: 'Receive a personalized treatment plan tailored to your needs. Our modern facilities and expert team ensure you get safe, effective, and compassionate care at every step.',
              },
              {
                num: '04',
                title: 'Follow-up',
                desc: 'We stay connected even after treatment. Through regular check-ins and ongoing support, we make sure your recovery stays on track and your long-term health thrives.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-3xl font-extrabold text-slate-300 font-mono">
                    {step.num}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Client Experiences / Testimonials -------------------- */}
      <section className="py-24 sm:py-32 bg-[#FAFAFA] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ Client Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Hear from the People Who
              <br />
              Use Healcure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-6"
              >
                <p className="text-sm text-slate-700 leading-relaxed font-normal italic">
                  &ldquo;{t.comment}&rdquo;
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1A5ABA] font-bold text-sm flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- Frequently Asked Questions (Accordion) -------------------- */}
      <section className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200/80">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-base sm:text-lg text-slate-900 hover:text-[#1A5ABA] transition-colors cursor-pointer py-1"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-slate-400 shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-sm text-slate-600 leading-relaxed font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------- Footer -------------------- */}
      <footer className="bg-slate-900 text-white pt-20 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1A5ABA] flex items-center justify-center text-white">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Healcure
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Connecting patients and healthcare professionals, anytime, anywhere.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quick Links
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources / Portals */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Portals
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Patient Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    New Patient Register
                  </Link>
                </li>
                <li>
                  <Link href="/staff/login" className="hover:text-white transition-colors">
                    Staff Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Contact
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@healcure.com</li>
                <li>+1 (415) 555-0198</li>
                <li>123 Scheduler St, Tech City, USA</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© 2026 Healcure. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}