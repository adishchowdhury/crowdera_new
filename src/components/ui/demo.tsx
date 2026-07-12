"use client";

import type { CSSProperties } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SANS = "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif";
const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const INK = "#1a1a22";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const PHRASES = ["HOPE", "IMPACT", "CARE", "CHANGE", "VISION"];
const LOOP = 20;
const RING_N = PHRASES.length;
const RING_STEP = 360 / RING_N;
const RING_R = 660;
const PERSP = 2200;

const MANIFESTO =
  "WE EMPOWER COMMUNITIES AND CREATE LASTING CHANGE FOR A BETTER TOMORROW.";

const TICK_LABELS = ["NON", "PROFIT", "CHARITY", "IMPACT"];

function useTime() {
  const t = useRef({ value: 0 });
  useFrame((s) => (t.current.value = s.clock.elapsedTime));
  return t.current;
}

const BELL_VERT = /* glsl */ `
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
  void main(){
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const BELL_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
  }

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float fres = pow(1.0 - max(dot(N,V),0.0), 2.4);

    float h = clamp((vPos.y + 0.40)/1.40, 0.0, 1.0);
    float ang = atan(vPos.z, vPos.x);

    vec3 top  = vec3(0.16, 0.56, 0.40); // Greens for non-profit
    vec3 mid  = vec3(0.25, 0.72, 0.58);
    vec3 edge = vec3(0.14, 0.60, 0.83);
    vec3 col = mix(edge, mid, smoothstep(0.0,0.5,h));
    col = mix(col, top, smoothstep(0.45,1.0,h));

    float ribs = abs(fract(ang/(2.0*3.14159265)*18.0) - 0.5) * 2.0;
    float ribLine = smoothstep(0.80, 0.99, ribs);
    float ribMask = smoothstep(0.98,0.55,h) * smoothstep(-0.02,0.22,h);
    col *= 1.0 - ribLine * 0.55 * ribMask;

    float backw = gl_FrontFacing ? 1.0 : 0.0;

    float band = smoothstep(0.34, 0.02, h);
    float spots = noise(vec2(ang*7.0, h*12.0));
    float wart = smoothstep(0.58, 0.86, spots) * band;
    col = mix(col, vec3(0.10,0.30,0.18), wart*0.85*backw);

    col += fres * vec3(0.26, 0.48, 0.28);
    col += (1.0 - fres) * vec3(0.10,0.25,0.15) * (0.5 + 0.5*h);

    float alpha = 0.50 + fres*0.45 + ribLine*ribMask*0.22 + wart*0.35*backw;
    alpha *= mix(0.30, 1.0, backw);
    alpha = clamp(alpha, 0.0, 0.96);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Bell({ time }: { time: { value: number } }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BELL_VERT,
        fragmentShader: BELL_FRAG,
        uniforms: { uTime: time },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [time]
  );
  return (
    <mesh material={mat} scale={[1, 0.84, 1]}>
      <sphereGeometry args={[1, 160, 160, 0, Math.PI * 2, 0, 1.98]} />
    </mesh>
  );
}

function Glow() {
  return (
    <mesh position={[0, 0.18, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color={"#6fffcb"}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

const STRAND_VERT = /* glsl */ `
  uniform float uTime; uniform float uLen; uniform float uPhase; uniform float uAmp; uniform float uFreq;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    vec3 p = position;
    float k = clamp(-p.y / uLen, 0.0, 1.0);
    float amp = k*k*uAmp;
    p.x += sin(uTime*1.5 + k*uFreq + uPhase) * amp;
    p.z += cos(uTime*1.2 + k*uFreq*0.9 + uPhase*1.3) * amp;
    vK = k;
    vWorldY = (modelMatrix * vec4(p,1.0)).y;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const STRAND_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uTop; uniform vec3 uTip; uniform float uOpacity; uniform vec2 uFade; uniform vec2 uFadeTop;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)),0.0), 1.6);
    float vis = smoothstep(uFade.x, uFade.y, vWorldY)
              * smoothstep(uFadeTop.y, uFadeTop.x, vWorldY);
    vec3 col = mix(uTop, uTip, vK) + fres*0.25;
    float alpha = ((1.0 - vK*0.92) * uOpacity + fres*0.12) * vis;
    gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));
  }
`;

function strandGeometry(length: number, thickness: number, curl: number) {
  const seg = 40;
  const radial = 6;
  const spine: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    spine.push(new THREE.Vector3(Math.sin(t * 3) * curl * t, -t * length, Math.cos(t * 2) * curl * t));
  }
  const curve = new THREE.CatmullRomCurve3(spine);
  const frames = curve.computeFrenetFrames(seg, false);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = curve.getPointAt(t);
    const r = thickness * (1 - Math.pow(t, 0.75));
    const Nf = frames.normals[i];
    const Bf = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pos.push(
        p.x + (c * Nf.x + s * Bf.x) * r,
        p.y + (c * Nf.y + s * Bf.y) * r,
        p.z + (c * Nf.z + s * Bf.z) * r
      );
    }
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Strand({
  time,
  angle,
  radius,
  yOffset,
  length,
  thickness,
  curl,
  amp,
  freq,
  phase,
  top,
  tip,
  opacity,
}: {
  time: { value: number };
  angle: number;
  radius: number;
  yOffset: number;
  length: number;
  thickness: number;
  curl: number;
  amp: number;
  freq: number;
  phase: number;
  top: string;
  tip: string;
  opacity: number;
}) {
  const geometry = useMemo(() => strandGeometry(length, thickness, curl), [length, thickness, curl]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STRAND_VERT,
        fragmentShader: STRAND_FRAG,
        uniforms: {
          uTime: time,
          uLen: { value: length },
          uPhase: { value: phase },
          uAmp: { value: amp },
          uFreq: { value: freq },
          uTop: { value: new THREE.Color(top) },
          uTip: { value: new THREE.Color(tip) },
          uOpacity: { value: opacity },
          uFade: { value: new THREE.Vector2(-1.85, -0.7) },
          uFadeTop: { value: new THREE.Vector2(-0.62, -0.22) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [time, length, phase, amp, freq, top, tip, opacity]
  );
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return <mesh geometry={geometry} material={mat} position={[x, yOffset, z]} />;
}

function Jelly({ loop }: { loop: number }) {
  const time = useTime();
  const grp = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    grp.current.rotation.y = -(t / loop) * Math.PI * 2;
    grp.current.position.y = Math.sin(t * 0.6) * 0.08;
    const k = Math.sin(t * 1.7);
    grp.current.scale.set(1 + k * 0.05, 1 - k * 0.06, 1 + k * 0.05);
  });

  const tentacles = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({ angle: (i / 28) * Math.PI * 2, phase: i * 0.5 })),
    []
  );
  const arms = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({ angle: (i / 8) * Math.PI * 2, phase: i * 1.0 + 0.4 })),
    []
  );

  return (
    <group ref={grp}>
      <Bell time={time} />
      <Glow />
      {tentacles.map((s, i) => (
        <Strand
          key={`t${i}`}
          time={time}
          angle={s.angle}
          radius={0.82}
          yOffset={-0.25}
          length={4.2}
          thickness={0.016}
          curl={0.05}
          amp={0.5}
          freq={7.0}
          phase={s.phase}
          top={"#b6e9c6"}
          tip={"#d9f3e4"}
          opacity={0.55}
        />
      ))}
      {arms.map((s, i) => (
        <Strand
          key={`a${i}`}
          time={time}
          angle={s.angle}
          radius={0.22}
          yOffset={-0.1}
          length={2.0}
          thickness={0.07}
          curl={0.14}
          amp={0.32}
          freq={10.0}
          phase={s.phase}
          top={"#d6f7e3"}
          tip={"#9fe7b9"}
          opacity={0.72}
        />
      ))}
    </group>
  );
}

export function Jellyfish3D({ loop = 20 }: { loop?: number }) {
  return (
    <Canvas
      flat
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6], fov: 34 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={1} />
      <Jelly loop={loop} />
    </Canvas>
  );
}

function SideRuler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        [side]: "1.4vh",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.1vh",
        height: "56vh",
        justifyContent: "center",
        pointerEvents: "none",
      } as CSSProperties}
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i % 4 === 0 ? "1.4vh" : "0.7vh",
            height: 1,
            background: "rgba(30,30,40,0.45)",
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          [side]: "-2.4vh",
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : "none",
          fontFamily: SANS,
          fontSize: "0.95vh",
          fontWeight: 600,
          letterSpacing: "0.35em",
          color: "rgba(30,30,40,0.5)",
          textTransform: "uppercase",
        } as CSSProperties}
      >
        {TICK_LABELS.join(" · ")}
      </span>
    </div>
  );
}

export default function JellyfishDrift() {
  return (
    <section
      className="jelly-loop"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(125% 120% at 50% 28%, #f1f7f4 0%, #e6f0e9 46%, #d9eadf 74%, #cde2d4 100%)",
        fontFamily: SANS,
      }}
    >
      <style>{JELLY_CSS}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          perspective: `${PERSP}px`,
          perspectiveOrigin: "50% 46%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          className="jelly-stage"
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            animation: `jelly-orbit ${LOOP}s linear infinite`,
            willChange: "transform",
          }}
        >
          {PHRASES.map((p, i) => (
            <span
              key={p}
              className="jelly-phrase"
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: "28vh",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                whiteSpace: "nowrap",
                color: INK,
                opacity: 0,
                transform: `rotateY(${(i * RING_STEP).toFixed(2)}deg) translateZ(${RING_R}px) rotateY(180deg)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                animation: `jelly-fade ${LOOP}s linear ${(
                  (-LOOP * ((RING_N - i) % RING_N)) / RING_N -
                  LOOP / 2
                ).toFixed(3)}s infinite`,
                willChange: "opacity",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: `jelly-rise ${LOOP}s linear ${(
                    (-LOOP * ((RING_N - i) % RING_N)) / RING_N -
                    LOOP / 2
                  ).toFixed(3)}s infinite`,
                  willChange: "transform",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: "scaleX(0.82)",
                    transformOrigin: "center",
                  }}
                >
                  {p}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {[
        { left: "22%", size: "0.9vh", delay: "0s", dur: "13s" },
        { left: "71%", size: "1.4vh", delay: "4s", dur: "16s" },
        { left: "58%", size: "0.7vh", delay: "8s", dur: "11s" },
        { left: "38%", size: "1.1vh", delay: "6s", dur: "15s" },
      ].map((b, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-4vh",
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "rgba(110,160,130,0.28)",
            boxShadow: "0 0 6px rgba(140,190,160,0.4)",
            zIndex: 15,
            animation: `jelly-bubble ${b.dur} linear ${b.delay} infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          transform: "translate(-50%, -50%)",
          width: "min(58vh, 70vw)",
          height: "78vh",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <Jellyfish3D loop={LOOP} />
      </div>

      <div
        style={{
          position: "absolute",
          right: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 38,
          width: "min(22vw, 30vh)",
          textAlign: "right",
          pointerEvents: "none",
          animation: `jelly-manifesto ${LOOP}s ease-in-out 0s infinite`,
          willChange: "opacity, transform",
        }}
      >
        <p
          style={{
            margin: "1.2vh 0 0",
            fontFamily: SANS,
            fontSize: "1.35vh",
            fontWeight: 600,
            letterSpacing: "0.1em",
            lineHeight: 1.7,
            color: "rgba(30,30,40,0.82)",
            textTransform: "uppercase",
          }}
        >
          {MANIFESTO}
        </p>
      </div>

      <SideRuler side="left" />
      <SideRuler side="right" />

      <div
        style={{
          position: "absolute",
          bottom: "3.4vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          width: "60vw",
          textAlign: "center",
          height: "3.4vh",
        }}
      >
        {[
          "WHERE COMPASSION MEETS ACTION — INITIATIVES BUILT TO HELP",
          "REAL CHANGE. LASTING IMPACT. COMMUNITIES YOU CAN LIFT.",
          "WE DON'T JUST DREAM — WE BRING HOPE TO LIFE.",
        ].map((c, i) => (
          <p
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              margin: 0,
              fontSize: "1.15vh",
              fontWeight: 700,
              letterSpacing: "0.16em",
              lineHeight: 1.5,
              color: "rgba(30,30,40,0.78)",
              opacity: 0,
              animation: `jelly-caption 18s ease-in-out ${i * 6}s infinite`,
              willChange: "opacity",
            }}
          >
            {c}
          </p>
        ))}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "6.5vh",
          left: "2.6vw",
          zIndex: 35,
          fontSize: "0.85vh",
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: "rgba(30,30,40,0.42)",
          textTransform: "uppercase",
        }}
      >
        Initiative / 01 — Lasting Impact
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "140px 140px",
          opacity: 0.06,
          mixBlendMode: "multiply",
        }}
      />
    </section>
  );
}

const JELLY_CSS = `
@keyframes jelly-orbit{
  from{transform:rotateY(0deg)}
  to{transform:rotateY(-360deg)}
}

@keyframes jelly-fade{
  0%{opacity:1}
  10%{opacity:1}
  21%{opacity:0}
  79%{opacity:0}
  90%{opacity:1}
  100%{opacity:1}
}

@keyframes jelly-rise{
  0%{transform:translateY(0)}
  21%{transform:translateY(0)}
  50%{transform:translateY(32vh)}
  78%{transform:translateY(32vh);animation-timing-function:ease-out}
  87%{transform:translateY(0)}
  100%{transform:translateY(0)}
}

@keyframes jelly-manifesto{
  0%,74%{opacity:0;transform:translateY(-50%) translateX(2vw)}
  81%{opacity:1;transform:translateY(-50%) translateX(0)}
  92%{opacity:1;transform:translateY(-50%) translateX(0)}
  98%,100%{opacity:0;transform:translateY(-50%) translateX(2vw)}
}

@keyframes jelly-mark{
  0%,100%{transform:translate(0,0)}
  50%{transform:translate(-1.4vw,2vh)}
}

@keyframes jelly-bubble{
  0%{transform:translateY(0) translateX(0);opacity:0}
  12%{opacity:.7}
  80%{opacity:.5}
  100%{transform:translateY(-108vh) translateX(2vh);opacity:0}
}

@keyframes jelly-caption{
  0%{opacity:0}
  4%,28%{opacity:1}
  33%,100%{opacity:0}
}

@media (prefers-reduced-motion: reduce){
  .jelly-loop *{
    animation-duration:.001ms !important;
    animation-iteration-count:1 !important;
  }
  .jelly-loop .jelly-stage{
    animation:none !important;
    transform:rotateY(0deg) !important;
  }
  .jelly-loop .jelly-phrase{
    animation:none !important;
    opacity:0 !important;
  }
  .jelly-loop .jelly-phrase:first-of-type{
    opacity:1 !important;
  }
}
`;
