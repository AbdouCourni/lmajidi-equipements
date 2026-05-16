// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Europmat - Équipement Professionnel',
    short_name: 'Europmat',
    description: 'Équipements professionnels pour restaurants et commerces',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#03045e',
    icons: [
      { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}