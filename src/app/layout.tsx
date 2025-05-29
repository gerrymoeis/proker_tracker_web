import type { Metadata } from 'next'
import { Inter, Montserrat, Poppins } from 'next/font/google'
import { AuthProvider } from '@/lib/auth/auth-context';
import Script from 'next/script';
import { defaultMetadata } from '@/lib/metadata';
import './globals.css'

// Import fonts as per design brief
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: '/logo.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Custom favicon */}
        <link rel="icon" href="/logo.ico" sizes="any" />
        <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
        
        {/* Structured Data for Organization */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Himafortic",
              "url": "https://proker-tracker.netlify.app",
              "logo": "https://proker-tracker.netlify.app/logo.png",
              "description": "Himpunan Mahasiswa Teknik Informatika yang berfokus pada pengembangan kompetensi mahasiswa dalam bidang teknologi informasi.",
              "sameAs": [
                "https://instagram.com/himafortic",
                "https://twitter.com/himafortic"
              ]
            })
          }}
        />
        
        {/* Structured Data for SoftwareApplication */}
        <Script
          id="structured-data-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Proker Tracker",
              "applicationCategory": "ProjectManagementApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR"
              },
              "description": "Aplikasi manajemen program kerja untuk organisasi mahasiswa dengan fitur pelacakan tugas, timeline, dan evaluasi program.",
              "keywords": "program kerja, organisasi mahasiswa, manajemen proyek, kompetisi pemrograman Indonesia, pelatihan coding mahasiswa"
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
