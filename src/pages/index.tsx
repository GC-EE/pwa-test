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
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by editing&nbsp;
            <code className="font-mono font-bold">src/pages/index.tsx</code>
          </p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div> */}

        {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div> */}

        {/* PWA TEST 섹션 */}
        <div className="mb-16 w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">PWA TEST</h1>
            <p className="text-xl mb-6">Progressive Web App 설치 테스트</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm mb-2">현재 상태</div>
                <div className="text-lg font-semibold">
                  {isInstalled ? '✅ 설치됨' : '❌ 미설치'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm mb-2">PWA 모드</div>
                <div className="text-lg font-semibold">
                  {isStandalone ? '✅ PWA 모드' : '❌ 브라우저 모드'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm mb-2">브라우저</div>
                <div className="text-lg font-semibold">
                  {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}{' '}
                  {isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other'}
                </div>
              </div>
            </div>

            {/* PWA 설치 버튼 */}
            {isInstallable && !isInstalled && !isStandalone && (
              <div className="mt-6">
                <button
                  onClick={installPWA}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  📱 PWA 설치하기
                </button>
              </div>
            )}

            {/* 설치 완료 메시지 */}
            {isInstalled && (
              <div className="mt-6">
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                  🎉 PWA가 설치되었습니다!
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </>
  );
}
