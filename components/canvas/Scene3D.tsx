'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import Planet3D from './Planet3D';
import DetailModal from '@/components/ui/DetailModal';
import { setGlobalWheelDisabled } from '@/hooks/useWheelZoom';

function CameraController({
  inDetailView,
  modalOpen,
  progress
}: {
  inDetailView: boolean;
  modalOpen: boolean;
  progress: number;
}) {
  const { camera } = useThree();

  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  const lockedCameraPosition = useRef<THREE.Vector3 | null>(null);
  const lockedCameraLookAt = useRef<THREE.Vector3 | null>(null);
  const wasModalOpen = useRef(false);

  useFrame(() => {
    if (modalOpen) {
      if (!wasModalOpen.current) {
        lockedCameraPosition.current = camera.position.clone();
        lockedCameraLookAt.current = currentLookAtRef.current.clone();
        wasModalOpen.current = true;
      }

      if (lockedCameraPosition.current && lockedCameraLookAt.current) {
        camera.position.copy(lockedCameraPosition.current);
        camera.lookAt(lockedCameraLookAt.current);
      }
      return;
    }

    if (!modalOpen && wasModalOpen.current) {
      wasModalOpen.current = false;

      if (lockedCameraLookAt.current) {
        currentLookAtRef.current.copy(lockedCameraLookAt.current);
      }

      if (lockedCameraPosition.current) {
        camera.position.copy(lockedCameraPosition.current);
      }

      lockedCameraPosition.current = null;
      lockedCameraLookAt.current = null;
    }

    const normalizedProgress = progress / 100;

    const startZ = 50;
    const endZ = 8;
    const detailZ = 4.2;

    let targetZ = startZ - (startZ - endZ) * normalizedProgress;
    if (inDetailView) {
      targetZ = detailZ;
    }

    const currentZ = camera.position.z;
    const lerpFactor = inDetailView ? 0.08 : 0.15;
    const newZ = currentZ + (targetZ - currentZ) * lerpFactor;

    const planetX = -15;
    const planetY = 15;
    const planetZ = 0;

    const startCameraX = 15;
    const startCameraY = -15;
    const endCameraX = -15;
    const endCameraY = 15;

    const targetPosX = inDetailView
      ? planetX
      : startCameraX + (endCameraX - startCameraX) * normalizedProgress;

    const targetPosY = inDetailView
      ? planetY
      : startCameraY + (endCameraY - startCameraY) * normalizedProgress;

    const currentX = camera.position.x;
    const currentY = camera.position.y;
    const newX = currentX + (targetPosX - currentX) * lerpFactor;
    const newY = currentY + (targetPosY - currentY) * lerpFactor;

    camera.position.set(newX, newY, newZ);

    const targetLookAtX = inDetailView ? planetX : planetX * normalizedProgress;
    const targetLookAtY = inDetailView ? planetY : planetY * normalizedProgress;
    const targetLookAtZ = planetZ;

    const currentLookAt = currentLookAtRef.current;
    currentLookAt.x += (targetLookAtX - currentLookAt.x) * lerpFactor;
    currentLookAt.y += (targetLookAtY - currentLookAt.y) * lerpFactor;
    currentLookAt.z += (targetLookAtZ - currentLookAt.z) * lerpFactor;

    camera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z);
  });

  return null;
}

interface Scene3DProps {
  progress: number;
}

export default function Scene3D({ progress }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [inDetailView, setInDetailView] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleModalClose = () => {
    setGlobalWheelDisabled(false);

    setShowModal(false);

    setInDetailView(false);

    window.dispatchEvent(new CustomEvent('whitePageClose'));
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inDetailView) {
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inDetailView]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('detailViewChange', { detail: { inDetailView } }));
  }, [inDetailView]);

  useEffect(() => {
    const handleExitDetailView = () => {
      handleModalClose();
    };

    window.addEventListener('exitDetailView', handleExitDetailView);
    return () => window.removeEventListener('exitDetailView', handleExitDetailView);
  }, [showModal]);

  useEffect(() => {
    const handleZoomToPlanetAndOpen = () => {
      if (progress >= 95) {
        handlePlanetClick();
      } else {
        setGlobalWheelDisabled(true);

        window.dispatchEvent(new CustomEvent('setZoomProgress', { detail: { progress: 100 } }));

        setTimeout(() => {
          handlePlanetClick();
        }, 1000);
      }
    };

    window.addEventListener('zoomToPlanetAndOpen', handleZoomToPlanetAndOpen);
    return () => window.removeEventListener('zoomToPlanetAndOpen', handleZoomToPlanetAndOpen);
  }, [progress]);

  const handlePlanetClick = () => {
    if (progress >= 95) {
      setGlobalWheelDisabled(true);

      window.dispatchEvent(new CustomEvent('whitePageOpen'));

      setInDetailView(true);

      setTimeout(() => {
        setShowModal(true);
      }, 200);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-auto"
        style={{
          zIndex: 2,
          opacity: showModal ? 0 : 1,
          transform: inDetailView ? 'scale(1.5)' : 'scale(1)',
          pointerEvents: showModal ? 'none' : 'auto',
          transition: 'opacity 0.35s ease-in-out, transform 0.35s ease-in-out',
          transformOrigin: 'center center',
          animation: 'planetMaterialize 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
      <Canvas
        camera={{
          position: [25, -15, 50],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <CameraController inDetailView={inDetailView} modalOpen={showModal} progress={progress} />

          <ambientLight intensity={0.3} />

          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />

          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.3}
          />

          <pointLight
            position={[0, 5, 10]}
            intensity={0.5}
            color="#ffffff"
          />

          <group>
            <Planet3D
              position={[-15, 15, 0]}
              scale={4}
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              name="davlo.io"
              roughness={0.7}
              metalness={0.1}
              onClick={handlePlanetClick}
              disableHover={inDetailView || progress < 95}
              showLabel={true}
              labelText="davlo.io"
            />
          </group>
        </Suspense>
      </Canvas>
    </div>

    <DetailModal
      isOpen={showModal}
      onClose={handleModalClose}
      textBlock={
        <p style={{
          fontSize: '18px',
          lineHeight: '1.7',
          fontWeight: 400,
          color: '#000000',
          margin: 0,
        }}>
          We are two colleagues with a shared obsession: building software that actually matters.
          We spend our free time creating what doesn't exist yet not following trends, but setting them.
          Anyone can copy what's already been done. We build what hasn't, bringing real innovation and value to every project.
          We're always at the forefront of new technologies, turning cutting-edge ideas into working products.
          Everything here is built in our free time. This shows that great engineering comes from passion.
        </p>
      }
      missionText={
        <p style={{
          fontSize: '18px',
          lineHeight: '1.7',
          fontWeight: 400,
          color: '#000000',
          margin: 0,
        }}>
          Software for the universe means thinking bigger. We don't build basic tools that anyone can create.
          We develop solutions that solve real problems, improve systems, and expand what's possible.
          Every project pushes boundaries. Every line of code serves a purpose.
          We're not here to add to the noise we're here to build what actually matters and makes the universe a better place.
        </p>
      }
      team={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-end',
        }}>
          {[
            { name: 'JumpiiX', website: 'https://www.unterguggenberger.ch/', github: 'https://github.com/JumpiiX' },
            { name: 'moinloin', website: 'https://loiskauffungen.com/', github: 'https://github.com/moinloin' },
          ].map((member) => (
            <div
              key={member.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                title="Website"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666666',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666666',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <span style={{
                color: '#666666',
                fontSize: '20px',
                fontWeight: 400,
                textTransform: 'lowercase',
              }}>
                {member.name}
              </span>
            </div>
          ))}
        </div>
      }
      techStack={
        <div style={{
          position: 'relative',
          width: 'calc(96px * 7)',
          height: '280px',
        }}>
          
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="80" y1="60" x2="180" y2="60" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="180" y1="60" x2="280" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="280" y1="100" x2="380" y2="60" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="380" y1="60" x2="480" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="180" y1="60" x2="230" y2="180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="280" y1="100" x2="330" y2="180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="380" y1="60" x2="430" y2="180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="230" y1="180" x2="330" y2="180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="330" y1="180" x2="430" y2="180" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          </svg>

          
          {[
            { name: 'Rust', icon: 'rust', x: 80, y: 60 },
            { name: 'Kubernetes', icon: 'kubernetes', x: 180, y: 60 },
            { name: 'GraphQL', icon: 'graphql', x: 280, y: 100 },
            { name: 'WebAssembly', icon: 'webassembly', x: 380, y: 60 },
            { name: 'Go', icon: 'go', x: 480, y: 100 },
            { name: 'Tokio', icon: 'tokio', x: 230, y: 180 },
            { name: 'PostgreSQL', icon: 'postgresql', x: 330, y: 180 },
            { name: 'Docker', icon: 'docker', x: 430, y: 180 },
          ].map((tech) => (
            <div
              key={tech.name}
              title={tech.name}
              style={{
                position: 'absolute',
                left: `${tech.x}px`,
                top: `${tech.y}px`,
                transform: 'translate(-50%, -50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <img
                src={`https://cdn.simpleicons.org/${tech.icon}/000000`}
                alt={tech.name}
                style={{
                  width: '28px',
                  height: '28px',
                }}
              />
            </div>
          ))}
        </div>
      }
    >
    </DetailModal>
    </>
  );
}
