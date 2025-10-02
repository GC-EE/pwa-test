import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { app } from '@/lib/firebase';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker 등록 성공:', registration);
        })
        .catch((error) => {
          console.log('❌ Service Worker 등록 실패:', error);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
