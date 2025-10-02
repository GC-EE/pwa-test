import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallPromptProps {
  className?: string;
}

export default function PWAInstallPrompt({
  className = '',
}: PWAInstallPromptProps) {
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isSafari,
    isAndroid,
    isChrome,
    showInstallPrompt,
    installPWA,
    dismissInstallPrompt,
  } = usePWAInstall();

  console.log('🎯 PWAInstallPrompt 렌더링:', {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isSafari,
    isAndroid,
    isChrome,
    showInstallPrompt,
  });

  // 이미 설치되었거나 PWA 모드로 실행 중이면 표시하지 않음
  if (isInstalled || isStandalone) {
    console.log('❌ 이미 설치됨 또는 PWA 모드 - 프롬프트 숨김');
    return null;
  }

  // 설치 가능하지 않거나 프롬프트를 숨겨야 하는 경우
  if (!isInstallable || !showInstallPrompt) {
    console.log('❌ 설치 불가능 또는 프롬프트 숨김:', {
      isInstallable,
      showInstallPrompt,
    });
    return null;
  }

  console.log('✅ PWA 설치 프롬프트 표시');

  const getInstallMessage = () => {
    if (isIOS && isSafari) {
      return 'iOS Safari에서 PWA를 설치하려면 하단 공유 버튼을 탭하고 "홈 화면에 추가"를 선택하세요.';
    }
    if (isAndroid && isChrome) {
      return 'Android Chrome에서 PWA를 설치하려면 주소창 옆 메뉴 버튼을 탭하고 "홈 화면에 추가"를 선택하세요.';
    }
    return '이 앱을 홈 화면에 추가하여 더 빠르게 접근할 수 있습니다.';
  };

  const getInstallButtonText = () => {
    if (isIOS && isSafari) {
      return '설치 방법 보기';
    }
    if (isAndroid && isChrome) {
      return '설치 방법 보기';
    }
    return '지금 설치';
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18l9-5-9-5-9 5 9 5z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              앱 설치
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {getInstallMessage()}
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={installPWA}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {getInstallButtonText()}
              </button>
              <button
                onClick={dismissInstallPrompt}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                나중에
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={dismissInstallPrompt}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
