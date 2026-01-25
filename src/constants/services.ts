export interface Service {
  id: number
  title: string
  description: string
  icon: string // Lucide icon name
  image: string // Picsum photos URL
  features: string[]
  isPopular?: boolean // Menandai layanan yang populer
}

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Website Development',
    description:
      'Bangun website profesional yang responsif, cepat, dan SEO-friendly untuk meningkatkan kehadiran online bisnis Anda.',
    icon: 'Globe',
    image: 'https://picsum.photos/seed/web-dev/800/600',
    features: [
      'Website Company Profile',
      'E-Commerce & Marketplace',
      'Landing Page',
      'Web Application',
      'CMS & Dashboard Admin'
    ],
    isPopular: true
  },
  {
    id: 2,
    title: 'Mobile App Development',
    description:
      'Kembangkan aplikasi mobile native dan cross-platform yang user-friendly untuk iOS dan Android.',
    icon: 'Smartphone',
    image: 'https://picsum.photos/seed/mobile-dev/800/600',
    features: [
      'Android & iOS Apps',
      'Cross-Platform (Flutter/React Native)',
      'Progressive Web Apps (PWA)',
      'App Maintenance & Updates',
      'Play Store & App Store Publishing'
    ],
    isPopular: true
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description:
      'Desain antarmuka yang menarik dan pengalaman pengguna yang optimal untuk produk digital Anda.',
    icon: 'Palette',
    image: 'https://picsum.photos/seed/uiux-design/800/600',
    features: [
      'User Interface Design',
      'User Experience Research',
      'Prototype & Wireframing',
      'Design System',
      'Usability Testing'
    ],
    isPopular: true
  },
  {
    id: 4,
    title: 'System Integration',
    description:
      'Integrasikan berbagai sistem dan aplikasi untuk meningkatkan efisiensi operasional bisnis Anda.',
    icon: 'GitMerge',
    image: 'https://picsum.photos/seed/integration/800/600',
    features: [
      'API Development & Integration',
      'Third-party Service Integration',
      'Payment Gateway Integration',
      'ERP & CRM Integration',
      'Cloud Migration'
    ]
  },
  {
    id: 5,
    title: 'IT Consulting',
    description:
      'Konsultasi teknologi untuk membantu bisnis Anda mengambil keputusan IT yang tepat dan strategis.',
    icon: 'Lightbulb',
    image: 'https://picsum.photos/seed/consulting/800/600',
    features: [
      'Technology Strategy',
      'Digital Transformation',
      'IT Infrastructure Planning',
      'Security Assessment',
      'Performance Optimization'
    ]
  },
  {
    id: 6,
    title: 'Maintenance & Support',
    description:
      'Layanan maintenance dan support berkelanjutan untuk memastikan sistem Anda berjalan optimal.',
    icon: 'Wrench',
    image: 'https://picsum.photos/seed/maintenance/800/600',
    features: [
      'Bug Fixing & Troubleshooting',
      'Performance Monitoring',
      'Security Updates',
      'Technical Support 24/7',
      'System Backup & Recovery'
    ]
  }
]
