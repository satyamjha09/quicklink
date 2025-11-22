import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Grid, Environment, ContactShadows } from '@react-three/drei';
import { ViewerSettings } from '../types';
import * as THREE from 'three';

interface SceneProps {
  modelUrl: string | null;
  settings: ViewerSettings;
}

// Component to handle the actual model loading and display
const Model = ({ url, wireframe }: { url: string, wireframe: boolean }) => {
  const { scene } = useGLTF(url);
  
  // Apply wireframe effect if toggled
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
            // Clone material to avoid affecting other instances or cache if needed
            // For simple viewer, direct modification is often okay, but cloning is safer
             child.material.wireframe = wireframe;
        }
      }
    });
  }, [scene, wireframe]);

  return <primitive object={scene} />;
};

// Component to update scene background dynamically
const BackgroundUpdater = ({ color }: { color: string }) => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(color);
  }, [color, scene]);
  return null;
};

export const Scene: React.FC<SceneProps> = ({ modelUrl, settings }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]} // Optimise for high DPI screens
      gl={{ preserveDrawingBuffer: true }} // Needed for any potential screenshot features
    >
      <BackgroundUpdater color={settings.backgroundColor} />
      
      {settings.gridHelper && (
        <Grid 
            args={[10, 10]} 
            cellColor="#6f6f6f" 
            sectionColor="#9d4b4b" 
            fadeDistance={20} 
            fadeStrength={1}
            infiniteGrid
        />
      )}

      <Suspense fallback={null}>
        {modelUrl && (
          <Stage environment="city" intensity={0.6} adjustCamera>
             <Model url={modelUrl} wireframe={settings.wireframe} />
          </Stage>
        )}
        {/* Fallback placeholder if no model is loaded, handled by overlay in App.tsx, 
            but we can add a simple object here for testing */}
        {!modelUrl && (
            <mesh rotation={[0, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" wireframe={settings.wireframe} />
            </mesh>
        )}
      </Suspense>

      <OrbitControls 
        autoRotate={settings.autoRotate} 
        makeDefault 
      />
      
      {/* Basic environmental lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    </Canvas>
  );
};
