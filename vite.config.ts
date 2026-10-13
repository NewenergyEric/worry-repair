import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],resolve:{preserveSymlinks:true},optimizeDeps:{esbuildOptions:{preserveSymlinks:true}},build:{rollupOptions:{preserveSymlinks:true,output:{manualChunks:{three:['three'],motion:['motion']}}}},server:{port:4321,strictPort:true}});
