import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy-load the actual Three.js canvas so mobile devices (which never
// mount it) don't even download the three / drei / r3f chunks.
const HeroBlobCanvas = lazy(() => import('./HeroBlobCanvas'));

const DESKTOP_QUERY = '(min-width: 768px)';

export default function HeroBlob() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setShouldRender(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <HeroBlobCanvas />
    </Suspense>
  );
}
