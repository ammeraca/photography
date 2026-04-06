"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { Title } from "@/components/Text";
import { useReveal } from "@/hooks/useReveal";
import { albumsConfig } from "@/lib/albums";
import { useState } from "react";

function albumImages(album: string, count: number): string[] {
	return Array.from(
		{ length: count },
		(_, i) => `/images/galleries/${album}/${i + 1}.jpg`
	);
}

export default function AlbumPage() {
	const params = useParams();
	const router = useRouter();
	const album = params.album as string;
	const count = albumsConfig.find((a) => a.album === album)?.count ?? 0;
	const first = albumsConfig.find((a) => a.album === album)?.first ?? "";
	const second = albumsConfig.find((a) => a.album === album)?.second ?? "";
	const images = albumImages(album, count);
	const ref = useReveal({ stagger: 0.08 });

	const [orientations, setOrientations] = useState<
		Record<number, "landscape" | "portrait">
	>({});

	const handleLoad = (i: number, e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		setOrientations((prev) => ({
			...prev,
			[i]: img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
		}));
	};

	return (
		<div
			style={{ minHeight: "100vh", paddingTop: "9rem", paddingBottom: "8rem" }}
		>
			<div className="container">
				<div style={headerStyle}>
					<ul className="nav__links">
						<li>
							<a href="/galleries">
								<IoMdArrowBack
									size={45}
									color="white"
								/>
							</a>
						</li>
					</ul>
					<Title
						first={first}
						second={second}
					/>
				</div>

				<div
					ref={ref as any}
					style={gridStyle}
				>
					{images.map((src, i) => {
						const orientation = orientations[i];
						return (
							<div
								key={i}
								className="reveal"
								style={imgWrapStyle(orientation)}
							>
								<Image
									src={src}
									alt={`${album} ${i + 1}`}
									fill
									style={{ objectFit: "cover" }}
									onLoad={(e) => handleLoad(i, e)}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

const headerStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "1.5rem",
	marginBottom: "4rem",
};

const gridStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
	gridAutoRows: "auto",
	gap: "1rem",
};

const imgWrapStyle = (
	orientation: "landscape" | "portrait" | undefined
): React.CSSProperties => ({
	position: "relative",
	aspectRatio: orientation === "landscape" ? "3 / 2" : "2 / 3",
	overflow: "hidden",
	gridColumn: orientation === "landscape" ? "span 2" : "span 1",
	gridRow: "span 1",
	minHeight: orientation !== "landscape" ? undefined : "1fr",
});
