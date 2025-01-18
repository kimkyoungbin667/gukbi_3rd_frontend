// serviceWorkerRegistration.js
// 기본적인 서비스 워커 등록/해제 코드
// 필요한 경우 푸시 알림 및 기타 기능을 이곳에서 설정할 수 있습니다.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname === '127.0.0.1'
  );
  
  export function register() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // 서비스 워커를 등록합니다.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
        } else {
          registerValidSW(swUrl);
        }
      });
    }
  }
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('서비스 워커 등록 성공: ', registration);
      })
      .catch((error) => {
        console.error('서비스 워커 등록 실패: ', error);
      });
  }
  
  function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
      .then((response) => {
        if (
          response.status === 404 ||
          response.headers.get('content-type').indexOf('javascript') === -1
        ) {
          // 서비스 워커를 찾을 수 없는 경우
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister();
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log(
          '서비스 워커를 등록할 수 없습니다. 오프라인 상태일 수 있습니다.'
        );
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  