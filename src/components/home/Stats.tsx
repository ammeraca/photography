"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { onLoaderDone } from "@/lib/loader";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
	{ value: 3, suffix: "+", label: "Années d'expérience" },
	{ value: 15, suffix: "+", label: "Projets réalisés" },
	{ value: 12, suffix: "", label: "Pays photographiés" },
];

export default function Stats() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current!;
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

			const stats = gsap.utils.toArray<HTMLElement>(".stat", root);
			const nums = stats.map((s) => s.querySelector<HTMLElement>(".stat__num")!);
			gsap.set(stats, { autoAlpha: 0, y: 40 });
			gsap.set(".stat__bar", { scaleX: 0 });
			gsap.set(".stats__line", { scaleX: 0 });
			nums.forEach((n) => (n.textContent = "0"));

			return onLoaderDone(() => {
				const tl = gsap.timeline({
					scrollTrigger: { trigger: root, start: "top 80%", once: true },
				});
				tl.to(".stats__line", { scaleX: 1, duration: 1.2, ease: "power3.inOut" })
					.to(
						stats,
						{ autoAlpha: 1, y: 0, duration: 1, ease: "power4.out", stagger: 0.12 },
						0.2
					)
					.to(
						".stat__bar",
						{ scaleX: 1, duration: 1.4, ease: "power3.inOut", stagger: 0.12 },
						0.4
					);
				// Les chiffres défilent jusqu'à leur valeur
				STATS.forEach((s, i) => {
					const counter = { v: 0 };
					tl.to(
						counter,
						{
							v: s.value,
							duration: 2,
							ease: "power3.out",
							onUpdate: () => {
								nums[i].textContent = String(Math.round(counter.v));
							},
						},
						0.3 + i * 0.12
					);
				});
			});
		},
		{ scope: rootRef }
	);

	return (
		<section
			ref={rootRef}
			className="stats"
		>
			<span className="stats__line" />
			<div className="stats__grid">
				{STATS.map((s) => (
					<div
						key={s.label}
						className="stat"
					>
						<span className="stat__value">
							<span className="stat__num">{s.value}</span>
							{s.suffix && <span className="stat__suffix">{s.suffix}</span>}
						</span>
						<span className="stat__label">{s.label}</span>
						<span className="stat__bar" />
					</div>
				))}
			</div>
		</section>
	);
}
