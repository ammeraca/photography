"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { onLoaderDone } from "@/lib/loader";

gsap.registerPlugin(ScrollTrigger);

/** Chaque domaine mène à un album ; sa photo apparaît au survol. */
const SKILLS = [
	{ name: "Militantisme", album: "activism", photo: 24 },
	{ name: "Street Photo", album: "blurry", photo: 12 },
	{ name: "Évènementiel", album: "events", photo: 16 },
	{ name: "Portraits", album: "people", photo: 16 },
	{ name: "Voyage & Reportage", album: "international", photo: 29 },
	{ name: "Culture", album: "design", photo: 8 },
];
const photoOf = (s: (typeof SKILLS)[number]) =>
	`/images/galleries/${s.album}/${s.photo}.webp`;

export default function Skills() {
	const rootRef = useRef<HTMLElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current!;
			const reduced = window.matchMedia(
				"(prefers-reduced-motion: reduce)"
			).matches;

			// ── Arrivée au scroll : les lignes se tracent, les textes montent
			let stopReveal = () => {};
			if (!reduced) {
				gsap.set(".skill__line, .skills__end", { scaleX: 0 });
				gsap.set(".skill__inner, .skills__head-inner", { yPercent: 115 });
				stopReveal = onLoaderDone(() => {
					gsap
						.timeline({
							scrollTrigger: { trigger: root, start: "top 78%", once: true },
						})
						.to(".skills__head-inner", {
							yPercent: 0,
							duration: 0.9,
							ease: "power4.out",
						})
						.to(
							".skill__line, .skills__end",
							{ scaleX: 1, duration: 1.3, ease: "power3.inOut", stagger: 0.07 },
							0.1
						)
						.to(
							".skill__inner",
							{ yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.07 },
							0.3
						);
				});
			}

			// ── Survol (souris uniquement) : la photo du domaine suit le curseur
			const preview = previewRef.current!;
			if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
				return stopReveal;

			const imgs = gsap.utils.toArray<HTMLElement>(".skills__preview img");
			gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
			gsap.set(imgs, { autoAlpha: 0 });
			const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3" });
			const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3" });
			const tiltTo = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });
			let lastX = 0;
			let settle: gsap.core.Tween | undefined;
			let current = -1;
			let top = 1;

			const onMove = (e: MouseEvent) => {
				xTo(e.clientX);
				yTo(e.clientY);
				// La photo s'incline dans le sens du mouvement, puis se redresse
				tiltTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
				lastX = e.clientX;
				settle?.kill();
				settle = gsap.delayedCall(0.12, () => tiltTo(0));
			};
			const show = (i: number) => {
				if (i === current) return;
				current = i;
				// La nouvelle photo est posée par-dessus la précédente, un peu de travers
				gsap.fromTo(
					imgs[i],
					{ autoAlpha: 0, scale: 1.15, zIndex: ++top },
					{
						autoAlpha: 1,
						scale: 1,
						rotation: gsap.utils.random(-7, 7),
						duration: 0.5,
						ease: "power3.out",
					}
				);
			};
			const onEnterList = (e: MouseEvent) => {
				lastX = e.clientX;
				gsap.set(preview, { x: e.clientX, y: e.clientY });
				gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
			};
			const onLeaveList = () => {
				current = -1;
				gsap.to(preview, { scale: 0.6, autoAlpha: 0, duration: 0.4, ease: "power3.in" });
				gsap.to(imgs, { autoAlpha: 0, duration: 0.3, delay: 0.1 });
			};

			const list = root.querySelector<HTMLElement>(".skills__list")!;
			const rows = gsap.utils.toArray<HTMLElement>(".skill", root);
			const enters = rows.map((row, i) => {
				const fn = () => show(i);
				row.addEventListener("mouseenter", fn);
				return () => row.removeEventListener("mouseenter", fn);
			});
			list.addEventListener("mousemove", onMove);
			list.addEventListener("mouseenter", onEnterList);
			list.addEventListener("mouseleave", onLeaveList);

			return () => {
				stopReveal();
				settle?.kill();
				enters.forEach((off) => off());
				list.removeEventListener("mousemove", onMove);
				list.removeEventListener("mouseenter", onEnterList);
				list.removeEventListener("mouseleave", onLeaveList);
			};
		},
		{ scope: rootRef }
	);

	return (
		<section
			ref={rootRef}
			className="skills"
		>
			<header className="skills__head">
				<span className="skills__mask">
					<span className="skills__head-inner">
						<span>Mes domaines de prédilection</span>
						<span>({String(SKILLS.length).padStart(2, "0")})</span>
					</span>
				</span>
			</header>

			<ul className="skills__list">
				{SKILLS.map((s, i) => (
					<li key={s.name}>
						<Link
							href={`/galleries/${s.album}`}
							className="skill"
						>
							<span className="skill__line" />
							<span className="skills__mask">
								<span className="skill__inner">
									<span className="skill__num">0{i + 1}</span>
									<span className="skill__name">{s.name}</span>
									<span className="skill__cta">
										Voir l&apos;album <span aria-hidden="true">→</span>
									</span>
								</span>
							</span>
							{/* Écrans tactiles : petite photo à la place de l'aperçu au survol */}
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								className="skill__thumb"
								src={photoOf(s)}
								alt=""
								loading="lazy"
								style={{ "--r": `${i % 2 ? 4 : -4}deg` } as React.CSSProperties}
							/>
						</Link>
					</li>
				))}
			</ul>
			<span className="skills__end" />

			<div
				ref={previewRef}
				className="skills__preview"
				aria-hidden="true"
			>
				{SKILLS.map((s) => (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						key={s.name}
						src={photoOf(s)}
						alt=""
					/>
				))}
			</div>
		</section>
	);
}
