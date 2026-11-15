"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { onLoaderDone } from "@/lib/loader";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollRevealOptions {
	selector?: string;
	stagger?: number;
	y?: number;
	duration?: number;
}

export function useScrollReveal(opts: UseScrollRevealOptions = {}) {
	const containerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const targets = el.querySelectorAll<HTMLElement>(
			opts.selector ?? ".reveal"
		);
		if (!targets.length) return;

		let ctx: gsap.Context | undefined;
		const stop = onLoaderDone(() => {
			ctx = gsap.context(() => {
				gsap.fromTo(
					targets,
					{ opacity: 0, y: opts.y ?? 50 },
					{
						opacity: 1,
						y: 0,
						duration: opts.duration ?? 1.0,
						ease: "power3.out",
						stagger: opts.stagger ?? 0.12,
						scrollTrigger: {
							trigger: el,
							// markers: true,
							start: "top 80%",
							end: "bottom bottom",
							toggleActions: "play none reverse none",
						},
					}
				);
			}, el);
		});

		return () => {
			stop();
			ctx?.revert();
		};
	}, [opts.selector, opts.stagger, opts.y, opts.duration]);

	return containerRef;
}
