import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  AmbientLight,
  CircleGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import type { BufferGeometry, Material, Texture } from 'three';
import { previewScreens } from '../../data/previewScreens';

type Props = {
  screen: number;
  onNavigate: (index: number) => void;
  onReady: (ready: boolean) => void;
};
type Controls = {
  setScreen: (index: number) => void;
};

function roundedRect(width: number, height: number, radius: number) {
  const x = -width / 2,
    y = -height / 2;
  const shape = new Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function screenGeometry(width: number, height: number, radius: number) {
  const geometry = new ShapeGeometry(roundedRect(width, height, radius), 16);
  const positions = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < positions.count; i++)
    uv.setXY(i, (positions.getX(i) + width / 2) / width, (positions.getY(i) + height / 2) / height);
  return geometry;
}

export default function PhoneScene({ screen, onNavigate, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 0, 9.5);
    scene.add(new AmbientLight('#ffffff', 2));
    const light = new DirectionalLight('#ffffff', 3);
    light.position.set(-4, 5, 7);
    scene.add(light);
    const fill = new DirectionalLight('#d7dfc8', 1.5);
    fill.position.set(4, 0, -3);
    scene.add(fill);
    const phone = new Group();
    scene.add(phone);
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    const textures: Texture[] = [];
    const add = (
      geometry: BufferGeometry,
      material: Material,
      x = 0,
      y = 0,
      z = 0,
      back = false
    ) => {
      geometries.push(geometry);
      materials.push(material);
      const mesh = new Mesh(geometry, material);
      mesh.position.set(x, y, z);
      if (back) mesh.rotation.y = Math.PI;
      phone.add(mesh);
      return mesh;
    };
    const body = new ExtrudeGeometry(roundedRect(2.12, 4.6, 0.23), {
      depth: 0.16,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 3,
      curveSegments: 16,
    });
    body.translate(0, 0, -0.08);
    add(body, new MeshStandardMaterial({ color: '#20261b', metalness: 0.55, roughness: 0.37 }));
    add(
      screenGeometry(2.08, 4.56, 0.21),
      new MeshStandardMaterial({ color: '#303e22', roughness: 0.65 }),
      0,
      0,
      -0.12,
      true
    );
    const screenMaterial = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    const display = add(screenGeometry(1.99, 4.422, 0.17), screenMaterial, 0, 0, 0.117);
    const transitionMaterial = new MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    });
    add(screenGeometry(1.99, 4.422, 0.17), transitionMaterial, 0, 0, 0.118);
    add(new CircleGeometry(0.033, 16), new MeshBasicMaterial({ color: '#151b13' }), 0, 2.12, 0.12);
    add(
      new ExtrudeGeometry(roundedRect(0.055, 0.38, 0.023), { depth: 0.06, bevelEnabled: false }),
      new MeshStandardMaterial({ color: '#48523f', metalness: 0.6, roughness: 0.4 }),
      1.09,
      0.75,
      -0.03
    );
    add(
      new ExtrudeGeometry(roundedRect(0.055, 0.58, 0.023), { depth: 0.06, bevelEnabled: false }),
      new MeshStandardMaterial({ color: '#48523f', metalness: 0.6, roughness: 0.4 }),
      -1.09,
      0.75,
      -0.03
    );
    add(
      screenGeometry(0.48, 0.72, 0.12),
      new MeshStandardMaterial({ color: '#1d2814' }),
      -0.64,
      1.7,
      -0.135,
      true
    );
    for (const y of [1.54, 1.84]) {
      add(
        new CircleGeometry(0.108, 20),
        new MeshStandardMaterial({ color: '#0f151b', metalness: 0.8, roughness: 0.17 }),
        -0.64,
        y,
        -0.14,
        true
      );
      add(
        new CircleGeometry(0.052, 16),
        new MeshStandardMaterial({ color: '#203041', metalness: 0.9, roughness: 0.08 }),
        -0.64,
        y,
        -0.143,
        true
      );
    }
    let disposed = false,
      visible = false,
      frame = 0,
      screenIndex = 0,
      baseYaw = -0.2,
      basePitch = 0.035,
      hoverX = 0,
      hoverY = 0;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const render = () => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const targetX = basePitch + hoverY,
        targetY = baseYaw + hoverX;
      const amount = motion.matches ? 1 : 0.17;
      phone.rotation.x += (targetX - phone.rotation.x) * amount;
      phone.rotation.y += (targetY - phone.rotation.y) * amount;
      phone.rotation.z += (-0.035 - phone.rotation.z) * amount;
      renderer.render(scene, camera);
      if (Math.abs(targetX - phone.rotation.x) + Math.abs(targetY - phone.rotation.y) > 0.001)
        invalidate();
    };
    function invalidate() {
      if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }
    const maps = new Map<number, Texture>();
    const loader = new TextureLoader();
    const showScreen = (texture: Texture) => {
      gsap.killTweensOf(transitionMaterial);
      transitionMaterial.map = screenMaterial.map;
      transitionMaterial.opacity = screenMaterial.map && !motion.matches ? 1 : 0;
      transitionMaterial.needsUpdate = true;
      screenMaterial.map = texture;
      screenMaterial.needsUpdate = true;
      onReady(true);
      invalidate();
      if (transitionMaterial.opacity) {
        gsap.to(transitionMaterial, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: invalidate,
          onComplete: () => {
            transitionMaterial.map = null;
          },
        });
      }
    };
    const setScreen = (index: number) => {
      if (index < 0 || index >= previewScreens.length) return;
      screenIndex = index;
      if (maps.has(index)) {
        showScreen(maps.get(index)!);
        return;
      }
      const texture = loader.load(
        `${import.meta.env.BASE_URL}app/${previewScreens[index].image}`,
        (loaded) => {
          if (disposed) {
            loaded.dispose();
            return;
          }
          loaded.colorSpace = SRGBColorSpace;
          loaded.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          maps.set(index, loaded);
          if (index === screenIndex) {
            showScreen(loaded);
          }
        },
        undefined,
        () => {
          if (!disposed && index === screenIndex) onReady(false);
        }
      );
      textures.push(texture);
    };
    const icon = loader.load(`${import.meta.env.BASE_URL}brand/app-icon-128.png`, (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = SRGBColorSpace;
      invalidate();
    });
    textures.push(icon);
    add(
      screenGeometry(0.7, 0.7, 0.06),
      new MeshBasicMaterial({ map: icon, toneMapped: false }),
      0,
      0,
      -0.13,
      true
    );
    controls.current = {
      setScreen,
    };
    const resize = new ResizeObserver(() => {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer.setSize(box.width, box.height);
      camera.aspect = box.width / box.height;
      camera.position.z = Math.max(8.8, 1.25 / (Math.tan((16 * Math.PI) / 180) * camera.aspect));
      camera.updateProjectionMatrix();
      invalidate();
    });
    resize.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) invalidate();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersection.observe(element);
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    let gesture: {
      id: number;
      x: number;
      y: number;
      yaw: number;
      pitch: number;
      dragging: boolean;
      vertical: boolean;
    } | null = null;
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      gesture = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: baseYaw,
        pitch: basePitch,
        dragging: false,
        vertical: false,
      };
    };
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      if (gesture && gesture.id === event.pointerId) {
        const dx = event.clientX - gesture.x,
          dy = event.clientY - gesture.y;
        if (!gesture.dragging && !gesture.vertical && Math.max(Math.abs(dx), Math.abs(dy)) > 7) {
          if (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) gesture.vertical = true;
          else {
            gesture.dragging = true;
            renderer.domElement.setPointerCapture(event.pointerId);
            renderer.domElement.classList.add('dragging');
          }
        }
        if (gesture.dragging) {
          baseYaw = gesture.yaw + dx * 0.009;
          basePitch = Math.max(-0.45, Math.min(0.45, gesture.pitch + dy * 0.003));
          hoverX = 0;
          hoverY = 0;
          invalidate();
        }
      } else if (event.pointerType === 'mouse' && !motion.matches) {
        hoverX = ((event.clientX - box.left) / box.width - 0.5) * 0.13;
        hoverY = ((event.clientY - box.top) / box.height - 0.5) * 0.07;
        invalidate();
      }
    };
    const up = (event: PointerEvent) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      if (!gesture.dragging && !gesture.vertical) {
        const box = element.getBoundingClientRect();
        pointer.set(
          ((event.clientX - box.left) / box.width) * 2 - 1,
          (-(event.clientY - box.top) / box.height) * 2 + 1
        );
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObject(display, false)[0];
        if (hit?.uv) {
          const { x, y } = hit.uv;
          if (screenIndex === 0) onNavigate(1);
          else if (y > 0.02 && y < 0.115)
            onNavigate(x < 0.22 ? 1 : x < 0.43 ? 2 : x < 0.64 ? 3 : x < 0.83 ? 4 : 3);
          else if (screenIndex === 3 && x < 0.18 && y > 0.84) onNavigate(2);
          else
            onNavigate(screenIndex === 2 ? 3 : screenIndex === 3 ? 2 : screenIndex === 4 ? 3 : 2);
        }
      }
      if (renderer.domElement.hasPointerCapture(event.pointerId))
        renderer.domElement.releasePointerCapture(event.pointerId);
      gesture = null;
      renderer.domElement.classList.remove('dragging');
    };
    const cancel = () => {
      gesture = null;
      renderer.domElement.classList.remove('dragging');
    };
    const leave = () => {
      if (gesture?.dragging) return;
      gesture = null;
      hoverX = 0;
      hoverY = 0;
      invalidate();
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      invalidate();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      onReady(false);
    };
    const restored = () => {
      onReady(true);
      invalidate();
    };
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', cancel);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', invalidate);
    return () => {
      disposed = true;
      controls.current = null;
      gsap.killTweensOf(transitionMaterial);
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', cancel);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', invalidate);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [onNavigate, onReady]);
  useEffect(() => controls.current?.setScreen(screen), [screen]);
  return <div ref={host} className="phone-canvas" />;
}
