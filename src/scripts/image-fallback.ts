/**
 * 이미지 실패 대체 (EXPERIENCE.md State Patterns › 이미지 실패)
 * 프레임(16:10)은 그대로 두고, 이미지를 투명하게 한 뒤 가운데에 프로젝트명을 보인다. alt는 그대로 남긴다.
 */
const FAILED_CLASS = 'is-media-failed';

function initImageFallback(): void {
  document.querySelectorAll<HTMLElement>('[data-media-frame]').forEach((frame) => {
    const markFailed = () => frame.classList.add(FAILED_CLASS);
    frame.querySelectorAll('img').forEach((image) => {
      // 스크립트가 실행되기 전에 이미 실패한 이미지
      if (image.complete && image.naturalWidth === 0 && image.currentSrc !== '') {
        markFailed();
        return;
      }
      image.addEventListener('error', markFailed, { once: true });
    });
  });
}

try {
  initImageFallback();
} catch (error) {
  console.error('[image-fallback]', error);
}
