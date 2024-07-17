import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // target: 'http://www.codeman.ink/api/',
        target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    host: '0.0.0.0',
    port: 8080,
    open: true,
  },
  plugins: [
    vue(),
    // 添加 ESLint 插件配置
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'], exclude: ['node_modules', '.git', 'dist', 'src/assets/**/*.js'],
    }),
    AutoImport({ resolvers: [ElementPlusResolver({ importStyle: 'sass' })]}),
    Components({ resolvers: [ElementPlusResolver({ importStyle: 'sass' })]}),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }},
  css: { preprocessorOptions: { scss: { additionalData: '@use "@/styles/element/index.scss" as *;' }}},
  base: './',
  build: {
    rollupOptions: {
      output: {
        // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
        sanitizeFileName(name){
          const match = DRIVE_LETTER_REGEX.exec(name)
          const driveLetter = match ? match[0] : ''
          // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
          // Otherwise, avoid them because they can refer to NTFS alternate data streams.
          return (
            driveLetter +
            name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
          )
        },
      },
    },
  },
})
