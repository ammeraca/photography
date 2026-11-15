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
			style={{ minHeight: "100vh", paddingTop: "clamp(6rem, 15vw, 9rem)", paddingBottom: "clamp(4rem, 10vw, 8rem)" }}
		>
			<div className="container">
				<div className="album-header">
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
					className="album-grid"
				>
					{images
						.slice()
						.reverse()
						.map((src, i) => {
							const orientation = orientations[i];
							return (
								<div
									key={i}
									className={`reveal album-grid__item${
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
		</div>
	);
}
