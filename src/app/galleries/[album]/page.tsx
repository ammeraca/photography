"use client";
import { useParams } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { Title } from "@/components/Text";
import { onLoaderDone } from "@/lib/loader";
import { albumsConfig } from "@/lib/albums";
import { albumOrientations } from "@/lib/albumOrientations";
import { scatterFor, stackFor } from "@/lib/scatter";
import AlbumCounter from "@/components/AlbumCounter";
import { useEffect, useRef, useState } from "react";
import {
	getAlbumTransition,
	isAlbumTransitionPending,
	landAlbumTransition,
} from "@/lib/albumTransition";

function albumImages(album: string, count: number): string[] {
	return Array.from(
		{ length: count },
		(_, i) => `/images/galleries/${album}/${i + 1}.webp`
	);
}

export default function AlbumPage() {
	const params = useParams();
	const album = params.album as string;
	const count = albumsConfig.find((a) => a.album === album)?.count ?? 0;
	const first = albumsConfig.find((a) => a.album === album)?.first ?? "";
	const second = albumsConfig.find((a) => a.album === album)?.second ?? "";
	const images = albumImages(album, count);
	// Ouvert depuis « Mon travail » ? Les photos arrivent alors en volant
	// (voir AlbumTransitionLayer) et se posent dans la grille.
	const [origin] = useState(() => isAlbumTransitionPending(album));
	// Chaque photo garde dans la grille la rotation qu'elle avait sur « Mon travail »
	const [flownRotations] = useState(() =>
		origin
			? new Map(
					getAlbumTransition()!.photos.map((p) => [p.src, p.pose.rotation])
				)
			: null
	);
	const gridRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	// Format connu à l'avance (scripts/orientations.py), indexé comme la grille
	// (photos affichées de la plus récente à la plus ancienne).
	const [orientations, setOrientations] = useState<
		Record<number, "landscape" | "portrait">
	>(() => {
		const known = albumOrientations[album] ?? [];
		const initial: Record<number, "landscape" | "portrait"> = {};
		for (let i = 0; i < count; i++) {
			const format = known[count - 1 - i];
			if (format) initial[i] = format;
		}
		return initial;
	});

	const handleLoad = (i: number, e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		setOrientations((prev) =>
			prev[i]
				? prev
				: {
						...prev,
						[i]:
							img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
					}
		);
	};

	// Ouverture directe : simple fondu des photos (un déplacement GSAP
	// effacerait l'inclinaison de chaque photo).
	useEffect(() => {
		if (origin) return;
		const items = gridRef.current?.querySelectorAll(".album-grid__item");
		if (!items?.length) return;
		let tween: gsap.core.Tween | undefined;
		const stop = onLoaderDone(() => {
			tween = gsap.fromTo(
				items,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.06 }
			);
		});
		return () => {
			stop();
			tween?.kill();
		};
	}, [origin]);

	// Indique à la couche de transition où chaque photo doit se poser
	useEffect(() => {
		if (!origin) return;
		gsap.fromTo(
			headerRef.current,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 }
		);
		// On attend une image : Next a alors remis la page en haut
		const raf = requestAnimationFrame(() => {
			const targets = new Map<string, HTMLElement>();
			gridRef.current
				?.querySelectorAll<HTMLElement>(".album-grid__item")
				.forEach((el) => targets.set(el.dataset.src!, el));
			landAlbumTransition(album, targets);
		});
		return () => cancelAnimationFrame(raf);
	}, [origin, album]);

	return (
		<div
			style={{
				minHeight: "100vh",
				paddingTop: "clamp(6rem, 15vw, 9rem)",
				paddingBottom: "clamp(4rem, 10vw, 8rem)",
			}}
		>
			<div className="container">
				<div
					ref={headerRef}
					className="album-header"
					style={origin ? { opacity: 0 } : undefined}
				>
					<ul className="nav__links">
						<li>
							<Link href="/galleries">
								<IoMdArrowBack
									size={45}
									color="white"
								/>
							</Link>
						</li>
					</ul>
					<Title
						first={first}
						second={second}
					/>
				</div>

				<div
					ref={gridRef}
					className="album-grid"
				>
					{images
						.slice()
						.reverse()
						.map((src, i) => {
							const orientation = orientations[i];
							const scatter = scatterFor(src);
							const rotation = flownRotations?.get(src) ?? scatter.rotation;
							return (
								<div
									key={i}
									data-src={src}
									data-rotation={rotation}
									style={
										{
											// Empilement un peu désordonné (voir stackFor) ; l'étalement
											// depuis « Mon travail » le respecte aussi
											zIndex: stackFor(src, i, count),
											"--r": `${rotation}deg`,
											// "--tx": `${scatter.x}px`,
											// "--ty": `${scatter.y}px`,
										} as React.CSSProperties
									}
									className={`${
										origin
											? "album-grid__item--pending"
											: "album-grid__item--fade"
									} album-grid__item${
										orientation === "landscape"
											? " album-grid__item--landscape"
											: ""
									}`}
								>
									<Image
										src={src}
										alt={`${album} ${i + 1}`}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 700px"
										loading="eager"
										style={{ objectFit: "cover" }}
										onLoad={(e) => handleLoad(i, e)}
									/>
								</div>
							);
						})}
				</div>
			</div>
			<AlbumCounter
				gridRef={gridRef}
				total={count}
			/>
		</div>
	);
}
