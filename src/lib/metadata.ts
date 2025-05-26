// Default metadata for the application
export const defaultMetadata = {
  title: 'Proker Tracker - Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa',
  description: 'Proker Tracker adalah aplikasi manajemen program kerja untuk organisasi mahasiswa. Kelola program kerja, tugas, dan anggota dengan mudah dan efisien.',
  keywords: [
    'proker tracker',
    'manajemen program kerja',
    'organisasi mahasiswa',
    'aplikasi manajemen tugas',
    'kompetisi pemrograman Indonesia',
    'pelatihan coding mahasiswa',
    'innovation lab',
    'Gemastik',
    'Olivia competition',
    'UI/UX design learning',
    'web development training',
    'C++ programming education'
  ],
  authors: [
    { name: 'Himafortic', url: 'https://himafortic.org' }
  ],
  creator: 'Himafortic',
  publisher: 'Himafortic',
  formatDetection: {
    email: false,
    telephone: false,
    address: false
  },
  metadataBase: new URL('https://proker-tracker.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://proker-tracker.netlify.app',
    title: 'Proker Tracker - Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa',
    description: 'Proker Tracker adalah aplikasi manajemen program kerja untuk organisasi mahasiswa. Kelola program kerja, tugas, dan anggota dengan mudah dan efisien.',
    siteName: 'Proker Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Proker Tracker - Aplikasi Manajemen Program Kerja'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proker Tracker - Aplikasi Manajemen Program Kerja',
    description: 'Proker Tracker adalah aplikasi manajemen program kerja untuk organisasi mahasiswa. Kelola program kerja, tugas, dan anggota dengan mudah dan efisien.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: "index, follow, max-video-preview: -1, max-image-preview: large, max-snippet: -1"
  }
};

// Generate metadata for specific pages
export function generateMetadata(
  title?: string,
  description?: string,
  keywords?: string[],
  path?: string,
  imageUrl?: string
) {
  const pageTitle = title ? `${title} | Proker Tracker` : defaultMetadata.title;
  const pageDescription = description || defaultMetadata.description;
  const pageKeywords = keywords ? [...defaultMetadata.keywords, ...keywords] : defaultMetadata.keywords;
  const canonical = path ? path : defaultMetadata.alternates.canonical;
  const ogImage = imageUrl || '/og-image.png';

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      url: `https://proker-tracker.netlify.app${canonical}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
      images: [ogImage]
    }
  };
}
