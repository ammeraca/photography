"use client";
import { AnimatedImages } from "@/components/AnimatedImages";
import Button from "@/components/Button";
import Skills from "@/components/home/Skills";
import Stats from "@/components/home/Stats";

export default function Home() {
	const imgSources = Array.from(
		{ length: 9 },
		(_, i) => `/images/galleries/first/${i + 1}.webp`
	);

	return (
		<div
			style={{
				minHeight: "100vh",
				paddingTop: "clamp(6rem, 15vw, 9rem)",
				paddingBottom: "clamp(4rem, 10vw, 8rem)",
			}}
		>
			<div className="container">
				<section className="home-hero">
					<header className="home-hero__head">
						<p className="home-hero__kicker">
							Photographe militante engagée et féministe
						</p>
						<h1 className="home-hero__title">
							Je suis <em>Emma.</em>
						</h1>
					</header>

					<div className="home-hero__photos">
						<AnimatedImages
							images={imgSources}
							shuffleOnClick
						/>
					</div>

					<div className="home-hero__about">
						<p style={bioStyle}>
							Photographe indépendante basée principalement à Paris, je
							travaille essentiellement dans le milieu militant et engagé. Mon
							travail explore le mouvement, les luttes, racontant des histoires
							et des émotions au travers de l&apos;instant, de la lumière.
						</p>
						<p style={bioStyle}>
							Disponible pour des projets évènementiels, des actions militantes,
							des portraits et toute commande privée.
						</p>
						<p style={{ ...bioStyle, overflowWrap: "anywhere" }}>
							Mon mail :{" "}
							<a
								href="mailto:amme.rachlin@gmail.com"
								className="home-hero__mail"
							>
								amme.rachlin@gmail.com
							</a>
						</p>
						<div style={{ marginTop: "2.5rem" }}>
							<Button link={"/galleries"}>Voir mon travail</Button>
						</div>
					</div>
				</section>

				<Skills />
				<Stats />
			</div>
		</div>
	);
}

const bioStyle: React.CSSProperties = {
	fontFamily: "var(--font-mono)",
	fontSize: "0.85rem",
	opacity: 0.65,
	lineHeight: 1.8,
	marginBottom: "1rem",
};
