"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const dot = dotRef.current!;
		const ring = ringRef.current!;
		let mouseX = 0,
			mouseY = 0;
		let ringX = 0,
			ringY = 0;
		let rafId: number;

		const onMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			dot.style.left = `${mouseX}px`;
			dot.style.top = `${mouseY}px`;
		};

		const animate = () => {
			ringX += (mouseX - ringX) * 0.12;
			ringY += (mouseY - ringY) * 0.12;
			ring.style.left = `${ringX}px`;
			ring.style.top = `${ringY}px`;
			rafId = requestAnimationFrame(animate);
		};

		// Délégation : marche aussi pour les éléments ajoutés après une navigation
		const INTERACTIVE = "a, button, .btn, [data-cursor]";
		const onOver = (e: MouseEvent) => {
			const hovering = !!(e.target as Element | null)?.closest?.(INTERACTIVE);
			dot.classList.toggle("is-hovering", hovering);
			ring.classList.toggle("is-hovering", hovering);
		};

		window.addEventListener("mousemove", onMove);
		document.addEventListener("mouseover", onOver);

		animate();
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseover", onOver);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<>
			<div
				ref={dotRef}
				className="cursor__dot"
			/>
			<div
				ref={ringRef}
				className="cursor__ring"
			/>
		</>
	);
}
