import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  const contactInfo = [
    {
      icon: <Phone size={22} />,
      label: "Call for inquiry",
      value: "+92 300 1234567",
    },
    {
      icon: <Mail size={22} />,
      label: "Send us email",
      value: "support@jobportal.com",
    },
    {
      icon: <Clock size={22} />,
      label: "Opening hours",
      value: "Mon - Fri: 10AM - 6PM",
    },
    {
      icon: <MapPin size={22} />,
      label: "Office",
      value: "Karachi, Pakistan",
    },
  ];

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2bb5a0]/20 focus:border-[#2bb5a0] transition-colors";

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-black pt-10 pb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Contact Us
        </h1>
      </section>

      {/* ── CONTACT INFO + FORM ──────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <h2 className="text-[32px] font-extrabold text-gray-900 leading-tight mb-4">
              Get in Touch With Our Career Support Team
            </h2>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-10 max-w-sm">
              Have questions about job opportunities, hiring solutions, or your
              account? Our support team is here to help job seekers and
              employers connect with the right opportunities.
            </p>

            {/* 2×2 contact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              {contactInfo.map(({ icon, label, value }) => (
                <div key={label}>
                  <span className="text-[#2bb5a0] block mb-2">{icon}</span>
                  <p className="text-[13px] font-bold text-gray-900 mb-0.5">
                    {label}
                  </p>
                  <p className="text-[13px] text-gray-500">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="bg-[#eef7f5] rounded-2xl px-8 py-8">
            <h3 className="text-[16px] font-bold text-gray-900 text-center mb-1">
              Contact Info
            </h3>

            <p className="text-[12px] text-gray-400 text-center mb-6">
              Fill out the form below and our support team will get back to you
              shortly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className={inputClass}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  className={`${inputClass} resize-y min-h-[110px]`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2bb5a0] hover:bg-[#26a090] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="bg-white pb-14">
        <div className="max-w-5xl mx-auto px-8 md:px-12">
          <div className="rounded-2xl overflow-hidden h-[300px]">
            <iframe
              title="Office Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=66.9000%2C24.8000%2C67.2000%2C25.0000&layer=mapnik&marker=24.8607%2C67.0011"
              width="100%"
              height="100%"
              className="border-0 block"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── PARTNER LOGOS ────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-8 md:px-12 flex items-center justify-around flex-wrap gap-8">
          <span className="text-xl font-semibold text-[#b0bec5] tracking-tight">
            zoom
          </span>

          <span className="flex items-center gap-1.5 text-xl font-semibold text-[#b0bec5] tracking-tight">
            <svg width="13" height="16" viewBox="0 0 24 28" fill="#b0bec5">
              <path d="M12 0C7 6 4 10 4 15a8 8 0 0016 0C20 10 17 6 12 0z" />
            </svg>
            tinder
          </span>

          <span className="text-xl font-semibold italic text-[#b0bec5] tracking-tight">
            dribbble
          </span>

          <span className="flex items-center gap-2 text-xl font-semibold text-[#b0bec5] tracking-tight">
            <svg width="20" height="14" viewBox="0 0 34 22" fill="none">
              <circle cx="7" cy="15" r="6" fill="#b0bec5" />
              <circle cx="27" cy="15" r="6" fill="#b0bec5" />
              <circle cx="17" cy="7" r="6" fill="#b0bec5" />
            </svg>
            asana
          </span>
        </div>
      </section>
    </div>
  );
}