import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import vueJsx from "@vitejs/plugin-vue-jsx";
import postcsspxtoviewport from 'postcss-px-to-viewport'
import { loadEnv } from 'vite';
const root = process.cwd();

const env = loadEnv('development', root)
const httpUrl = env.VITE_APP_BASE_API

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: true,
    proxy: {
      '/api': {
        target: httpUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^/api`), ''),
        secure: false // https is require secure=false
      },
      '/ISAPI': {
        target: `${httpUrl}/ISAPI`,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^/ISAPI`), ''),
        secure: false // https is require secure=false
      },
      '/SDK': {
        target: `${httpUrl}/SDK`,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^/SDK`), ''),
        secure: false // https is require secure=false
      },
      '/webSocketVideoCtrlProxy': {
        target: 'ws://10.20.30.100:8091/webSocketVideoCtrlProxy',
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^/webSocketVideoCtrlProxy`), '/webSocketVideoCtrlProxy'),
        ws: true // https is require secure=false
      }
    }
  },
  plugins: [vue(), WindiCSS(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {

    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 1920, // UI设计稿的宽度
          viewportHeight: 1080, // UI设计稿的宽度
          unitPrecision: 2, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'rem', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'rem', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          // exclude: [],
          landscape: false // 是否处理横屏情况
        })
      ]
    }
  },
  build: {
    rollupOptions: {
      external: ['element-china-area-data']
    }
  }
})
