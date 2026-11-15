import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Loader from "@/components/Loader";
import AlbumTransitionLayer from "@/components/AlbumTransitionLayer";
import ImageProtection from "@/components/ImageProtection";

export const metadata: Metadata = {
	title: "Emma - Photographe",
	description:
		"Photographe militante engagée, disponible pour vos besoins et projets.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="fr"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<head>
				{/* Masque le loader avant l'affichage s'il a déjà été vu dans cet onglet */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{if(sessionStorage.getItem("loader-seen"))document.documentElement.classList.add("loader-seen")}catch(e){}`,
					}}
				/>
			</head>
			<body className="min-h-full flex flex-col">
				<Loader />
				<Cursor />
				<Nav />
				{children}
				<AlbumTransitionLayer />
				<ImageProtection />
			</body>
		</html>
	);
}
