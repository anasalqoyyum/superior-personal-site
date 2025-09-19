export type CompendiumCategory = 'movie' | 'tv' | 'game' | 'book' | 'event'

export type CompendiumEntry = {
  title: string
  categories: CompendiumCategory
  date: string // ISO yyyy-mm-dd
  year: number
  href: string
  img?: string // used in grid view
  active?: boolean // highlights in the “Actively Playing” section
}

export const categoryEmoji: Record<CompendiumCategory, string> = {
  movie: '🍿',
  tv: '📺',
  game: '🎮',
  book: '📚',
  event: '🤘'
}

export const entries: CompendiumEntry[] = [
  // 2025
  { title: 'Black Panther', categories: 'movie', date: '2025-09-16', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Thor: Love and Thunder', categories: 'movie', date: '2025-09-15', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Thor: Ragnarok', categories: 'movie', date: '2025-09-14', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Thor: The Dark World', categories: 'movie', date: '2025-09-12', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Thor', categories: 'movie', date: '2025-09-11', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Getting LOST', categories: 'movie', date: '2025-09-10', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Black Widow', categories: 'movie', date: '2025-09-09', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Grey’s Anatomy', categories: 'tv', date: '2025-09-08', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Law & Order: Special Victims Unit', categories: 'tv', date: '2025-08-14', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'Clarkson’s Farm', categories: 'tv', date: '2025-07-16', year: 2025, href: '#', img: '/og-image.png' },
  { title: 'The Last of Us', categories: 'game', date: '2025-05-26', year: 2025, href: '#', img: '/og-image.png' },

  // 2024
  {
    title: 'Bocchi the Rock! Compilation',
    categories: 'movie',
    date: '2024-12-05',
    year: 2024,
    href: 'https://aniplex.co.jp/bocchi',
    img: '/assets/bochi.jpg'
  },
  {
    title: 'Retro 2024',
    categories: 'event',
    date: '2024-11-20',
    year: 2024,
    href: '/blog/en/closing-up-on-2024',
    img: '/assets/retro_2024.png'
  },
  {
    title: 'Software Testing Day',
    categories: 'event',
    date: '2024-09-20',
    year: 2024,
    href: '#',
    img: '/assets/software_testing_day.png'
  },
  { title: 'Kaiju No. 8', categories: 'tv', date: '2024-06-01', year: 2024, href: '#', img: '/assets/kai_title.png' },
  { title: 'Kaiju No. 8 Episode 1', categories: 'tv', date: '2024-06-08', year: 2024, href: '#', img: '/assets/kai-1.jpg' },
  { title: 'Kaiju No. 8 Episode 2', categories: 'tv', date: '2024-06-15', year: 2024, href: '#', img: '/assets/kai-2.png' },
  { title: 'Kaiju No. 8 Episode 3', categories: 'tv', date: '2024-06-22', year: 2024, href: '#', img: '/assets/kai-3.png' },
  { title: 'Kaiju No. 8 Episode 4', categories: 'tv', date: '2024-06-29', year: 2024, href: '#', img: '/assets/kai-4.png' },
  {
    title: 'Doing Things',
    categories: 'book',
    date: '2024-05-01',
    year: 2024,
    href: '/blog/en/doing-things',
    img: '/assets/doing_thing.webp'
  },
  { title: 'Types of Luck', categories: 'book', date: '2024-03-26', year: 2024, href: '/blog/en/types-of-luck', img: '/assets/luck.jpg' },
  {
    title: 'Types of Luck (ID)',
    categories: 'book',
    date: '2024-03-27',
    year: 2024,
    href: '/blog/id/types-of-luck',
    img: '/assets/luck_2.png'
  },
  { title: 'Rainbow: Chunithm', categories: 'game', date: '2024-02-17', year: 2024, href: '#', img: '/assets/rainbow_chunithm.png' },
  {
    title: 'Maimai',
    categories: 'game',
    date: '2024-04-24',
    year: 2024,
    href: 'https://maimai.sega.com/',
    img: '/assets/rainbow_maimai.png',
    active: true
  }
]
