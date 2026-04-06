"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AnimatedImages } from "@/components/AnimatedImages";
import Button from "@/components/Button";
import { Title, Text } from "@/components/Text";

const skills = [
	"Militantisme",
	"Street Photo",
	"Évènementiel",
	"Portraits",
	"Voyage & Reportage",
	"Culture",
];

export default function Home() {
	const ref1 = useScrollReveal({ stagger: 0.5 });
	const ref2 = useScrollReveal({ stagger: 0.5 });

	const imgSources = Array.from(
		{ length: 9 },
		(_, i) => `/images/galleries/first/${i + 1}.webp`
	);

	return (
		<div
			style={{ minHeight: "100vh", paddingTop: "9rem", paddingBottom: "8rem" }}
		>
			<div className="container">
				<div style={heroStyle}>
					<div style={heroTextStyle}>
						<Text variant="subtitle">
							- Photographe militante engagée et féministe -
						</Text>
						<Title
							first={"Je suis \n"}
							second="Emma."
						/>
						<p style={bioStyle}>
							Photographe indépendante basée principalement à Paris, je
							travaille essentiellement dans le milieu militant et engagé. Mon
							travail explore le mouvement, les luttes, racontant des histoires
							et des émotions au travers de l'instant, de la lumière.
						</p>
						<p style={bioStyle}>
							Disponible pour des projets évènementiels, des actions militantes,
							des portraits et toute commande privée.
						</p>
						<p style={bioStyle}>Mon mail : amme.rachlin@gmail.com</p>
						<div style={{ marginTop: "3rem" }}>
							<Button link={"/galleries"}>Voir mon travail</Button>
						</div>
					</div>

					<div>
						<AnimatedImages images={imgSources} />
					</div>
				</div>

				<section
					ref={ref1}
					style={sectionStyle}
				>
					<Text variant="subtitle">Mes domaines de prédilection</Text>
					<div style={skillsGridStyle}>
						{skills.map((s, i) => (
							<div
								key={s}
								className="reveal"
								style={skillStyle}
							>
								<span style={skillNumStyle}>0{i + 1}</span>
								<span style={skillNameStyle}>{s}</span>
							</div>
						))}
					</div>
				</section>

				{/* Stats */}
				<section
					ref={ref2}
					style={{
						...sectionStyle,
						borderTop: "1px solid rgba(255,255,255,0.06)",
						paddingTop: "5rem",
					}}
				>
					<div style={statsStyle}>
						{[
							{ n: "3+", label: "Années d'expérience" },
							{ n: "15+", label: "Projets réalisés" },
							{ n: "12", label: "Pays photographiés" },
						].map(({ n, label }) => (
							<div
								key={label}
								className="reveal"
								style={statItemStyle}
							>
								<span style={statNumStyle}>{n}</span>
								<span style={statLabelStyle}>{label}</span>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

const heroStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "1fr 400px",
	gap: "6rem",
	alignItems: "center",
	marginBottom: "8rem",
};
const heroTextStyle: React.CSSProperties = { maxWidth: "560px" };
const bioStyle: React.CSSProperties = {
	fontFamily: "var(--font-mono)",
	fontSize: "0.85rem",
	opacity: 0.65,
	lineHeight: 1.8,
	marginBottom: "1rem",
};
const sectionStyle: React.CSSProperties = { marginBottom: "6rem" };
const skillsGridStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
	gap: "1px",
	marginTop: "2rem",
	border: "1px solid rgba(255,255,255,0.06)",
};
const skillStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: "0.5rem",
	padding: "2rem 1.5rem",
	borderRight: "1px solid rgba(255,255,255,0.06)",
};
const skillNumStyle: React.CSSProperties = {
	fontFamily: "var(--font-display)",
	color: "var(--red)",
	fontSize: "2rem",
	fontWeight: 900,
	opacity: 0.5,
	lineHeight: 1,
};
const skillNameStyle: React.CSSProperties = {
	fontFamily: "var(--font-display)",
	fontSize: "1.1rem",
	fontWeight: 900,
};
const statsStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	gap: "2rem",
};
const statItemStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: "0.5rem",
	padding: "2rem 0",
	borderBottom: "3px solid var(--red)",
};
const statNumStyle: React.CSSProperties = {
	fontFamily: "var(--font-display)",
	fontSize: "3.5rem",
	fontWeight: 900,
	lineHeight: 1,
};
const statLabelStyle: React.CSSProperties = {
	fontFamily: "var(--font-mono)",
	fontSize: "0.7rem",
	letterSpacing: "0.15em",
	opacity: 0.5,
	textTransform: "uppercase",
};
