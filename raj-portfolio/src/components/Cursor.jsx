import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);

    let raf;
    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.13;
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.13;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px';
        ringRef.current.style.top  = pos.current.ry + 'px';
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const hover = () => {
      dotRef.current  && (dotRef.current.style.cssText  += ';width:16px;height:16px;background:var(--a2)');
      ringRef.current && (ringRef.current.style.cssText += ';width:50px;height:50px;border-color:var(--a2)');
    };
    const unhover = () => {
      dotRef.current  && (dotRef.current.style.cssText  += ';width:10px;height:10px;background:var(--a1)');
      ringRef.current && (ringRef.current.style.cssText += ';width:36px;height:36px;border-color:var(--a1)');
    };
    const addListeners = () => {
      document.querySelectorAll('a,button,.proj-card').forEach(el => {
        el.addEventListener('mouseenter', hover);
        el.addEventListener('mouseleave', unhover);
      });
    };
    addListeners();
    const mo = new MutationObserver(addListeners);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  style={dotStyle} />
      <div ref={ringRef} style={ringStyle} />
    </>
  );
}

const dotStyle = {
  width: 10, height: 10,
  background: 'var(--a1)',
  borderRadius: '50%',
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 9999,
  transform: 'translate(-50%,-50%)',
  transition: 'width .15s, height .15s, background .2s',
  mixBlendMode: 'screen',
};
const ringStyle = {
  width: 36, height: 36,
  border: '1.5px solid var(--a1)',
  borderRadius: '50%',
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 9998,
  transform: 'translate(-50%,-50%)',
  transition: 'width .3s, height .3s, border-color .3s',
  opacity: 0.55,
};
