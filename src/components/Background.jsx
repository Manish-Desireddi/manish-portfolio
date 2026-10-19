import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-app-dark overflow-hidden">
      {/* Drifting subtle dot grid */}
      <div
        className="dot-grid-drift absolute inset-[-100%] opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(217, 70, 239, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-pink-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[70vw] md:w-[50vw] h-[70vw] md:h-[50vw] bg-amber-500/5 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen" />

      <style>{`
        @media (pointer: fine) {
          .dot-grid-drift {
            animation: drift 60s linear infinite;
          }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50%, 50%); }
        }
      `}</style>
    </div>
  );
};

export default Background;
