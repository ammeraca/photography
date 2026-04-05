"use client";
import Link from "next/link";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AnimatedImages } from "@/components/AnimatedImages";
import Button from "@/components/Button";

const skills = [
	"Militantisme",
	"Street Photography",
	"Portraits",
	"Voyage & Reportage",
	"Culture",
	"Noir & Blanc",
];

export default function Home() {
	const ref1 = useScrollReveal({ stagger: 0.5 });
	const ref2 = useScrollReveal({ stagger: 0.5 });

	const imgSources = [
		"/images/galleries/first/1.jpg",
		"/images/galleries/first/2.jpg",
		"/images/galleries/first/3.jpg",
		"/images/galleries/first/4.jpg",
		"/images/galleries/first/5.jpg",
		"/images/galleries/first/6.jpg",
		"/images/galleries/first/7.jpg",
		"/images/galleries/first/8.jpg",
		"/images/galleries/first/9.jpg",
	];

	return (
		<div
			style={{ minHeight: "100vh", paddingTop: "9rem", paddingBottom: "8rem" }}
		>
			<div className="container">
				<div style={heroStyle}>
					<div style={heroTextStyle}>
						<p style={eyebrowStyle}>
							- Photographe militante engagée et féministe -
						</p>
						<h1 style={titleStyle}>
							Je suis <br />
							<em style={{ color: "var(--red)" }}>Emma.</em>
						</h1>
						<p style={bioStyle}>
							Photographe indépendante basée en France, je travaille la lumière
							naturelle comme matière première. Mon travail explore les
							émotions, les territoires et les espaces entre les choses — là où
							la réalité devient récit.
						</p>
						<p style={bioStyle}>
							Disponible pour des projets éditoriaux, des portraits et des
							commandes privées.
						</p>
						<div style={{ marginTop: "3rem" }}>
							<Button link={"/galleries"}>Mon travail</Button>
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
					<p
						className="reveal"
						style={eyebrowStyle}
					>
						— Mes domaines -
					</p>
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
							{ n: "6+", label: "Années d'expérience" },
							{ n: "300+", label: "Projets réalisés" },
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
const heroImageStyle: React.CSSProperties = {
	position: "relative",
	height: "560px",
	overflow: "hidden",
};
const imageOverlayStyle: React.CSSProperties = {
	position: "absolute",
	inset: 0,
	background:
		"linear-gradient(135deg, rgba(192,57,43,0.15) 0%, transparent 60%)",
};
const eyebrowStyle: React.CSSProperties = {
	fontFamily: "var(--font-mono)",
	fontSize: "0.7rem",
	letterSpacing: "0.2em",
	opacity: 0.4,
	textTransform: "uppercase",
	marginBottom: "1.5rem",
};
const titleStyle: React.CSSProperties = {
	fontFamily: "var(--font-display)",
	fontWeight: 900,
	fontSize: "clamp(3.5rem, 7vw, 6rem)",
	lineHeight: 0.95,
	marginBottom: "2rem",
};
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
	fontSize: "2rem",
	fontWeight: 900,
	opacity: 0.15,
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
