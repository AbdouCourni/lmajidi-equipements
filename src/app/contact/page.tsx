// src/app/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can integrate with a backend service or email API
    const whatsappMessage = `Bonjour, je suis ${formData.name}.%0A%0A${formData.message}%0A%0ATéléphone: ${formData.phone}%0AEmail: ${formData.email}`;
    window.open(`https://wa.me/212625652015?text=${whatsappMessage}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contactez-nous
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Notre équipe est à votre disposition pour répondre à toutes vos questions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Informations de contact
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                <p className="text-gray-600">Nador : Hay Arrid, à côté de Ecole Al Mada</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                📞
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                <a href="tel:+212625652015" className="text-gray-600 hover:text-blue-600 block">
                  06 25 65 20 15
                </a>
                <a href="tel:+212661767453" className="text-gray-600 hover:text-blue-600 block">
                  06 61 76 74 53
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <a 
                  href="https://wa.me/212625652015" 
                  target="_blank" 
                  className="text-gray-600 hover:text-green-600"
                >
                  06 25 65 20 15
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a href="mailto:contact@europmat.ma" className="text-gray-600 hover:text-blue-600">
                  contact@europmat.ma
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Lundi - Vendredi:</span>
                <span>9h00 - 19h00</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi:</span>
                <span>10h00 - 16h00</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche:</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Envoyez-nous un message
          </h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              Message envoyé ! Nous vous répondrons dans les plus brefs délais.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}