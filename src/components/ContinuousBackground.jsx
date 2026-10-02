import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContinuousBackground = () => {
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current, 
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: "#projects",
            start: "bottom center",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-0"
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(217,70,239,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(217,70,239,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'bg-drift 20s linear infinite',
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bg-drift {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
      `}} />
    </div>
  );
};

export default ContinuousBackground;
