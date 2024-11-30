import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import {VitePWA} from 'vite-plugin-pwa'
const manifestForPlugin = {
  registerType:'prompt',
  manifest:{
    name:"WTF",
    short_name:"WTF",
    description:"WTF = What A True Feedback",
    icons:[{
      src: 'https://sdrive.blr1.cdn.digitaloceanspaces.com/files/5771e0daa9f3c805dc12e921a7eabcf5.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'https://sdrive.blr1.cdn.digitaloceanspaces.com/files/5771e0daa9f3c805dc12e921a7eabcf5.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: 'https://sdrive.blr1.cdn.digitaloceanspaces.com/files/5771e0daa9f3c805dc12e921a7eabcf5.png',
      sizes:'180x180',
      type:'image/png',
      purpose:'apple touch icon',
    },
    {
      src: 'https://sdrive.blr1.cdn.digitaloceanspaces.com/files/5771e0daa9f3c805dc12e921a7eabcf5.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable',
    }
  ],
  theme_color:'#f26eae',
  background_color:'#f26eae',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

})