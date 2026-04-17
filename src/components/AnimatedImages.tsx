import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AnimatedImages.css";

interface AnimatedImagesProps {
	images: string[];
	withAnimation?: boolean;
}

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function AnimatedImages({
	images,
	withAnimation = true,
}: AnimatedImagesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useGSAP(
		() => {
			const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
			if (!items.length) return;

			const width = window.innerWidth;

			items.forEach((el, i) => {
				if (!withAnimation) return;
				gsap.set(el, {
					x: width,
					y: -100 - i * 40,
					rotation: (i % 2 === 0 ? -1 : 1) * (20 + i * 5),
					opacity: 1,
					scale: 1,
				});
			});

			const tl = gsap.timeline({ delay: 0.5 });
			items.forEach((el, i) => {
				const randomX = getRandomArbitrary(-20, 20);
				const randomY = getRandomArbitrary(-20, 20);
				const randomRotation = getRandomArbitrary(-5, 5);
				tl.to(
					el,
					{
						x: randomX,
						y: randomY,
						rotation: randomRotation,
						opacity: 1,
						duration: 2,
						delay: withAnimation ? i * 0.5 : 0,
						ease: "power4.inOut",
					},
					i * 0.12
				);
			});
		},
		{ scope: containerRef }
	);
	const imagesToShow = withAnimation ? images : images.slice(-5);

	return (
		<div
			ref={containerRef}
			className="animated-images__container"
		>
			{imagesToShow.map((src, i) => (
				<div
					key={i}
					ref={(el) => {
						itemRefs.current[i] = el;
					}}
					className="animated-images__item"
					style={{ zIndex: i }}
				>
					<img
						src={src}
						alt={`photo ${i + 1}`}
						draggable={false}
					/>
				</div>
			))}
		</div>
	);
}
