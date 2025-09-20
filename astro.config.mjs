import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://italiyskyi-kvartal.example',
  integrations: [
    starlight({
      title: 'ЖК "Італійський квартал"',
      locales: {
        root: { label: 'Українська', lang: 'uk' }
      },
      sidebar: [
        { label: 'Головна', link: '/' },
        { label: 'Контакти', link: '/contacts/' },
        { label: 'Інфраструктура', link: '/infrastructure/' },
        { label: 'Благодійність', link: '/charity/' },
        { label: 'Документація', link: '/docs/' },
        { label: 'FAQ', link: '/faq/' }
      ],
      favicon: '/favicon.svg'
    })
  ]
});
