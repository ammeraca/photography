"use client";
import { AnimatedImages } from "@/components/AnimatedImages";
import { Text, Title } from "@/components/Text";
import { useReveal } from "@/hooks/useReveal";

// Génère les chemins d'un album entier
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

	console.log(albumImages("first", 9));

	return (
		<div
			style={{ minHeight: "100vh", paddingTop: "10rem", paddingBottom: "8rem" }}
		>
			<div className="container">
				<div style={{ marginBottom: "5rem" }}>
					<Text variant="subtitle">Petit échantillon...</Text>
					<Title
						first="Mon"
						second=" travail"
					/>
				</div>

				<div
					ref={ref as any}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: "6rem 10rem",
						justifyItems: "center",
					}}
				>
					{albums.map((album) => (
						<a
							href={`/galleries/${album.name}`}
							key={album.name}
							className="reveal"
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "1.5rem",
								width: "100%",
							}}
						>
							<AnimatedImages
								images={albumImages(album.name, album.count)}
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
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
