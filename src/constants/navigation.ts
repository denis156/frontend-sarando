import type {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from '@/components/navigation/StaggeredMenu.vue'

export const MENU_ITEMS: StaggeredMenuItem[] = [
  { label: 'Beranda', ariaLabel: 'Kembali ke halaman utama', link: '/' },
  { label: 'Layanan', ariaLabel: 'Lihat layanan kami', link: '/layanan' },
  { label: 'Proyek', ariaLabel: 'Lihat proyek kami', link: '/proyek' },
  { label: 'Blog', ariaLabel: 'Lihat blog kami', link: '/blog' },
  { label: 'Kontak', ariaLabel: 'Hubungi kami', link: '/kontak' },
]

export const SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' },
]
