import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isChrome: boolean;
  isSafari: boolean;
  showInstallPrompt: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export function usePWAInstall() {
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    isChrome: false,
    isSafari: false,
    showInstallPrompt: false,
    installPrompt: null,
  });

  // 브라우저 감지
  const detectBrowser = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    console.log('🔍 브라우저 감지:', {
      userAgent,
      isIOS,
      isAndroid,
      isChrome,
      isSafari,
      isStandalone,
      displayMode: window.matchMedia('(display-mode: standalone)').matches,
      navigatorStandalone: (window.navigator as any).standalone,
    });

    return { isIOS, isAndroid, isChrome, isSafari, isStandalone };
  }, []);

  // PWA 설치 상태 확인
  const checkInstallStatus = useCallback(() => {
    const browser = detectBrowser();
    const isInstalled =
      browser.isStandalone || localStorage.getItem('pwa-installed') === 'true';

    console.log('📱 PWA 설치 상태 확인:', {
      browser,
      isInstalled,
      localStorage: localStorage.getItem('pwa-installed'),
    });

    setState((prev) => ({
      ...prev,
      ...browser,
      isInstalled,
    }));
  }, [detectBrowser]);

  // 설치 프롬프트 이벤트 핸들러
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    console.log('🎉 beforeinstallprompt 이벤트 발생!', e);
    e.preventDefault();
    const event = e as BeforeInstallPromptEvent;

    console.log('📦 설치 프롬프트 설정:', {
      platforms: event.platforms,
      event,
    });

    setState((prev) => ({
      ...prev,
      isInstallable: true,
      installPrompt: event,
      showInstallPrompt: true,
    }));
  }, []);

  // 앱 설치됨 이벤트 핸들러
  const handleAppInstalled = useCallback(() => {
    localStorage.setItem('pwa-installed', 'true');
    setState((prev) => ({
      ...prev,
      isInstalled: true,
      isInstallable: false,
      showInstallPrompt: false,
      installPrompt: null,
    }));
  }, []);

  // PWA 설치 실행
  const installPWA = useCallback(async () => {
    if (state.installPrompt) {
      // Chrome/Edge 등의 beforeinstallprompt 이벤트 사용
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        handleAppInstalled();
      }
    } else if (state.isIOS && state.isSafari) {
      // iOS Safari의 경우 수동 안내
      alert(
        'iOS Safari에서 PWA를 설치하려면:\n1. 하단 공유 버튼을 탭하세요\n2. "홈 화면에 추가"를 선택하세요'
      );
    } else if (state.isAndroid && state.isChrome) {
      // Android Chrome의 경우 수동 안내
      alert(
        'Android Chrome에서 PWA를 설치하려면:\n1. 주소창 옆 메뉴 버튼을 탭하세요\n2. "홈 화면에 추가"를 선택하세요'
      );
    }
  }, [
    state.installPrompt,
    state.isIOS,
    state.isSafari,
    state.isAndroid,
    state.isChrome,
    handleAppInstalled,
  ]);

  // 설치 프롬프트 숨기기
  const dismissInstallPrompt = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showInstallPrompt: false,
    }));
  }, []);

  useEffect(() => {
    console.log('🚀 usePWAInstall 훅 초기화');

    // PWA 요구사항 체크
    console.log('🔍 PWA 요구사항 체크:', {
      isHTTPS:
        location.protocol === 'https:' || location.hostname === 'localhost',
      hasManifest: !!document.querySelector('link[rel="manifest"]'),
      hasServiceWorker: 'serviceWorker' in navigator,
      serviceWorkerRegistration: navigator.serviceWorker?.controller,
    });

    // Service Worker 등록 상태 확인
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log('🔧 Service Worker 등록 상태:', {
          registrations: registrations.length,
          controllers: registrations.map((reg) => reg.active?.scriptURL),
        });
      });
    }

    // 초기 상태 확인
    checkInstallStatus();

    // Chrome/Edge의 beforeinstallprompt 이벤트
    console.log('👂 beforeinstallprompt 이벤트 리스너 등록');
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 앱 설치 완료 이벤트
    console.log('👂 appinstalled 이벤트 리스너 등록');
    window.addEventListener('appinstalled', handleAppInstalled);

    // display-mode 변경 감지 (PWA로 전환됨을 감지)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      console.log('📱 display-mode 변경 감지');
      checkInstallStatus();
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // 현재 상태 로그
    console.log('📊 현재 PWA 상태:', {
      isInstallable: state.isInstallable,
      isInstalled: state.isInstalled,
      isStandalone: state.isStandalone,
      showInstallPrompt: state.showInstallPrompt,
      installPrompt: !!state.installPrompt,
    });

    return () => {
      console.log('🧹 이벤트 리스너 정리');
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [checkInstallStatus, handleBeforeInstallPrompt, handleAppInstalled]);

  return {
    ...state,
    installPWA,
    dismissInstallPrompt,
    checkInstallStatus,
  };
}
