"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markLoaderDone } from "@/lib/loader";

/* ── Molette ─────────────────────────────────────────────────────────────────
   Chaque mode est placé sur la molette à un angle (sens horaire, 0 = en haut).
   Pour amener un mode sous l'index, on tourne la molette de -angle.          */
const STEP = 22;
type Mode = {
	key: string;
	angle: number;
	label: string;
	kind: "icon-macro" | "icon-scene" | "pill" | "disk" | "text";
};
const MODES: Mode[] = [
	{ key: "macro", angle: -2 * STEP, label: "Macro", kind: "icon-macro" },
	{ key: "scene", angle: -1 * STEP, label: "Scène", kind: "icon-scene" },
	{ key: "AUTO", angle: 0, label: "Automatique", kind: "pill" },
	{ key: "P", angle: 1 * STEP, label: "Programme", kind: "disk" },
	{ key: "S", angle: 2 * STEP, label: "Priorité vitesse", kind: "disk" },
	{ key: "A", angle: 3 * STEP, label: "Priorité ouverture", kind: "disk" },
	{ key: "M", angle: 4 * STEP, label: "Manuel", kind: "disk" },
	{ key: "C1", angle: 5 * STEP, label: "Personnalisé 1", kind: "text" },
	{ key: "C2", angle: 6 * STEP, label: "Personnalisé 2", kind: "text" },
	{ key: "C3", angle: 7 * STEP, label: "Personnalisé 3", kind: "text" },
];
const angleOf = (key: string) => MODES.find((m) => m.key === key)!.angle;

/* Parcours : AUTO → oscillation amortie autour de M, comme une boussole. */
const PATH = ["C3", "S", "C1", "A", "M"];

const LABEL_R = 122;
const TICK_COUNT = 72;

export default function Loader() {
	const rootRef = useRef<HTMLDivElement>(null);
	const dialRef = useRef<SVGGElement>(null);
	const [active, setActive] = useState("AUTO");
	const [done, setDone] = useState(false);

	useGSAP(
		() => {
			document.documentElement.style.overflow = "hidden";
			const dial = dialRef.current!;
			const reduced = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			const pageLoaded = new Promise<void>((resolve) => {
				if (document.readyState === "complete") resolve();
				else window.addEventListener("load", () => resolve(), { once: true });
			});

			// Met à jour le mode sous l'index pendant la rotation
			const state = { rot: 0 };
			const sync = () => {
				dial.setAttribute("transform", `rotate(${state.rot})`);
				const nearest = MODES.reduce((a, b) =>
					Math.abs(b.angle + state.rot) < Math.abs(a.angle + state.rot) ? b : a
				);
				setActive((prev) => (prev === nearest.key ? prev : nearest.key));
			};

			const tl = gsap.timeline({ delay: 0.4, onUpdate: sync });
			if (reduced) {
				tl.to(state, { rot: -angleOf("M"), duration: 0.4, onUpdate: sync });
			} else {
				PATH.forEach((key, i) => {
					const last = i === PATH.length - 1;
					tl.to(state, {
						rot: -angleOf(key),
						duration: last ? 0.9 : 0.75 - i * 0.07,
						ease: last ? "back.out(2.2)" : "power3.inOut",
						onUpdate: sync,
					});
					// Petit temps d'arrêt : le cran de la molette
					if (!last) tl.to({}, { duration: 0.12 });
				});
			}

			tl.then(async () => {
				await pageLoaded;
				const root = rootRef.current!;
				const svg = root.querySelector<SVGSVGElement>(".loader__dial")!;

				// Centre de la molette à l'écran (origine du viewBox = 50% / 205/300)
				const rect = svg.getBoundingClientRect();
				const cx = rect.left + rect.width * 0.5;
				const cy = rect.top + (rect.height * 205) / 300;
				const unit = rect.width / 400; // px par unité SVG
				const RING = 168; // rayon intérieur du crantage (unités SVG)
				const farthest = Math.max(
					Math.hypot(cx, cy),
					Math.hypot(window.innerWidth - cx, cy),
					Math.hypot(cx, window.innerHeight - cy),
					Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
				);
				const maxScale = (farthest / (RING * unit)) * 1.15;

				gsap.set(svg, { transformOrigin: `50% ${(205 / 300) * 100}%` });

				// Ouverture : un trou s'ouvre au centre de la molette, puis on
				// « entre » dedans en zoomant à travers l'anneau.
				const zoom = { p: 0 };
				const applyZoom = () => {
					const p = zoom.p;
					const scale = 1 + p * (maxScale - 1);
					const hole = RING * unit * scale * Math.min(1, p * 2.5);
					const mask = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${hole}px, #000 ${hole + 1.5}px)`;
					root.style.setProperty("mask-image", mask);
					root.style.setProperty("-webkit-mask-image", mask);
					gsap.set(svg, { scale });
				};

				await gsap
					.timeline()
					.to({}, { duration: 0.5 })
					.to(".loader__caption", {
						opacity: 0,
						y: 10,
						duration: 0.35,
						ease: "power2.in",
					})
					.to(zoom, {
						p: 1,
						duration: 1.5,
						ease: "power3.in",
						onStart: () => markLoaderDone(),
						onUpdate: applyZoom,
					});
				document.documentElement.style.overflow = "";
				setDone(true);
			});

			return () => {
				document.documentElement.style.overflow = "";
			};
		},
		{ scope: rootRef }
	);

	if (done) return null;

	const activeLabel = MODES.find((m) => m.key === active)?.label ?? "";

	return (
		<div
			ref={rootRef}
			className="loader"
			aria-busy="true"
			aria-label="Chargement"
		>
			<div className="loader__inner">
				<svg
					className="loader__dial"
					viewBox="-200 -205 400 300"
					aria-hidden="true"
				>
					<defs>
						{/* Fondu vers le bas : on ne voit que le haut de la molette */}
						<linearGradient
							id="loader-fade"
							x1="0"
							y1="-200"
							x2="0"
							y2="90"
							gradientUnits="userSpaceOnUse"
						>
							<stop
								offset="0"
								stopColor="#fff"
							/>
							<stop
								offset="0.55"
								stopColor="#fff"
							/>
							<stop
								offset="1"
								stopColor="#fff"
								stopOpacity="0"
							/>
						</linearGradient>
						<mask
							id="loader-mask"
							maskUnits="userSpaceOnUse"
							x="-200"
							y="-205"
							width="400"
							height="300"
						>
							<rect
								x="-200"
								y="-205"
								width="400"
								height="300"
								fill="url(#loader-fade)"
							/>
						</mask>
					</defs>

					<g mask="url(#loader-mask)">
						<g ref={dialRef}>
							{/* Crantage */}
							{Array.from({ length: TICK_COUNT }, (_, i) => (
								<line
									key={i}
									x1="0"
									y1={-172}
									x2="0"
									y2={i % 2 === 0 ? -186 : -182}
									stroke="var(--white)"
									strokeWidth="2"
									strokeLinecap="round"
									opacity={0.85}
									transform={`rotate(${(i * 360) / TICK_COUNT})`}
								/>
							))}

							{/* Modes */}
							{MODES.map((m) => (
								<g
									key={m.key}
									transform={`rotate(${m.angle}) translate(0 ${-LABEL_R})`}
									className={`loader__mode${
										active === m.key ? " is-active" : ""
									}`}
								>
									<g transform="rotate(-90)">
										<ModeGlyph mode={m} />
									</g>
								</g>
							))}
						</g>
					</g>

					{/* Index fixe */}
					<line
						x1="0"
						y1="-200"
						x2="0"
						y2="-158"
						stroke="var(--red)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
				</svg>

				<p className="loader__caption">
					<span className="loader__caption-key">{active}</span>
					<span className="loader__caption-sep">—</span>
					{activeLabel}
				</p>
			</div>
		</div>
	);
}

function ModeGlyph({ mode }: { mode: Mode }) {
	switch (mode.kind) {
		case "pill":
			return (
				<>
					<rect
						className="loader__shape loader__shape--outline"
						x="-29"
						y="-13"
						width="58"
						height="26"
						rx="13"
					/>
					<text className="loader__text loader__text--outline">AUTO</text>
				</>
			);
		case "disk":
			return (
				<>
					<circle
						className="loader__shape"
						r="16"
					/>
					<text className="loader__text loader__text--disk">{mode.key}</text>
				</>
			);
		case "text":
			return (
				<text className="loader__text loader__text--plain">{mode.key}</text>
			);
		case "icon-scene":
			return (
				<g className="loader__icon">
					<path d="M-9 9 L-1 -9 L7 9 Z" />
					<circle
						cx="9"
						cy="-5"
						r="3.2"
					/>
				</g>
			);
		case "icon-macro":
			return (
				<g className="loader__icon">
					<path
						className="loader__stem"
						d="M0 2 L0 11 M0 8 Q-5 7 -7 3"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path d="M-7 -9 L-3.5 -5 L0 -10 L3.5 -5 L7 -9 L7 -3 Q7 3 0 3 Q-7 3 -7 -3 Z" />
				</g>
			);
	}
}
