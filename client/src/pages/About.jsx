import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const TEAM_MEMBERS = [
  {
    name: 'Rahul Sharma',
    role: 'CEO & Founder',
    image: '👨‍💼',
    description: 'Visionary leader with 15+ years in travel industry'
  },
  {
    name: 'Priya Patel',
    role: 'CTO',
    image: '👩‍💻',
    description: 'Tech expert passionate about travel innovation'
  },
  {
    name: 'Amit Kumar',
    role: 'Head of Operations',
    image: '👨‍✈️',
    description: 'Ensuring smooth travel experiences for all customers'
  },
  {
    name: 'Sneha Reddy',
    role: 'Customer Success Lead',
    image: '👩‍💼',
    description: 'Dedicated to exceptional customer service'
  }
];

const MILESTONES = [
  { year: '2018', title: 'Founded', description: 'Started with a vision to simplify travel booking' },
  { year: '2019', title: '1M+ Users', description: 'Reached our first million happy customers' },
  { year: '2020', title: 'Mobile App Launch', description: 'Launched our mobile app for on-the-go booking' },
  { year: '2021', title: 'Expanded to 500+ Routes', description: 'Covered major travel routes across India' },
  { year: '2022', title: 'AI Integration', description: 'Introduced AI-powered travel recommendations' },
  { year: '2023', title: '10M+ Bookings', description: 'Celebrated 10 million successful bookings' },
];

const VALUES = [
  {
    title: 'Customer First',
    description: 'We prioritize customer satisfaction above everything else',
    icon: '❤️',
    gradient: 'from-red-500 to-pink-500',
    shadow: 'shadow-red-500/20'
  },
  {
    title: 'Innovation',
    description: 'Continuously improving our technology and services',
    icon: '💡',
    gradient: 'from-yellow-500 to-orange-500',
    shadow: 'shadow-yellow-500/20'
  },
  {
    title: 'Transparency',
    description: 'No hidden fees, clear pricing and honest communication',
    icon: '🔍',
    gradient: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/20'
  },
  {
    title: 'Reliability',
    description: 'Dependable service you can count on for your travels',
    icon: '🛡️',
    gradient: 'from-green-500 to-teal-500',
    shadow: 'shadow-green-500/20'
  }
];

const STATS_DATA = [
  { value: 10000000, suffix: '+', label: 'Happy Customers', icon: '😊', color: 'text-primary-500' },
  { value: 500, suffix: '+', label: 'Cities Connected', icon: '🗺️', color: 'text-amber-500' },
  { value: 247, suffix: '/7', label: 'Customer Support', icon: '🎧', color: 'text-emerald-500', is24: true },
  { value: 999, suffix: '%', label: 'Uptime', icon: '⚡', color: 'text-purple-500', decimal: true },
];

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function FloatingShape({ className, children }) {
  return <div className={`absolute pointer-events-none ${className}`}>{children}</div>;
}

function AnimatedCounter({ target, suffix = '', decimal = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let raf;
    function animate() {
      start += increment;
      if (start >= target) { setCount(target); return; }
      setCount(Math.floor(start));
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);

  if (decimal) {
    const val = (count / 10).toFixed(1);
    return <span ref={ref}>{val}{suffix}</span>;
  }
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function About() {
  const [journeyVisible, setJourneyVisible] = useState(false);
  const journeyRef = useRef(null);

  useEffect(() => {
    const el = journeyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setJourneyVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        <FloatingShape className="top-20 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl animate-float hidden md:block" />
        <FloatingShape className="top-40 right-20 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl animate-float-slow hidden lg:block" />
        <FloatingShape className="bottom-40 left-1/4 w-24 h-24 rounded-full bg-primary-400/5 blur-xl animate-float-slower hidden md:block" />
        <FloatingShape className="top-1/3 right-1/3 w-16 h-16 border border-white/10 rounded-xl rotate-45 animate-spin-slow hidden lg:block" />
        <FloatingShape className="bottom-60 right-10 w-20 h-20 border border-teal-400/20 rounded-full animate-float hidden lg:block" />
        <FloatingShape className="top-60 left-1/3 w-12 h-12 bg-white/5 rounded-lg rotate-12 animate-float-slow hidden lg:block" />

        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
              Your trusted travel companion since 2018
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
              About <span className="text-gradient-hero">BookTrip</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-teal-100/80 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Making journeys simpler, safer, and more memorable — one ticket at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all active:scale-95">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all active:scale-95">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── OUR STORY ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-6 leading-tight">
                Born from a{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-600">
                  passion for travel
                </span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  BookTrip was born out of a simple frustration: why should booking travel be complicated?
                  Our founder, Rahul Sharma, experienced firsthand the challenges of planning multi-modal journeys
                  across India's vast transportation network.
                </p>
                <p>
                  What started as a small team of 4 passionate individuals has grown into India's most trusted
                  travel booking platform, serving millions of customers across thousands of routes.
                </p>
                <p className="text-slate-700 font-medium">
                  Today, we're proud to be the bridge that connects travelers to their destinations,
                  making every journey memorable with our seamless booking experience and dedicated customer support.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">1M+</div>
                  <span className="text-sm text-slate-500">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">500+</div>
                  <span className="text-sm text-slate-500">Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">10M+</div>
                  <span className="text-sm text-slate-500">Bookings</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-200/50 via-teal-200/50 to-primary-200/50 rounded-3xl blur-2xl opacity-60" />
              <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 md:p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-4xl shadow-lg shadow-primary-500/30">
                  🚂
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">10M+ Happy Customers</h3>
                <p className="text-slate-500 mb-6">And counting...</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── OUR JOURNEY ───── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-28" ref={journeyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Timeline</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">Our Journey</h2>
              <p className="text-slate-500">From a small idea to India's trusted travel platform</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MILESTONES.map((milestone, index) => (
              <AnimatedSection key={index}>
                <div
                  className={`group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-500 p-6 md:p-8 relative overflow-hidden ${
                    journeyVisible ? '' : ''
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary-600/20 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        {milestone.year}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary-200 to-transparent" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{milestone.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── STATISTICS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900 p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-teal-300 uppercase tracking-widest">By the Numbers</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">BookTrip in Numbers</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {STATS_DATA.map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                    <div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${stat.color} mb-2 tabular-nums`}>
                      {stat.is24 ? (
                        <span>24<span className="text-2xl md:text-3xl">/7</span></span>
                      ) : (
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── OUR VALUES ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">What We Stand For</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">Our Values</h2>
              <p className="text-slate-500">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {VALUES.map((value, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover p-8 text-center transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-3xl shadow-lg ${value.shadow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{value.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── MEET THE TEAM ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Our People</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">Meet Our Team</h2>
            <p className="text-slate-500">The passionate people behind BookTrip</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 text-center hover:-translate-y-1"
              >
                <div className="relative mx-auto mb-6 w-28 h-28">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl border-4 border-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    {member.image}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-3">{member.role}</span>
                <p className="text-slate-500 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── CTA ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-teal-800 p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Join Our Journey</h2>
              <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto">
                Be part of the millions who trust BookTrip for their travel needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  Get Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all active:scale-95"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
