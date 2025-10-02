import Image from 'next/image';
import { Inter } from 'next/font/google';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { usePWAInstall } from '../hooks/usePWAInstall';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const {
    isInstalled,
    isStandalone,
    isIOS,
    isSafari,
    isAndroid,
    isChrome,
    isInstallable,
    installPWA,
  } = usePWAInstall();

  return (
    <>
      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </>
  );
}
