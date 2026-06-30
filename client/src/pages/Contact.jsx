import { useState, useRef, useEffect } from 'react';

const CONTACT_INFO = [
  {
    type: 'Phone',
    icon: '📞',
    details: ['1800-123-4567 (Toll Free)', '+91-98765-43210'],
    description: 'Available 24/7 for your assistance',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50'
  },
  {
    type: 'Email',
    icon: '📧',
    details: ['support@booktrip.com', 'bookings@booktrip.com'],
    description: 'We respond within 24 hours',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50'
  },
  {
    type: 'Office',
    icon: '📍',
    details: ['123, Travel Street', 'Mumbai, Maharashtra - 400001', 'India'],
    description: 'Visit us Monday to Saturday, 9 AM to 6 PM',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50'
  }
];

const SUPPORT_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 9:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 6:00 PM' },
  { day: 'Emergency Support', hours: '24/7 Available' }
];

const FAQ_CONTACT = [
  {
    question: 'How quickly will I get a response?',
    answer: 'We typically respond to emails within 24 hours and phone calls are answered immediately during business hours.'
  },
  {
    question: 'What information should I include in my message?',
    answer: 'Please include your booking reference (if applicable), contact details, and a detailed description of your query.'
  },
  {
    question: 'Can I modify or cancel my booking through contact support?',
    answer: 'Yes, our support team can help you modify or cancel bookings. Please have your PNR number ready.'
  },
  {
    question: 'Is there a charge for customer support?',
    answer: 'No, our customer support is completely free. The helpline number is toll-free within India.'
  }
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'f', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700', gradient: 'from-blue-600 to-blue-700' },
  { name: 'Twitter', icon: '𝕏', color: 'bg-slate-800', hoverColor: 'hover:bg-slate-900', gradient: 'from-slate-800 to-slate-900' },
  { name: 'Instagram', icon: '📷', color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700', gradient: 'from-pink-500 to-rose-600' },
  { name: 'LinkedIn', icon: 'in', color: 'bg-blue-700', hoverColor: 'hover:bg-blue-800', gradient: 'from-blue-700 to-blue-800' },
  { name: 'YouTube', icon: '▶', color: 'bg-red-600', hoverColor: 'hover:bg-red-700', gradient: 'from-red-600 to-red-700' }
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    bookingReference: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        bookingReference: ''
      });
    }, 3000);
  };

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative min-h-[70vh] md:min-h-[65vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />

        {/* Floating shapes */}
        <FloatingShape className="top-20 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl animate-float hidden md:block" />
        <FloatingShape className="top-40 right-20 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl animate-float-slow hidden lg:block" />
        <FloatingShape className="bottom-40 left-1/4 w-24 h-24 rounded-full bg-primary-400/5 blur-xl animate-float-slower hidden md:block" />
        <FloatingShape className="top-1/3 right-1/3 w-16 h-16 border border-white/10 rounded-xl rotate-45 animate-spin-slow hidden lg:block" />
        <FloatingShape className="bottom-60 right-10 w-20 h-20 border border-teal-400/20 rounded-full animate-float hidden lg:block" />
        <FloatingShape className="top-60 left-1/3 w-12 h-12 bg-white/5 rounded-lg rotate-12 animate-float-slow hidden lg:block" />

        {/* Animated dots grid */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
              We're here to help, 24/7
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
              Get in <span className="text-gradient-hero">Touch</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-teal-100/80 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We're here to help! Reach out to us for any queries, support, or feedback
            </p>
          </div>
        </div>
      </section>

      {/* ───── CONTACT INFORMATION ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-10 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {CONTACT_INFO.map((contact, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200">
                <div className={`inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br ${contact.gradient} text-white text-3xl items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  {contact.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{contact.type}</h3>
                <div className="space-y-2 mb-4">
                  {contact.details.map((detail, idx) => (
                    <p key={idx} className="text-slate-600">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-slate-400 italic">{contact.description}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── CONTACT FORM + MAP ───── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Send us a Message</h2>
                <p className="text-slate-500 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>
                {submitted ? (
                  <div className="bg-white rounded-2xl border border-emerald-200 shadow-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg">
                      ✅
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-2">Message Sent Successfully!</h3>
                    <p className="text-emerald-600">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="input-icon">
                        <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="input-icon">
                        <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="input-icon">
                        <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="+91-98765-43210"
                        />
                      </div>
                      <div className="input-icon">
                        <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <input
                          type="text"
                          name="bookingReference"
                          value={formData.bookingReference}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Booking reference"
                        />
                      </div>
                    </div>

                    <div className="input-icon">
                      <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Related</option>
                        <option value="cancellation">Cancellation</option>
                        <option value="refund">Refund</option>
                        <option value="technical">Technical Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="input-icon items-start">
                      <svg className="icon w-5 h-5 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="input-field resize-none"
                        placeholder="Describe your query in detail..."
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3.5 text-lg shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 transition-all">
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map + Support Hours */}
            <AnimatedSection>
              <div className="space-y-8">
                {/* Map Placeholder */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Our Location
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800 h-72 group cursor-pointer">
                    <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl border border-white/20">
                          🗺️
                        </div>
                        <p className="text-white font-semibold text-lg">Interactive Map</p>
                        <p className="text-teal-200 text-sm">123, Travel Street, Mumbai</p>
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>
                </div>

                {/* Support Hours */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Support Hours
                  </h3>
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6">
                    <div className="space-y-1">
                      {SUPPORT_HOURS.map((schedule, index) => (
                        <div key={index} className={`flex justify-between items-center py-3 ${index < SUPPORT_HOURS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                          <span className="font-medium text-slate-700">
                            {schedule.day === 'Emergency Support' && (
                              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping-slow mr-2" />
                            )}
                            {schedule.day}
                          </span>
                          <span className={`font-semibold ${schedule.day === 'Emergency Support' ? 'text-red-600' : 'text-primary-600'}`}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <AnimatedSection>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="section-title text-center mb-3">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find quick answers to common questions</p>
          <div className="space-y-3 mt-10">
            {FAQ_CONTACT.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all duration-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 md:py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm md:text-base">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 transition-all duration-300 ${expandedFaq === index ? 'bg-primary-100 text-primary-600 rotate-45' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 md:pb-5 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4 animate-slide-up">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── EMERGENCY SUPPORT ───── */}
      <AnimatedSection>
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-rose-600 to-red-700" />
          <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-300/10 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-3xl mb-6">
              🚨
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Emergency Support</h2>
            <p className="text-lg text-red-100 mb-8 max-w-lg mx-auto">
              For urgent travel emergencies, call our 24/7 emergency helpline
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">1800-123-4567</p>
              <p className="text-red-200">Available 24/7 for emergencies</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── SOCIAL MEDIA ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="section-title text-center mb-3">Connect With Us</h2>
          <p className="section-subtitle">Follow us on social media for travel tips, exclusive deals, and updates</p>
          <div className="flex justify-center gap-4 mt-10">
            {SOCIAL_LINKS.map((social) => (
              <button
                key={social.name}
                className={`group relative w-14 h-14 rounded-2xl bg-gradient-to-br ${social.gradient} text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95`}
                title={social.name}
              >
                <span className="text-lg font-bold group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {social.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
