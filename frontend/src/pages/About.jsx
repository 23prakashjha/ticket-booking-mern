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
    color: 'from-red-500 to-pink-500'
  },
  {
    title: 'Innovation',
    description: 'Continuously improving our technology and services',
    icon: '💡',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Transparency',
    description: 'No hidden fees, clear pricing and honest communication',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Reliability',
    description: 'Dependable service you can count on for your travels',
    icon: '🛡️',
    color: 'from-green-500 to-teal-500'
  }
];

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-800 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About BookTrip
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            Your trusted travel companion making journeys simpler, safer, and more enjoyable since 2018
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-4">
              BookTrip was born out of a simple frustration: why should booking travel be complicated? 
              Our founder, Rahul Sharma, experienced firsthand the challenges of planning multi-modal journeys 
              across India's vast transportation network.
            </p>
            <p className="text-slate-600 mb-4">
              What started as a small team of 4 passionate individuals has grown into India's most trusted 
              travel booking platform, serving millions of customers across thousands of routes.
            </p>
            <p className="text-slate-600">
              Today, we're proud to be the bridge that connects travelers to their destinations, 
              making every journey memorable with our seamless booking experience and dedicated customer support.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center">
            <span className="text-8xl mb-4 block">🚂</span>
            <h3 className="text-2xl font-bold text-primary-700 mb-2">10M+ Happy Customers</h3>
            <p className="text-primary-600">And counting...</p>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Our Journey</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MILESTONES.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  {milestone.year}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{milestone.title}</h3>
                <p className="text-slate-600 text-sm">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((value, index) => (
            <div key={index} className="text-center">
              <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center text-3xl mb-4`}>
                {value.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{value.title}</h3>
              <p className="text-slate-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="card-hover p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-5xl mb-4">
                  {member.image}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10M+</div>
            <p className="text-slate-600">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500+</div>
            <p className="text-slate-600">Cities Connected</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">24/7</div>
            <p className="text-slate-600">Customer Support</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">99.9%</div>
            <p className="text-slate-600">Uptime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Journey</h2>
          <p className="text-xl text-teal-100 mb-8">
            Be part of the millions who trust BookTrip for their travel needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn-primary bg-white text-primary-700 hover:bg-slate-100 px-8 py-3">
              Get Started
            </Link>
            <Link to="/contact" className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-primary-700 px-8 py-3">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
