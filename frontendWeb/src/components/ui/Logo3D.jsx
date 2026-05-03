import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Center } from '@react-three/drei';

export default function Logo3D({ scale = 1, autoRotateSpeed = 1, ...props }) {
  // Load the compressed 3D model
  const { scene } = useGLTF('/compressed.glb');
  const groupRef = useRef();

  // Add continuous subtle rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5 * autoRotateSpeed;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <Float
        speed={2} // Animation speed
        rotationIntensity={0.2} // XYZ rotation intensity
        floatIntensity={0.5} // Up/down float intensity
      >
        <Center>
          <primitive object={scene} scale={scale} />
        </Center>
      </Float>
    </group>
  );
}

// Preload the model so it's ready quickly
useGLTF.preload('/compressed.glb');
