"use client";

import React, { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  Environment,
  ContactShadows,
  useAnimations,
} from "@react-three/drei";

function Model({ src }: { src: string }) {
  const gltf = useGLTF(src);
  const { actions } = useAnimations(gltf.animations, gltf.scene);
  useEffect(() => {
    const first = Object.keys(actions)[0];
    if (actions[first]) actions[first].play();
  }, [actions]);



  return (
    <primitive
      object={gltf.scene}
      scale={1.5}
      position={[0, -0.2, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

export default function With3drobot() {
  return (
    <div style={{ width: "100%", height: "450px", background: "transparent" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <Model src="./robot.glb" />

          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={6}
            blur={2.2}
            far={1.8}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          autoRotate={true}
        />
      </Canvas>
    </div>
  );
}
