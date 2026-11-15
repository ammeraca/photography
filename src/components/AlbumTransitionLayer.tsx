"use client";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import {
	endAlbumTransition,
	getAlbumTransition,
	subscribeAlbumTransition,
} from "@/lib/albumTransition";

const FLIGHT = 1.2; // durée du vol (s)
const STAGGER = 0.04; // écart entre deux photos (s)
const NO_PHOTOS: never[] = [];

/** Affiche la photo de la grille une fois son image chargée, puis retire la copie. */
function handOff(target: HTMLElement, clone: HTMLElement): Promise<void> {
	return new Promise((resolve) => {
		const img = target.querySelector("img");
		const swap = () => {
			target.style.opacity = "1";
			clone.style.display = "none";
			resolve();
		};
		if (!img || (img.complete && img.naturalWidth > 0)) return swap();
		img.addEventListener("load", swap, { once: true });
		img.addEventListener("error", swap, { once: true });
		setTimeout(swap, 3000); // filet de sécurité
	});
}

export default function AlbumTransitionLayer() {
	const transition = useSyncExternalStore(
		subscribeAlbumTransition,
		getAlbumTransition,
		() => null
	);
	const layerRef = useRef<HTMLDivElement>(null);
	const photos = transition?.photos ?? NO_PHOTOS;
	const targets = transition?.targets ?? null;

	// 1. Départ : chaque copie reprend exactement la pose de la photo du paquet
	useLayoutEffect(() => {
		const layer = layerRef.current;
		if (!layer || !photos.length) return;
		const clones = [...layer.querySelectorAll<HTMLElement>(".flying-photo")];
		clones.forEach((el, i) => {
			const { left, top, width, height, rotation } = photos[i].pose;
			gsap.set(el, { left, top, width, height, rotation, display: "block" });
		});
		// En attendant la page album, le paquet se soulève légèrement
		gsap.to(clones, { scale: 1.04, duration: 0.4, ease: "power2.out" });

		// Si l'album ne s'affiche jamais (erreur de navigation…), on nettoie
		const fallback = setTimeout(() => {
			if (!getAlbumTransition()?.targets) {
				gsap.to(clones, {
					opacity: 0,
					duration: 0.4,
					onComplete: endAlbumTransition,
				});
			}
		}, 5000);
		return () => clearTimeout(fallback);
	}, [photos]);

	// 2. Atterrissage : les photos s'étalent vers leur place dans la grille
	useLayoutEffect(() => {
		const layer = layerRef.current;
		if (!layer || !targets || !photos.length) return;
		const clones = [...layer.querySelectorAll<HTMLElement>(".flying-photo")];

		// Les photos du dessus partent en premier. Chaque photo garde son rang
		// (z) pendant tout l'étalement : celles qui partent ensuite glissent
		// donc SOUS celles déjà posées, comme sur une table.
		const order = clones
			.map((el, i) => ({ el, photo: photos[i] }))
			.sort((a, b) => b.photo.z - a.photo.z);

		// Bascule vers la vraie grille seulement quand tout est posé : une photo
		// de la grille est sous la couche, elle passerait sinon sous les suivantes.
		const landed: { target: HTMLElement; el: HTMLElement }[] = [];
		const tl = gsap.timeline({
			onComplete: () => {
				Promise.all(landed.map(({ target, el }) => handOff(target, el))).then(
					endAlbumTransition
				);
			},
		});
		order.forEach(({ el, photo }, i) => {
			const target = targets.get(photo.src);
			if (!target) {
				tl.to(el, { opacity: 0, duration: 0.3 }, 0);
				return;
			}
			// La photo de la grille est inclinée : on vise sa boîte non tournée
			// (même centre, taille réelle) et son inclinaison.
			const r = target.getBoundingClientRect();
			const w = target.offsetWidth;
			const h = target.offsetHeight;
			const finalRotation = Number(target.dataset.rotation) || 0;
			const at = i * STAGGER;
			tl.to(
				el,
				{
					left: r.left + r.width / 2 - w / 2,
					top: r.top + r.height / 2 - h / 2,
					width: w,
					height: h,
					scale: 1,
					duration: FLIGHT,
					ease: "power3.inOut",
				},
				at
			)
				// Elle garde sa rotation (la même que dans la grille : voir
				// flownRotations dans la page album)
				.to(
					el,
					{
						rotation: finalRotation,
						duration: FLIGHT * 0.4,
						ease: "power2.inOut",
					},
					at + FLIGHT * 0.6
				)
				.add(() => {
					landed.push({ target, el });
				}, at + FLIGHT);
		});
		return () => {
			tl.kill();
		};
	}, [targets, photos]);

	if (!photos.length) return null;

	return (
		<div
			ref={layerRef}
			className="flying-layer"
			aria-hidden="true"
		>
			{photos.map((p) => (
				<div
					key={p.src}
					className="flying-photo"
					style={{ zIndex: p.z, display: "none" }}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={p.src}
						alt=""
						draggable={false}
					/>
				</div>
			))}
		</div>
	);
}
