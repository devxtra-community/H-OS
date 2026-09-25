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
  Activity,
  BedDouble,
  Pill,
  ShieldCheck,
  Building2,
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
      icon: Building2,
      value: '7',
      label: 'Clinical Departments',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Emergency & ICU Wards',
    },
    {
      icon: Pill,
      value: '100%',
      label: 'Digital e-Prescriptions',
    },
    {
      icon: Smile,
      value: '15 min',
      label: 'Avg Consultation Queue',
    },
  ];

  const standards = [
    'HL7 / FHIR Ready',
    'HIPAA Compliant',
    'Live Bed Telemetry',
    'Digital Pharmacy Engine',
    'Neon Cloud Postgres',
  ];

  const faqs = [
    {
      q: 'How do I book an appointment with a specialist?',
      a: 'Sign into the Patient Portal or click "Book An Appointment". Select your clinical department (Cardiology, Orthopedics, Neurology, Pediatrics, General Medicine), choose your doctor, and select an available time slot. Your booking is confirmed immediately.',
    },
    {
      q: 'How does the doctor consultation queue work?',
      a: 'When you arrive for your scheduled visit or check in online, you enter the doctor’s live queue. Doctors manage priority triage (Normal and Emergency) with integrated consultation timers and real-time status updates.',
    },
    {
      q: 'What happens if a patient requires inpatient admission?',
      a: 'The consulting physician requests an admission directly in the system. Hospital staff review the queue, assign an available bed in the General ICU or designated Ward, and manage the full inpatient care cycle until discharge.',
    },
    {
      q: 'How does the hospital pharmacy dispense medications?',
      a: 'During consultation, physicians generate electronic prescriptions linked directly to hospital inventory. When the patient visits the hospital pharmacy, staff verify the prescription, check real-time batch stock, and mark the order as dispensed.',
    },
    {
      q: 'Can patients upload and view their medical documents?',
      a: 'Yes. Patients can securely upload diagnostic reports, blood test results, and medical records to their profile. All clinical history, allergies, blood group, and emergency contacts are encrypted and accessible to treating doctors.',
    },
    {
      q: 'How is clinical data and patient privacy secured?',
      a: 'H-OS is architected with strict role-based access control (RBAC), database encryption at rest, secure session tokens, and tamper-resistant inventory transaction audit logs.',
    },
  ];

  const testimonials = [
    {
      name: 'Daniel Thompson',
      role: 'Outpatient Care',
      comment:
        'Booking with Cardiology took under a minute. When I met the doctor, my complete allergy profile and medical history were already on screen.',
    },
    {
      name: 'Ryan Mitchell',
      role: 'Pharmacy & Follow-up',
      comment:
        'The doctor prescribed my medication digitally, and by the time I walked down to the hospital dispensary, it was already verified and ready.',
    },
    {
      name: 'Dr. Sarah Connor',
      role: 'Chief Medical Officer',
      comment:
        'H-OS transformed our clinical floor. The consultation queue is predictable, emergency admissions are prioritized instantly, and ward bed tracking is live.',
    },
    {
      name: 'Emily Rogers',
      role: 'Pediatric Care',
      comment:
        'Scheduling checkups and tracking vaccination schedules for my children has never been this straightforward. Caring doctors and no chaotic waiting rooms.',
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
            alt="H-OS Hospital Architecture at Dusk"
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
                H-OS
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
              <a href="#services" className="hover:text-white transition-colors">
                Departments
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                System Overview
              </a>
              <a href="#workflow" className="hover:text-white transition-colors">
                Clinical Workflow
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Portals
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </nav>

            {/* Right Action Buttons */}
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
                    Departments
                  </a>
                  <a
                    href="#about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    System Overview
                  </a>
                  <a
                    href="#workflow"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Clinical Workflow
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
                <span className="bg-[#1A5ABA] px-2 py-0.5 rounded-full text-[11px] font-semibold text-white">
                  H-OS
                </span>
                <span>Hospital Operating System</span>
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
              Manage patient appointments, doctor consultation queues, inpatient ward beds, and digital pharmacy dispensation in one unified hospital operating system.
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
                    alt="Clinical team verified"
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
                  Verified Hospital Clinical Outcomes
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* -------------------- Hero Bottom Clinical Standards Bar -------------------- */}
        <div className="relative z-10 w-full border-t border-white/10 py-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/60">
          <span className="font-medium text-white/50">Integrated Standards:</span>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 opacity-80">
            {standards.map((std, index) => (
              <span
                key={index}
                className="font-semibold tracking-wide text-white/70 hover:text-white transition-colors"
              >
                {std}
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
              ◆ About H-OS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Here’s What Sets Us Apart
              <br />
              from Standard Clinics
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Driven by clinical precision, real-time bed telemetry, and seamless doctor-patient workflows.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A5ABA] hover:bg-[#154897] text-white text-sm font-semibold transition-all shadow-sm"
              >
                <span>Explore Hospital System</span>
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
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Real-Time Doctor Queues
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dynamic patient consultation queues with normal and emergency priority triage, live check-in tracking, and consultation duration management.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Inpatient Ward & Bed Telemetry
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Live bed availability across Intensive Care Units (ICU) and General Wards with instant patient admission and discharge request coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Column: Tall Editorial Photo */}
            <div className="lg:col-span-4 rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 min-h-[420px] lg:min-h-full">
              <img
                src="https://framerusercontent.com/images/OomZnQqqJpejEmBnGXgKtRvCwT8.png"
                alt="Hospital clinical staff in hospital hallway"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Column (2 Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Integrated Digital Pharmacy
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Physicians generate electronic prescriptions connected directly to pharmacy stock levels, enabling verified batch dispensation without delays.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A5ABA] flex items-center justify-center mb-6">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Centralized Patient Records
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Comprehensive patient health profiles including allergies, blood group, chronic conditions, and encrypted clinical document uploads.
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
              ◆ Clinical Departments
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Comprehensive
              <br />
              Healthcare Solutions
              <br />
              for Every Need
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Specialized departments staffed by certified physicians and integrated with real-time diagnostic queues.
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
                Pediatrics Department
              </span>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Compassionate Care for Every Stage of Childhood
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Our pediatrics department ensures your child’s healthy growth, development, and emotional well-being through preventive care and continuous medical support.
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  'Wellness checkups and vaccination programs',
                  'Growth, nutrition, and developmental assessments',
                  'Routine health screenings and pediatric allergy monitoring',
                  'Dedicated pediatric doctor consultation queue',
                  '24×7 pediatric emergency ward admission support',
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

          {/* Service Block 2: Two Split Cards (Orthopedics & General Medicine) */}
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
                  Orthopedics & Surgery
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Advanced Bone and Joint Care for Better Mobility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  From sports injuries and fracture management to complex orthopedic procedures, our specialists restore strength and mobility with personalized clinical rehabilitation.
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

            {/* Card B: General Medicine & Diagnostics */}
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
                  alt="Doctor reviewing diagnostic findings with patient"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1A5ABA] border border-blue-200/60">
                  General Medicine & Cardiology
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Digestive Health, Cardiology & Primary Care
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comprehensive internal medicine diagnostics, cardiovascular management, chronic disease prevention, and direct e-prescription coordination.
                </p>
                <ul className="space-y-2.5 pt-1">
                  {[
                    'Cardiology vitals and chronic disease care',
                    'Diagnostic lab review & radiology assessments',
                    'Direct electronic prescription generation',
                    'Medication review with pharmacy stock integration',
                    'Inpatient ICU and ward transfer coordination',
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
                  Book and reschedule appointments, monitor live doctor queue status, view verified e-prescriptions, and securely manage your medical profile.
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
                  Doctor consultation queues, emergency triage, inpatient ward bed assignments, and pharmacy medicine stock dispensation.
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

      {/* -------------------- Clinical Workflow (4 Clean Steps) -------------------- */}
      <section id="workflow" className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#1A5ABA] uppercase tracking-wider">
              ◆ Clinical Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Simple Steps to Better Care,
              <br />
              from Booking to Recovery.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              From appointment scheduling to inpatient recovery and digital prescription pickup, H-OS guides each stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Online Appointment',
                desc: 'Select your clinical department, choose an available specialist, and pick a convenient time slot without hospital waiting lines.',
              },
              {
                num: '02',
                title: 'Clinical Consultation',
                desc: 'Consult with your physician who reviews symptoms, examines medical records, and enters real-time clinical notes.',
              },
              {
                num: '03',
                title: 'Ward or Pharmacy',
                desc: 'If medication is needed, e-prescriptions sync to pharmacy stock. If admission is required, ward beds are allocated instantly.',
              },
              {
                num: '04',
                title: 'Discharge & Follow-up',
                desc: 'Coordinated discharge requests, digital instructions, and follow-up consultation reminders keep patient recovery on track.',
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
              ◆ Clinical Experience
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Hear from Patients & Clinicians
              <br />
              Using H-OS
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
      <section id="faq" className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
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
                  H-OS
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Hospital Operating System connecting patients, doctors, inpatient ward beds, and pharmacy dispensation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Departments
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Cardiology
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Orthopedics
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Pediatrics
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    General Medicine
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
                    Staff & Doctor Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Emergency & Support
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@hos.com</li>
                <li>+1 (415) 555-0198</li>
                <li>123 Healthcare Blvd, Medical District</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© 2026 H-OS Hospital Operating System. All rights reserved.</div>
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