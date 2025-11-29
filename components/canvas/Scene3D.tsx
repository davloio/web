'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import Planet3D from './Planet3D';
import DetailModal from '@/components/ui/DetailModal';
import { setGlobalWheelDisabled } from '@/hooks/useWheelZoom';
import {
  PROJECT_PLANETS,
  PLACEHOLDER_PLANETS,
  SOLAR_SYSTEM_CENTER,
  SOLAR_SYSTEM_RADIUS,
  OVERVIEW_DISTANCE,
  DETAIL_ZOOM_DISTANCE,
  ProjectPlanetConfig,
} from '@/types/planet';

type DetailViewType = 'about' | 'project-pink' | 'project-dark' | null;

function CameraController({
  inDetailView,
  modalOpen,
  progress,
  activePlanetPosition,
}: {
  inDetailView: DetailViewType;
  modalOpen: boolean;
  progress: number;
  activePlanetPosition: [number, number, number] | null;
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

    const aboutPlanetX = -15;
    const aboutPlanetY = 15;
    const aboutPlanetZ = 0;
    const solarSystemCenterX = SOLAR_SYSTEM_CENTER[0];
    const solarSystemCenterY = SOLAR_SYSTEM_CENTER[1];
    const solarSystemCenterZ = SOLAR_SYSTEM_CENTER[2];
    const overviewZ = OVERVIEW_DISTANCE;

    const startZ = 50;
    const zoomZ = 8;
    const transitionZ = 12;

    const startCameraX = 15;
    const startCameraY = -15;

    let targetZ: number;
    let targetPosX: number;
    let targetPosY: number;
    let targetLookAtX: number;
    let targetLookAtY: number;
    let targetLookAtZ: number;

    const lerpFactor = inDetailView !== null ? 0.08 : 0.12;

    if (inDetailView === 'about') {
      targetZ = DETAIL_ZOOM_DISTANCE;
      targetPosX = aboutPlanetX;
      targetPosY = aboutPlanetY;
      targetLookAtX = aboutPlanetX;
      targetLookAtY = aboutPlanetY;
      targetLookAtZ = aboutPlanetZ;
    } else if (inDetailView === 'project-pink' || inDetailView === 'project-dark') {
      if (activePlanetPosition) {
        targetPosX = activePlanetPosition[0];
        targetPosY = activePlanetPosition[1];
        targetZ = DETAIL_ZOOM_DISTANCE + activePlanetPosition[2];
        targetLookAtX = activePlanetPosition[0];
        targetLookAtY = activePlanetPosition[1];
        targetLookAtZ = activePlanetPosition[2];
      } else {
        targetPosX = solarSystemCenterX;
        targetPosY = solarSystemCenterY;
        targetZ = overviewZ + solarSystemCenterZ;
        targetLookAtX = solarSystemCenterX;
        targetLookAtY = solarSystemCenterY;
        targetLookAtZ = solarSystemCenterZ;
      }
    } else if (normalizedProgress < 1.0) {
      const zoneProgress = normalizedProgress;
      targetZ = startZ - (startZ - zoomZ) * zoneProgress;
      targetPosX = startCameraX + (aboutPlanetX - startCameraX) * zoneProgress;
      targetPosY = startCameraY + (aboutPlanetY - startCameraY) * zoneProgress;
      targetLookAtX = aboutPlanetX * zoneProgress;
      targetLookAtY = aboutPlanetY * zoneProgress;
      targetLookAtZ = aboutPlanetZ;
    } else if (normalizedProgress < 1.1) {
      targetZ = zoomZ;
      targetPosX = aboutPlanetX;
      targetPosY = aboutPlanetY;
      targetLookAtX = aboutPlanetX;
      targetLookAtY = aboutPlanetY;
      targetLookAtZ = aboutPlanetZ;
    } else if (normalizedProgress < 2.2) {
      if (normalizedProgress < 1.4) {
        const subProgress = (normalizedProgress - 1.1) / 0.3;
        targetZ = zoomZ + (transitionZ - zoomZ) * subProgress;
        targetPosX = aboutPlanetX;
        targetPosY = aboutPlanetY;
        targetLookAtX = aboutPlanetX;
        targetLookAtY = aboutPlanetY;
        targetLookAtZ = aboutPlanetZ;
      } else if (normalizedProgress < 1.8) {
        const subProgress = (normalizedProgress - 1.4) / 0.4;
        const pivotX = aboutPlanetX;
        const pivotY = aboutPlanetY;
        const pivotZ = transitionZ;

        targetZ = pivotZ;
        targetPosX = pivotX;
        targetPosY = pivotY;
        targetLookAtX = aboutPlanetX + (solarSystemCenterX - aboutPlanetX) * subProgress;
        targetLookAtY = aboutPlanetY + (solarSystemCenterY - aboutPlanetY) * subProgress;
        targetLookAtZ = aboutPlanetZ + (solarSystemCenterZ - aboutPlanetZ) * subProgress;
      } else {
        const subProgress = (normalizedProgress - 1.8) / 0.4;
        const startPosX = aboutPlanetX;
        const startPosY = aboutPlanetY;
        const startPosZ = transitionZ;
        const elevationHeight = 15;

        targetPosX = startPosX + (solarSystemCenterX - startPosX) * subProgress;
        targetPosY = startPosY + ((solarSystemCenterY + elevationHeight) - startPosY) * subProgress;
        targetZ = startPosZ + (overviewZ + solarSystemCenterZ - startPosZ) * subProgress;
        targetLookAtX = solarSystemCenterX;
        targetLookAtY = solarSystemCenterY;
        targetLookAtZ = solarSystemCenterZ;
      }
    } else {
      const rotationProgress = Math.max(0, normalizedProgress - 2.2);
      const maxRotationProgress = 3.5 - 2.2;
      const rotationRatio = Math.min(1, rotationProgress / maxRotationProgress);
      const initialAngle = 90;
      const rotationAngle = initialAngle + (rotationRatio * 200);

      const angleInRadians = (rotationAngle * Math.PI) / 180;

      const allPlanets = [
        ...PROJECT_PLANETS.map(p => ({ angle: p.angle })),
        ...PLACEHOLDER_PLANETS.map(p => ({ angle: p.angle }))
      ];

      let minAngleDiff = 360;
      for (const planet of allPlanets) {
        let angleDiff = Math.abs(rotationAngle - planet.angle);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        if (angleDiff < minAngleDiff) {
          minAngleDiff = angleDiff;
        }
      }

      const zoomFactor = 1 - (minAngleDiff / 180) * 0.3;
      const dynamicDistance = overviewZ * zoomFactor;

      const elevationHeight = 15;

      targetPosX = solarSystemCenterX + Math.cos(angleInRadians) * dynamicDistance;
      targetPosY = solarSystemCenterY + elevationHeight;
      targetZ = solarSystemCenterZ + Math.sin(angleInRadians) * dynamicDistance;

      targetLookAtX = solarSystemCenterX;
      targetLookAtY = solarSystemCenterY;
      targetLookAtZ = solarSystemCenterZ;
    }

    const currentZ = camera.position.z;
    const newZ = currentZ + (targetZ - currentZ) * lerpFactor;

    const currentX = camera.position.x;
    const currentY = camera.position.y;
    const newX = currentX + (targetPosX - currentX) * lerpFactor;
    const newY = currentY + (targetPosY - currentY) * lerpFactor;

    camera.position.set(newX, newY, newZ);

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
  const [inDetailView, setInDetailView] = useState<DetailViewType>(null);
  const [showModal, setShowModal] = useState<DetailViewType>(null);
  const [activePlanetPosition, setActivePlanetPosition] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleModalClose = () => {
    setGlobalWheelDisabled(false);
    setActivePlanetPosition(null);

    const wasShowingProject = showModal?.startsWith('project-');
    const planetId = showModal?.replace('project-', '');

    setShowModal(null);
    setInDetailView(null);

    if (wasShowingProject) {
      window.dispatchEvent(new CustomEvent('projectPageClose', { detail: { planetId } }));
    } else {
      window.dispatchEvent(new CustomEvent('whitePageClose'));
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inDetailView !== null) {
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
    const handleNavigateToAbout = () => {
      window.dispatchEvent(new CustomEvent('setZoomProgress', { detail: { progress: 105 } }));
    };

    window.addEventListener('navigateToAbout', handleNavigateToAbout);
    return () => window.removeEventListener('navigateToAbout', handleNavigateToAbout);
  }, []);

  const handleAboutClick = () => {
    if (progress >= 100 && progress < 110) {
      setGlobalWheelDisabled(true);

      window.dispatchEvent(new CustomEvent('whitePageOpen'));

      setInDetailView('about');

      setTimeout(() => {
        setShowModal('about');
      }, 200);
    }
  };

  const handleProjectPlanetClick = (planetId: 'pink' | 'dark', config: ProjectPlanetConfig) => {
    if (progress >= 220) {
      setGlobalWheelDisabled(true);
      setActivePlanetPosition(config.position);

      window.dispatchEvent(new CustomEvent('projectPageOpen', {
        detail: { planetId, backgroundColor: config.modalBackgroundColor }
      }));

      setInDetailView(`project-${planetId}` as DetailViewType);
      setTimeout(() => setShowModal(`project-${planetId}` as DetailViewType), 200);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-auto"
        style={{
          zIndex: 2,
          opacity: showModal !== null ? 0 : 1,
          transform: inDetailView !== null ? 'scale(1.5)' : 'scale(1)',
          pointerEvents: showModal !== null ? 'none' : 'auto',
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
          <CameraController
            inDetailView={inDetailView}
            modalOpen={showModal !== null}
            progress={progress}
            activePlanetPosition={activePlanetPosition}
          />

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
              onClick={handleAboutClick}
              disableHover={inDetailView !== null || progress < 100 || progress >= 110}
              glowColor="#ffffff"
            />

            {PROJECT_PLANETS.map((config) => (
              <Planet3D
                key={config.id}
                position={config.position}
                scale={config.scale}
                color={config.color}
                emissive={config.emissive}
                emissiveIntensity={config.emissiveIntensity}
                name={config.name}
                roughness={0.7}
                metalness={0.1}
                onClick={() => handleProjectPlanetClick(config.id, config)}
                disableHover={inDetailView !== null || progress < 220}
                glowColor={config.glowColor}
              />
            ))}

            {PLACEHOLDER_PLANETS.map((config, index) => (
              <Planet3D
                key={`placeholder-${index}`}
                position={config.position}
                scale={config.scale}
                color={config.color}
                emissive={config.color}
                emissiveIntensity={0.2}
                name={`placeholder-${index}`}
                roughness={0.9}
                metalness={0.05}
                disableHover={false}
                glowColor={config.color}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>

    <DetailModal
      isOpen={showModal !== null}
      onClose={handleModalClose}
      backgroundColor={
        showModal === 'project-pink' ? '#DB7093' :
        showModal === 'project-dark' ? '#333333' :
        '#ffffff'
      }
      textColor={
        showModal === 'project-dark' ? '#ffffff' : '#000000'
      }
      textBlock={
        showModal === 'project-pink' ? (
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            fontWeight: 400,
            margin: 0,
          }}>
            Our projects showcase innovative blockchain software. More coming soon.
          </p>
        ) : showModal === 'project-dark' ? (
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            fontWeight: 400,
            margin: 0,
          }}>
            Our projects showcase innovative blockchain software. More coming soon.
          </p>
        ) : (
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
        )
      }
      missionText={
        showModal === 'about' ? (
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
        ) : undefined
      }
      team={showModal === 'about' ? (
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
      ) : undefined}
      techStack={showModal === 'about' ? (
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
      ) : undefined}
    >
    </DetailModal>
    </>
  );
}
