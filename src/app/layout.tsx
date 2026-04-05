import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

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
		<html lang="fr">
			<body className="min-h-full flex flex-col">
				<Cursor />
				<Nav />
				{children}
			</body>
		</html>
	);
}
