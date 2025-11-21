import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前目录下的 .env 文件
  // 第三个参数 '' 表示加载所有变量，不管是否有 VITE_ 前缀
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 将读取到的 API_KEY 注入到代码中的 process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})