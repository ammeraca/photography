"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface UseRevealOptions {
	selector?: string;
	stagger?: number;
	y?: number;
	duration?: number;
}

export function useReveal(opts: UseRevealOptions = {}) {
	const containerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const targets = el.querySelectorAll<HTMLElement>(
			opts.selector ?? ".reveal"
		);
		if (!targets.length) return;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				targets,
				{ opacity: 0, y: opts.y ?? 50 },
				{
					opacity: 1,
					y: 0,
					duration: opts.duration ?? 1.0,
					ease: "power3.out",
					stagger: opts.stagger ?? 0.12,
				}
			);
		}, el);

		return () => ctx.revert();
	}, [opts.selector, opts.stagger, opts.y, opts.duration]);

	return containerRef;
}
