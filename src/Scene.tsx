'use client';
import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { useLocale } from './i18n';
type Props = {
    progress: MotionValue<number>;
    reduced: boolean;
    quiet: boolean;
    coverImage: HTMLImageElement;
    onReady: (ready: boolean) => void;
};
// Existing artwork becomes a small paper diorama. Camera changes position and
// target in 3D; foreground objects retain independent depth and parallax.
export default function Scene({ progress, reduced, quiet, coverImage, onReady }: Props) {
    const { t } = useLocale();
    const container = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => { onReady(ready); }, [ready, onReady]);
    useEffect(() => {
        const host = container.current;
        if (!host || reduced || quiet) {
            setReady(false);
            return;
        }
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        }
        catch {
            setReady(false);
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];
        const textures: THREE.Texture[] = [];
        const loader = new THREE.TextureLoader();
        let disposed = false, visible = true, frame = 0, count = 0, baseDistance = 10;
        const target = { x: 0, y: 0, scroll: progress.get() };
        const current = { x: 0, y: 0, scroll: progress.get() };
        let needsFrames = 180;
        function wake() {
            needsFrames = 90;
            if (!frame && visible && !document.hidden && !disposed)
                frame = requestAnimationFrame(tick);
        }
        function plane(source: string | HTMLImageElement, width: number, x: number, y: number, z: number, rotation = 0) {
            const loaded = () => {
                if (!disposed) {
                    count++;
                    if (count === 2)
                        setReady(true);
                    wake();
                }
            };
            let texture: THREE.Texture;
            if (typeof source === 'string') texture = loader.load(source, loaded);
            else {
                // srcset images report a density-corrected naturalWidth. WebGL
                // allocates with that width but uploads physical pixels, which
                // can overflow. Freeze the decoded image at its selected pixel
                // resolution without another fetch or a change to the artwork.
                const pixels = Number(/cover-(\d+)\.webp(?:\?|$)/.exec(source.currentSrc)?.[1] || 1400);
                const surface = document.createElement('canvas');
                surface.width = pixels;
                surface.height = Math.round(pixels * 2 / 3);
                surface.getContext('2d')!.drawImage(source, 0, 0, surface.width, surface.height);
                texture = new THREE.CanvasTexture(surface);
                loaded();
            }
            texture.colorSpace = THREE.SRGBColorSpace;
            textures.push(texture);
            const geometry = new THREE.PlaneGeometry(width, width * 2 / 3);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide });
            geometries.push(geometry);
            materials.push(material);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.rotation.z = rotation;
            scene.add(mesh);
            return mesh;
        }
        plane(coverImage, 8.3, 0, -.1, 0);
        const left = plane('/optimized/v2.3/05-360.webp', 1.2, -3.2, -2.05, .5, .13);
        const ringGeo = new THREE.TorusGeometry(3.9, .008, 6, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: '#bbc7aa', transparent: true, opacity: .7 });
        geometries.push(ringGeo);
        materials.push(ringMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(.9, .2, -.35);
        ring.position.set(0, -.1, -.8);
        scene.add(ring);
        function resize() {
            if (disposed)
                return;
            const width = host!.clientWidth, height = host!.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            baseDistance = Math.max(9.6, 4.55 / (Math.tan(Math.PI / 10) * camera.aspect));
            wake();
        }
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        const intersection = new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            if (visible)
                wake();
            else {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        });
        intersection.observe(host);
        const unscroll = progress.on('change', value => { target.scroll = value; wake(); });
        const move = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse')
                return;
            const box = host.getBoundingClientRect();
            target.x = (event.clientX - box.left) / box.width * 2 - 1;
            target.y = (event.clientY - box.top) / box.height * 2 - 1;
            wake();
        };
        const reset = () => { target.x = 0; target.y = 0; wake(); };
        const visibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
            else
                wake();
        };
        function tick() {
            frame = 0;
            if (disposed || !visible || document.hidden)
                return;
            current.x += (target.x - current.x) * .075;
            current.y += (target.y - current.y) * .075;
            current.scroll += (target.scroll - current.scroll) * .09;
            const radius = baseDistance * (1 - current.scroll * .25);
            const azimuth = current.x * .09;
            const elevation = current.y * .045;
            camera.position.set(Math.sin(azimuth) * radius, Math.sin(elevation) * radius + .16 * current.scroll, Math.cos(azimuth) * Math.cos(elevation) * radius);
            camera.lookAt(0, -current.scroll * .34, 0);
            left.position.x = -3.2 - current.scroll * .35;
            renderer.render(scene, camera);
            // Readable diagnostics for acceptance tests, no animation state in React.
            host!.dataset.camera = `${camera.position.x.toFixed(3)},${camera.position.y.toFixed(3)},${camera.position.z.toFixed(3)}`;
            host!.dataset.push = current.scroll.toFixed(3);
            if (--needsFrames > 0)
                frame = requestAnimationFrame(tick);
        }
        host.addEventListener('pointermove', move);
        host.addEventListener('pointerleave', reset);
        document.addEventListener('visibilitychange', visibility);
        const lost = (event: Event) => { event.preventDefault(); setReady(false); };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        resize();
        wake();
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            unscroll();
            observer.disconnect();
            intersection.disconnect();
            host.removeEventListener('pointermove', move);
            host.removeEventListener('pointerleave', reset);
            document.removeEventListener('visibilitychange', visibility);
            renderer.domElement.removeEventListener('webglcontextlost', lost);
            geometries.forEach(g => g.dispose());
            materials.forEach(m => m.dispose());
            textures.forEach(t => t.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [progress, reduced, quiet, coverImage]);
    return <div className={`scene ${ready ? 'scene-ready' : ''}`} ref={container} role="img" aria-label={t("花草环绕的烦恼维修小屋，两位年轻人坐在门口，桌上放着一台电话。移动鼠标可以换一个角度看。")}>
  </div>;
}
