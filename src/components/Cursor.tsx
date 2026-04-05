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

		const onEnter = () => ring.classList.add("is-hovering");
		const onLeave = () => ring.classList.remove("is-hovering");

		window.addEventListener("mousemove", onMove);
		document
			.querySelectorAll("a, button, .btn, [data-cursor]")
			.forEach((el) => {
				el.addEventListener("mouseenter", onEnter);
				el.addEventListener("mouseleave", onLeave);
			});

		animate();
		return () => {
			window.removeEventListener("mousemove", onMove);
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
