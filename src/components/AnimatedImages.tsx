import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AnimatedImages.css";
import { onLoaderDone } from "@/lib/loader";

interface AnimatedImagesProps {
	images: string[];
	withAnimation?: boolean;
	/** Au clic, la photo du dessus passe sous le paquet. */
	shuffleOnClick?: boolean;
}

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function AnimatedImages({
	images,
	withAnimation = true,
	shuffleOnClick = false,
}: AnimatedImagesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	// Ordre d'empilement : du dessous (index 0) au dessus (dernier)
	const orderRef = useRef<number[]>(images.map((_, i) => i));
	const busyRef = useRef(true); // bloqué tant que l'intro n'est pas finie

	const { contextSafe } = useGSAP(
		() => {
			const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
			if (!items.length) return;

			// Décalage pour que le paquet parte entièrement hors de l'écran, à
			// droite, quelles que soient la largeur de l'écran et l'inclinaison
			// de départ (jusqu'à 60° : la photo inclinée déborde de sa boîte).
			const box = containerRef.current!.getBoundingClientRect();
			const offscreenX = (el: HTMLElement) => {
				const w = el.offsetWidth;
				const h = el.offsetHeight;
				return window.innerWidth - box.left + (Math.hypot(w, h) - w) / 2 + 40;
			};

			// Point de départ hors de l'écran. Les photos sont cachées en CSS
			// jusqu'ici (…--intro) : on ne les voit jamais à leur place avant
			// l'animation, même si le JavaScript arrive tard (mobile).
			items.forEach((el, i) => {
				if (!withAnimation) return;
				gsap.set(el, {
					x: offscreenX(el),
					y: -100 - i * 40,
					rotation: (i % 2 === 0 ? -1 : 1) * (20 + i * 5),
					opacity: 1,
					scale: 1,
				});
			});

			const tl = gsap.timeline({
				delay: 0.5,
				paused: true,
				onComplete: () => {
					busyRef.current = false;
				},
			});
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

			return onLoaderDone(() => tl.play());
		},
		{ scope: containerRef }
	);

	// Prend la photo du dessus, la soulève hors du paquet puis la glisse dessous
	const sendTopToBack = contextSafe(() => {
		if (busyRef.current) return;
		const order = orderRef.current;
		if (order.length < 2) return;
		busyRef.current = true;

		const topIndex = order[order.length - 1];
		const card = itemRefs.current[topIndex];
		if (!card) return;
		const height = card.offsetHeight;
		const side = Math.random() < 0.5 ? -1 : 1;

		const restack = () => {
			order.pop();
			order.unshift(topIndex);
			order.forEach((itemIndex, z) => {
				const el = itemRefs.current[itemIndex];
				if (el) el.style.zIndex = String(z);
			});
		};

		gsap
			.timeline({
				onComplete: () => {
					busyRef.current = false;
				},
			})
			// 1. On la saisit et on la fait glisser vers le haut, hors du paquet
			.to(card, {
				y: -height * 0.72,
				x: side * getRandomArbitrary(200, 500),
				rotation: side * getRandomArbitrary(4, 9),
				scale: 1.1,
				duration: 0.5,
				ease: "power2.out",
			})
			// 2. Au sommet, elle passe derrière les autres
			.add(restack)
			// 3. Elle redescend se ranger sous le paquet
			.to(card, {
				x: getRandomArbitrary(-20, 20),
				y: getRandomArbitrary(-20, 20),
				rotation: getRandomArbitrary(-5, 5),
				scale: 1,
				duration: 0.5,
				ease: "power3.inOut",
			});
		// (le reste du paquet ne bouge pas : seule la photo du dessus se déplace)
	});

	const interactiveProps = shuffleOnClick
		? {
				role: "button",
				tabIndex: 0,
				"aria-label": "Photo suivante",
				"data-cursor": "",
				onClick: sendTopToBack,
				onKeyDown: (e: React.KeyboardEvent) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						sendTopToBack();
					}
				},
			}
		: {};

	const imagesToShow = images;

	return (
		<div
			ref={containerRef}
			className={`animated-images__container${
				withAnimation ? " animated-images__container--intro" : ""
			}`}
			{...interactiveProps}
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
