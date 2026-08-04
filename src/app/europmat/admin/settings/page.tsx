// src/app/europmat/admin/settings/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';

interface ContactSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  catalogueUrl: string;
  catalogueName: string;
  openingHours: {
    'Lun-Ven': string;
    'Sam': string;
    'Dim': string;
  };
}

const defaultSettings: ContactSettings = {
  whatsappNumber: '212625652015',
  whatsappMessage: 'Bonjour, je souhaite recevoir un devis',
  phone1: '0625652015',
  phone2: '0661767453',
  email: 'contact@europmat.ma',
  address: 'Hay Arrid, à côté de Ecole Al Mada, Nador, Maroc',
  catalogueUrl: '',
  catalogueName: 'Catalogue Europmat',
  openingHours: {
    'Lun-Ven': '9h00 - 19h00',
    'Sam': '10h00 - 16h00',
    'Dim': 'Fermé',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as ContactSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      openingHours: { ...prev.openingHours, [day]: value },
    }));
  };

  // Upload PDF to Cloudinary
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('Le fichier ne doit pas dépasser 50MB');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'europmat_unsigned');
      formData.append('folder', 'europmat/catalogue');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error('Missing Cloudinary config');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error?.message || 'Upload failed');

      setSettings(prev => ({
        ...prev,
        catalogueUrl: data.secure_url,
        catalogueName: file.name.replace('.pdf', ''),
      }));

      // Auto-save after upload
      await setDoc(doc(db, 'settings', 'contact'), {
        ...settings,
        catalogueUrl: data.secure_url,
        catalogueName: file.name.replace('.pdf', ''),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Échec du téléchargement. Réessayez.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'settings', 'contact'), settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Paramètres</h1>
          <p className="text-steel-dark mt-1">Gérez les informations de contact et le catalogue</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <div className="spinner w-4 h-4 border-white/30 border-t-white"></div>
          ) : saved ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enregistré !
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>

      {/* PDF CATALOGUE - First section */}
      <div className="card-dashboard p-6 mb-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="text-2xl">📄</span> Catalogue PDF
        </h2>
        
        <div className="space-y-4">
          {/* Upload */}
          <div>
            <label className="label">Télécharger le catalogue PDF</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-secondary flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="spinner w-4 h-4"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choisir un PDF
                  </>
                )}
              </button>
              <span className="text-xs text-steel-dark">Max 50MB</span>
            </div>
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="label">Ou coller une URL Cloudinary</label>
            <input
              type="url"
              value={settings.catalogueUrl}
              onChange={(e) => handleChange('catalogueUrl', e.target.value)}
              className="input-field"
              placeholder="https://res.cloudinary.com/.../catalogue.pdf"
            />
          </div>

          {/* Name */}
          <div>
            <label className="label">Nom du catalogue</label>
            <input
              type="text"
              value={settings.catalogueName}
              onChange={(e) => handleChange('catalogueName', e.target.value)}
              className="input-field"
              placeholder="Catalogue Europmat 2025"
            />
          </div>

          {/* Preview */}
          {settings.catalogueUrl && (
            <div className="p-4 bg-beige-warm rounded-xl border border-steel">
              <p className="text-sm font-medium text-charcoal mb-3">
                Aperçu : {settings.catalogueName}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={settings.catalogueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir le catalogue
                </a>
                <a
                  href={settings.catalogueUrl}
                  download
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WHATSAPP */}
      <div className="card-dashboard p-6 mb-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span> WhatsApp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Numéro (format international)</label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="input-field"
              placeholder="212625652015"
            />
            <p className="text-xs text-steel-dark mt-1">Sans le +</p>
          </div>
          <div>
            <label className="label">Message par défaut</label>
            <input
              type="text"
              value={settings.whatsappMessage}
              onChange={(e) => handleChange('whatsappMessage', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* PHONES */}
      <div className="card-dashboard p-6 mb-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="text-2xl">📞</span> Téléphones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Principal</label>
            <input
              type="text"
              value={settings.phone1}
              onChange={(e) => handleChange('phone1', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Secondaire</label>
            <input
              type="text"
              value={settings.phone2}
              onChange={(e) => handleChange('phone2', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* EMAIL & ADDRESS */}
      <div className="card-dashboard p-6 mb-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="text-2xl">📍</span> Email & Adresse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Adresse</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* OPENING HOURS */}
      <div className="card-dashboard p-6 mb-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="text-2xl">🕐</span> Horaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(settings.openingHours).map(([day, hours]) => (
            <div key={day}>
              <label className="label">{day}</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => handleHoursChange(day, e.target.value)}
                className="input-field"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW */}
      <div className="card-dashboard p-6 bg-beige-warm/30">
        <h2 className="text-lg font-semibold text-charcoal mb-4">Aperçu dans le footer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-steel-dark">📞 {settings.phone1}</p>
            <p className="text-steel-dark">📞 {settings.phone2}</p>
            <p className="text-steel-dark">✉️ {settings.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-steel-dark">📍 {settings.address}</p>
            {Object.entries(settings.openingHours).map(([day, hours]) => (
              <p key={day} className="text-steel-dark text-sm">
                <span className="font-medium">{day}:</span> {hours}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}