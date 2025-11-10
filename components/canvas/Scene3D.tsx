'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { getScrollZone } from '@/utils/scrollZones';
import * as THREE from 'three';
import Planet3D from './Planet3D';
import DetailModal from '@/components/ui/DetailModal';

/**
 * Camera controller that moves based on wheel zoom and detail view
 */
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
  const currentZone = getScrollZone(progress);

  // Store current interpolated lookAt position
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Lock camera position when modal opens
  const lockedCameraPosition = useRef<THREE.Vector3 | null>(null);
  const lockedCameraLookAt = useRef<THREE.Vector3 | null>(null);
  const lockedProgress = useRef<number | null>(null);
  const wasModalOpen = useRef(false);

  // Track previous progress to avoid unnecessary updates
  const prevProgressRef = useRef(progress);

  useFrame(() => {
    // CRITICAL: If modal is open, freeze camera completely and return immediately
    // Do NOT run any calculations that could affect currentLookAtRef
    if (modalOpen) {
      // First time modal opens - lock everything
      if (!wasModalOpen.current) {
        lockedCameraPosition.current = camera.position.clone();
        lockedCameraLookAt.current = currentLookAtRef.current.clone();
        lockedProgress.current = progress;
        console.log('[CameraController] MODAL OPENED - Locked:', {
          position: lockedCameraPosition.current.toArray(),
          lookAt: lockedCameraLookAt.current.toArray(),
          progress: lockedProgress.current
        });
        wasModalOpen.current = true;
      }

      // Keep camera frozen at locked position
      if (lockedCameraPosition.current && lockedCameraLookAt.current) {
        camera.position.copy(lockedCameraPosition.current);
        camera.lookAt(lockedCameraLookAt.current);
      }
      return; // EXIT IMMEDIATELY - do not run any other code
    }

    // Modal just closed - restore the locked state ONCE
    if (!modalOpen && wasModalOpen.current) {
      console.log('[CameraController] MODAL CLOSED - Restoring:', {
        lockedPosition: lockedCameraPosition.current?.toArray(),
        lockedLookAt: lockedCameraLookAt.current?.toArray(),
        lockedProgress: lockedProgress.current,
        currentProgress: progress
      });

      wasModalOpen.current = false;

      // CRITICAL: Restore currentLookAtRef to the locked value
      // This ensures the camera resumes from the correct position
      if (lockedCameraLookAt.current) {
        currentLookAtRef.current.copy(lockedCameraLookAt.current);
      }

      // Also restore camera position to locked position to prevent jumps
      if (lockedCameraPosition.current) {
        camera.position.copy(lockedCameraPosition.current);
      }

      // Clear locked values - we've restored them, now let animation continue normally
      lockedCameraPosition.current = null;
      lockedCameraLookAt.current = null;
      lockedProgress.current = null;
    }

    // Update prevProgress for next frame
    const progressChanged = Math.abs(prevProgressRef.current - progress) > 0.01;
    if (progressChanged) {
      console.log('[CameraController] Progress changed:', prevProgressRef.current, '->', progress);
    }
    prevProgressRef.current = progress;

    // Planet is at origin [0, 0, 0]
    const normalizedProgress = progress / 100;

    // Camera moves forward in Z only
    const startZ = 50;
    const endZ = 8; // Closer to planet for bigger zoom
    const detailZ = 4.2; // Much closer for detail view

    // Target Z position based on mode
    let targetZ = startZ - (startZ - endZ) * normalizedProgress;
    if (inDetailView) {
      targetZ = detailZ;
    }

    // Smooth lerp to target position with higher factor for smoother feel
    const currentZ = camera.position.z;
    const lerpFactor = inDetailView ? 0.08 : 0.15;
    const newZ = currentZ + (targetZ - currentZ) * lerpFactor;

    // Apply easeOutCubic to the lookAt interpolation for smoother camera angle transition
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(normalizedProgress);

    // Camera position interpolation
    // Start offset: position planet more up and to the left on initial page
    // During zoom: smoothly transition to centered view

    // Calculate offset based on zoom progress
    // At 0% progress: full offset
    // At 20% progress: no offset (centered)
    const offsetProgress = Math.max(0, 1 - (normalizedProgress / 0.2));

    // Camera positioning strategy:
    // - Camera starts offset (opposite of planet position)
    // - Looks at origin [0,0,0] initially for offset view
    // - As zoom progresses, camera tilts to look at planet center
    // - Camera also moves closer to planet position

    // Planet is at [-15, 15, 0]
    const planetX = -15;
    const planetY = 15;
    const planetZ = 0;

    // Calculate target camera position based on zoom progress
    const startCameraX = 15;   // Opposite of planet X
    const startCameraY = -15;  // Opposite of planet Y
    const endCameraX = -15;    // Move to planet X during zoom
    const endCameraY = 15;     // Move to planet Y during zoom

    const targetPosX = inDetailView
      ? planetX  // In detail view, camera at planet position
      : startCameraX + (endCameraX - startCameraX) * normalizedProgress;

    const targetPosY = inDetailView
      ? planetY  // In detail view, camera at planet position
      : startCameraY + (endCameraY - startCameraY) * normalizedProgress;

    // Smooth lerp for camera position (X and Y)
    const currentX = camera.position.x;
    const currentY = camera.position.y;
    const newX = currentX + (targetPosX - currentX) * lerpFactor;
    const newY = currentY + (targetPosY - currentY) * lerpFactor;

    camera.position.set(newX, newY, newZ);

    // Calculate target lookAt position
    // At 0% progress: look at origin [0,0,0] for offset view
    // At 100% progress: look at planet center [-15, 15, 0]
    const targetLookAtX = inDetailView ? planetX : planetX * normalizedProgress;
    const targetLookAtY = inDetailView ? planetY : planetY * normalizedProgress;
    const targetLookAtZ = planetZ;

    // Smooth lerp for lookAt target to avoid sudden camera rotations
    const currentLookAt = currentLookAtRef.current;
    currentLookAt.x += (targetLookAtX - currentLookAt.x) * lerpFactor;
    currentLookAt.y += (targetLookAtY - currentLookAt.y) * lerpFactor;
    currentLookAt.z += (targetLookAtZ - currentLookAt.z) * lerpFactor;

    camera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z);
  });

  return null;
}

/**
 * Main 3D scene component using React Three Fiber
 * Handles camera, lighting, and all 3D planet elements
 * Wheel scrolling zooms the camera instead of scrolling the page
 */
interface Scene3DProps {
  progress: number;
}

export default function Scene3D({ progress }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [inDetailView, setInDetailView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Centralized modal close handler
  const handleModalClose = () => {
    // First close modal
    setShowModal(false);

    // Set inDetailView to false immediately
    setInDetailView(false);

    // Notify page that white page is closing (clears global wheel lock)
    window.dispatchEvent(new CustomEvent('whitePageClose'));
  };

  // CRITICAL: Block wheel events from affecting zoom during detail view
  // But ALLOW modal scrolling by checking event target
  useEffect(() => {
    if (!inDetailView) return;

    const blockWheelZoom = (e: WheelEvent) => {
      // Check if event is from modal - if so, let it pass
      const target = e.target as HTMLElement;
      const isFromModal = target?.closest('[data-modal-container]');

      if (isFromModal) {
        // Let modal scroll normally
        return;
      }

      // Not from modal - block it to prevent zoom changes
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    // Register with highest priority (capture phase) to run before useWheelZoom
    window.addEventListener('wheel', blockWheelZoom, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', blockWheelZoom, { capture: true } as any);
    };
  }, [inDetailView]);

  // Handle ESC key to exit detail view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inDetailView) {
        // Use centralized close handler
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inDetailView]);

  // Dispatch event to notify header/footer of detail view state
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('detailViewChange', { detail: { inDetailView } }));
  }, [inDetailView]);

  // Listen for exit detail view event from back button
  useEffect(() => {
    const handleExitDetailView = () => {
      handleModalClose();
    };

    window.addEventListener('exitDetailView' as any, handleExitDetailView);
    return () => window.removeEventListener('exitDetailView' as any, handleExitDetailView);
  }, [showModal]); // Add dependency to ensure latest handleModalClose

  // Listen for zoom to planet and open event from footer
  useEffect(() => {
    const handleZoomToPlanetAndOpen = () => {
      // Check if already at sufficient zoom level
      if (progress >= 95) {
        // Already zoomed in, just open modal
        handlePlanetClick();
      } else {
        // Need to zoom first, then open
        // Dispatch event to set progress to 100%
        window.dispatchEvent(new CustomEvent('setZoomProgress', { detail: { progress: 100 } }));
        // Wait for zoom animation, then open modal
        setTimeout(() => {
          handlePlanetClick();
        }, 1000);
      }
    };

    window.addEventListener('zoomToPlanetAndOpen' as any, handleZoomToPlanetAndOpen);
    return () => window.removeEventListener('zoomToPlanetAndOpen' as any, handleZoomToPlanetAndOpen);
  }, [progress]);

  const handlePlanetClick = () => {
    // Only allow clicking when fully zoomed in (progress >= 95%)
    if (progress >= 95) {
      // CRITICAL: Notify page IMMEDIATELY that white page is opening
      // This must happen BEFORE any state updates to prevent wheel event leaks
      window.dispatchEvent(new CustomEvent('whitePageOpen'));

      setIsZooming(true);
      setInDetailView(true);

      // Wait for 3D zoom animation to complete, then show modal
      setTimeout(() => {
        setShowModal(true);
        setIsZooming(false);
      }, 200); // Match 3D scene scale transition duration
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* 3D Scene - zooms in when detail view active */}
      <div
        className="fixed inset-0 pointer-events-auto"
        style={{
          zIndex: 2,
          opacity: showModal ? 0 : 1,
          transform: inDetailView ? 'scale(1.5)' : 'scale(1)',
          pointerEvents: showModal ? 'none' : 'auto',
          transition: 'opacity 0.35s ease-in-out, transform 0.35s ease-in-out',
          transformOrigin: 'center center',
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
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <Suspense fallback={null}>
          {/* Camera controller for wheel zoom */}
          <CameraController inDetailView={inDetailView} modalOpen={showModal} progress={progress} />

          {/* Ambient light for overall illumination */}
          <ambientLight intensity={0.3} />

          {/* Main directional light (sun-like) */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />

          {/* Fill light from opposite side */}
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.3}
          />

          {/* Point light for planet highlights */}
          <pointLight
            position={[0, 5, 10]}
            intensity={0.5}
            color="#ffffff"
          />

          {/* Test Planet - White Planet (davlo.io) */}
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
          />
        </Suspense>
      </Canvas>
    </div>

    {/* Detail Modal */}
    <DetailModal isOpen={showModal} onClose={handleModalClose}>
      <div className="space-y-8">
        <section>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>
            Who We Are
          </h2>
          <p style={{ marginBottom: '20px' }}>
            davlo.io is a team building next-generation blockchain explorers and software for blockchains.
            We believe in creating tools that make the decentralized web accessible, transparent, and easy to understand.
          </p>
          <p>
            Our flagship product, Taiko Explorer, provides comprehensive insights into blockchain data with
            an intuitive interface designed for both developers and everyday users.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>
            Our Mission
          </h2>
          <p>
            We're on a mission to build software for the universe - tools that empower developers and users
            to navigate the blockchain ecosystem with confidence and clarity.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>
            What We Do
          </h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '24px', lineHeight: '2' }}>
            <li>Build high-performance blockchain explorers</li>
            <li>Develop tools for blockchain data analysis</li>
            <li>Create intuitive interfaces for complex blockchain interactions</li>
            <li>Provide infrastructure for decentralized applications</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>
            Get In Touch
          </h2>
          <p>
            Want to learn more or work with us? Reach out at{' '}
            <a
              href="mailto:hello@davlo.io"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              hello@davlo.io
            </a>
          </p>
        </section>
      </div>
    </DetailModal>
    </>
  );
}
