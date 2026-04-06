import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AnimatedImages.css";

interface AnimatedImagesProps {
	images: string[];
	withAnimation?: boolean;
}

// Positions finales légèrement décalées pour l'effet pile désordonnée
const STACK_OFFSETS = [
	{ x: 10, y: 0, rotation: 0 },
	{ x: 12, y: -8, rotation: 3.5 },
	{ x: -9, y: 6, rotation: -2.5 },
	{ x: 16, y: 4, rotation: 5 },
	{ x: -6, y: -12, rotation: -4 },
	{ x: 10, y: 10, rotation: 2 },
	{ x: -14, y: 2, rotation: -6 },
];

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

			// État initial : toutes les images éparpillées hors écran
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

			// Timeline : les images tombent et s'empilent les unes après les autres
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
