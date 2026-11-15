"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { scatterFor, stackFor } from "@/lib/scatter";
import { startAlbumTransition, type FlyingPhoto } from "@/lib/albumTransition";
import { AnimatedImages } from "@/components/AnimatedImages";
import { Text, Title } from "@/components/Text";
import { useReveal } from "@/hooks/useReveal";

// Génère les chemins d'un album entier
/** « /images/galleries/x/12.webp » → 12 */
const fileNumber = (src: string) => Number(src.match(/(\d+)\.webp$/)?.[1] ?? 0);

function albumImages(album: string, count: number): string[] {
	return Array.from(
		{ length: count },
		(_, i) => `/images/galleries/${album}/${i + 1}.webp`
	);
}

const albums = [
	{ name: "activism", count: 24 },
	{ name: "events", count: 16 },
	{ name: "blurry", count: 12 },
	{ name: "design", count: 8 },
	{ name: "people", count: 16 },
	{ name: "international", count: 29 },
];

export default function Work() {
	const ref = useReveal({ stagger: 0.5 });
	const router = useRouter();

	// Les photos du paquet prennent leur envol (couche au-dessus des pages),
	// le reste s'efface et on ouvre l'album sans attendre.
	const openAlbum = (
		e: React.MouseEvent<HTMLAnchorElement>,
		name: string,
		count: number
	) => {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
		const link = e.currentTarget;
		const stack = link.querySelector<HTMLElement>(
			".animated-images__container"
		);
		if (!stack) return;
		e.preventDefault();

		// Pose exacte de chaque photo visible du paquet (position + rotation)
		const base = stack.getBoundingClientRect();
		const items = [
			...stack.querySelectorAll<HTMLElement>(".animated-images__item"),
		];
		const visible: FlyingPhoto[] = items.map((el, i) => {
			const x = Number(gsap.getProperty(el, "x")) || 0;
			const y = Number(gsap.getProperty(el, "y")) || 0;
			return {
				src: el.querySelector("img")!.getAttribute("src")!,
				pose: {
					left: base.left + el.offsetLeft + x,
					top: base.top + el.offsetTop + y,
					width: el.offsetWidth,
					height: el.offsetHeight,
					rotation: Number(gsap.getProperty(el, "rotation")) || 0,
				},
				z: 1000 + Number(el.style.zIndex || i),
			};
		});
		// Les autres photos de l'album attendent sous le paquet
		const center = visible[visible.length - 1]?.pose ?? {
			left: base.left,
			top: base.top,
			width: base.width,
			height: base.height,
			rotation: 0,
		};
		const shown = new Set(visible.map((p) => p.src));
		const hidden: FlyingPhoto[] = albumImages(name, count)
			.filter((src) => !shown.has(src))
			.map((src) => ({
				src,
				// même inclinaison que dans la grille de l'album
				pose: { ...center, rotation: scatterFor(src).rotation },
				// même rang que dans la grille de l'album : rien ne change
				// d'ordre pendant l'étalement ni à l'arrivée
				// (fichier n → case count - n de la grille, affichée à l'envers)
				z: stackFor(src, count - fileNumber(src), count),
			}));

		startAlbumTransition(name, [...hidden, ...visible]);
		stack.style.visibility = "hidden";

		const others = [
			...document.querySelectorAll<HTMLElement>(
				".galleries-grid > a, .galleries-header"
			),
		].filter((el) => el !== link);
		gsap.to([...others, link.querySelector("p")], {
			opacity: 0,
			duration: 0.3,
			ease: "power2.in",
		});
		router.push(`/galleries/${name}`);
	};

	return (
		<div
			style={{ minHeight: "100vh", paddingTop: "clamp(6rem, 15vw, 10rem)", paddingBottom: "clamp(4rem, 10vw, 8rem)" }}
		>
			<div className="container">
				<div
					className="galleries-header"
					style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}
				>
					<Text variant="subtitle">Petit échantillon...</Text>
					<Title
						first="Mon"
						second=" travail"
					/>
				</div>

				<div
					ref={ref as any}
					className="galleries-grid"
				>
					{albums.map((album) => (
						<Link
							href={`/galleries/${album.name}`}
							key={album.name}
							className="reveal"
							onClick={(e) => openAlbum(e, album.name, album.count)}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "1.5rem",
								width: "100%",
							}}
						>
							<AnimatedImages
								images={albumImages(album.name, album.count).slice(-5)}
								withAnimation={false}
							/>
							<p
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: "0.7rem",
									letterSpacing: "0.2em",
									textTransform: "uppercase",
									opacity: 0.5,
								}}
							>
								{album.name}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
