import { useState } from 'react';

const CONTACT_INFO = [
  {
    type: 'Phone',
    icon: '📞',
    details: ['1800-123-4567 (Toll Free)', '+91-98765-43210'],
    description: 'Available 24/7 for your assistance'
  },
  {
    type: 'Email',
    icon: '📧',
    details: ['support@booktrip.com', 'bookings@booktrip.com'],
    description: 'We respond within 24 hours'
  },
  {
    type: 'Office',
    icon: '📍',
    details: ['123, Travel Street', 'Mumbai, Maharashtra - 400001', 'India'],
    description: 'Visit us Monday to Saturday, 9 AM to 6 PM'
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-800 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            We're here to help! Reach out to us for any queries, support, or feedback
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Contact Information</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {CONTACT_INFO.map((contact, index) => (
            <div key={index} className="card-hover p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-4">
                {contact.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{contact.type}</h3>
              <div className="space-y-2 mb-4">
                {contact.details.map((detail, idx) => (
                  <p key={idx} className="text-slate-600">{detail}</p>
                ))}
              </div>
              <p className="text-sm text-slate-500 italic">{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>
              {submitted ? (
                <div className="card p-8 text-center bg-green-50 border border-green-200">
                  <span className="text-4xl mb-4 block">✅</span>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
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
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
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
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+91-98765-43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Booking Reference</label>
                      <input
                        type="text"
                        name="bookingReference"
                        value={formData.bookingReference}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="If applicable"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
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

                  <button type="submit" className="btn-primary w-full py-3 text-lg">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map and Support Hours */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Our Location</h3>
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center h-64 flex items-center justify-center">
                  <div>
                    <span className="text-6xl mb-4 block">🗺️</span>
                    <p className="text-slate-700 font-medium">Interactive Map</p>
                    <p className="text-slate-600 text-sm">123, Travel Street, Mumbai</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Support Hours</h3>
                <div className="card p-6">
                  <div className="space-y-3">
                    {SUPPORT_HOURS.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-700">{schedule.day}</span>
                        <span className="text-primary-600 font-semibold">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FAQ_CONTACT.map((faq, index) => (
            <div key={index} className="card p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-red-50 border-y border-red-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🚨</span>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Support</h2>
          <p className="text-red-700 mb-6">
            For urgent travel emergencies, call our 24/7 emergency helpline
          </p>
          <div className="bg-white rounded-lg p-6 inline-block">
            <p className="text-3xl font-bold text-red-600">1800-123-4567</p>
            <p className="text-slate-600">Available 24/7 for emergencies</p>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Connect With Us</h2>
        <div className="text-center">
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Follow us on social media for travel tips, exclusive deals, and updates
          </p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <span className="text-xl">f</span>
            </button>
            <button className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
              <span className="text-xl">𝕏</span>
            </button>
            <button className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
              <span className="text-xl">📷</span>
            </button>
            <button className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
              <span className="text-xl">in</span>
            </button>
            <button className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
              <span className="text-xl">▶</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
