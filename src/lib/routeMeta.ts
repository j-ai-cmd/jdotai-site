import { posts } from './posts'
import { articleJsonLd, canonical, type Meta } from './seo'

/** The single list the prerenderer walks. Keeping it here — rather than in the
 *  build script — means a new route can't be added without its head. */
export const routeMeta: Meta[] = [
  {
    title: 'jdotai — Bridging the gap between AI and legal',
    description:
      'jdotai builds custom tools, AI agents and automations for legal firms and helps them save 20+ hours every week.',
    path: '/',
  },
  {
    title: 'donna — AI intake and PMS connector for law firms | jdotai',
    description:
      'donna connects Clio, Smokeball, Actionstep, myCase and LEAP to Claude and ChatGPT, and gives your firm a custom intake form that syncs straight to your practice management system.',
    path: '/legal',
  },
  {
    title: 'Blogs — AI implementation for law firms | jdotai',
    description: 'Notes on AI, automation, and how small firms actually get work off their plate.',
    path: '/blog',
  },
  {
    title: 'Contact — jdotai',
    description:
      'Tell us which system you run on and where the hours go. We read every enquiry and reply within 24 hours.',
    path: '/contact',
  },
  {
    title: 'Page not found — jdotai',
    description: 'That page does not exist.',
    path: '/404',
  },
  ...posts
    .filter((p) => p.published)
    .map<Meta>((p) => ({
      title: p.pageTitle || `${p.title} | jdotai`,
      description: p.description,
      path: `/blog/${p.slug}`,
      ogType: 'article' as const,
      published: p.date,
      jsonLd: articleJsonLd({
        title: p.title,
        description: p.description,
        path: `/blog/${p.slug}`,
        published: p.date,
      }),
    })),
]

export { canonical }
