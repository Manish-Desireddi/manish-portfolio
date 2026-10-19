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

      {/* Ambient glows using hardware-friendly CSS radial gradients (zero blur filter cost) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.12), transparent 45%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.08), transparent 50%)',
        }}
      />

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
