import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const HERO_ORANGE = 0xff7300;
// --accent in light mode. The dark-mode orange washes out on off-white.
const HERO_ORANGE_LIGHT = 0xea580c;

export default function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const mount = mountRef.current;
    const initialWidth = mount.clientWidth || window.innerWidth;
    const initialHeight = mount.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      initialWidth / initialHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // PERFORMANCE: Cap pixel ratio to 2 to prevent lag on 4k/Retina screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // Geometry - Icosahedron Wireframe
    const geometry = new THREE.IcosahedronGeometry(1.78, 1);
    const material = new THREE.MeshStandardMaterial({
      color: HERO_ORANGE,
      emissive: HERO_ORANGE,
      emissiveIntensity: 2,
      wireframe: true,
      transparent: true,
      opacity: 0.62,
      toneMapped: false,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner Glow (Point Light)
    const light = new THREE.PointLight(HERO_ORANGE, 1.8, 100);
    light.position.set(0, 0, 0);
    scene.add(light);

    // Wireframe and inner light track the active theme. Light mode also needs
    // more opacity: pale orange on off-white barely registers.
    const applyTheme = () => {
      const lightTheme =
        document.documentElement.getAttribute("data-theme") === "light";
      const color = lightTheme ? HERO_ORANGE_LIGHT : HERO_ORANGE;
      material.color.setHex(color);
      material.emissive.setHex(color);
      material.opacity = lightTheme ? 0.85 : 0.62;
      light.color.setHex(color);
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    camera.position.z = 4.45;

    // State for interactions
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    let baseIntensity = 2;
    let targetIntensity = 2;

    // Listeners
    const onMouseMove = (event) => {
      // Normalize mouse pos relative to local container bounds.
      const rect = mount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      mouseX = THREE.MathUtils.clamp(x * 2 - 1, -1, 1);
      mouseY = THREE.MathUtils.clamp(-(y * 2 - 1), -1, 1);
    };

    const onAutomationChange = (event) => {
      const level = event.detail.level; // 0 to 100
      // Increase intensity based on level.
      // e.g., if level is 100, add 5.0 intensity. 50 add 2.5.
      const intensityBoost = (level / 100) * 5;
      targetIntensity = baseIntensity + intensityBoost;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("automation-change", onAutomationChange);

    // Animation Loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Mouse Follow "Lag" Effect using Lerp
      // We want the sphere to rotate towards the mouse position slightly
      // The 0.05 factor controls the "lag" or smoothing speed
      targetRotationX = mouseY * 0.5; // Max rotation tilt
      targetRotationY = mouseX * 0.5;

      sphere.rotation.x += (targetRotationX - sphere.rotation.x) * 0.05;
      sphere.rotation.y += (targetRotationY - sphere.rotation.y) * 0.05;

      // Constant slow rotation on top (optional, or replace with just mouse)
      // If we want it to keep spinning but ALSO tilt:
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.002;

      // Reactive Emissive Intensity
      // Lerp current intensity to target
      if (material.emissiveIntensity !== targetIntensity) {
        material.emissiveIntensity +=
          (targetIntensity - material.emissiveIntensity) * 0.05;
      }

      // Pulsating Scale
      const scale = 1.02 + Math.sin(Date.now() * 0.001) * 0.08;
      sphere.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("automation-change", onAutomationChange);
      resizeObserver.disconnect();
      themeObserver.disconnect();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
