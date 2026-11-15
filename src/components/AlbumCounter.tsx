"use client";
import {
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type RefObject,
} from "react";
import {
	getAlbumTransition,
	subscribeAlbumTransition,
} from "@/lib/albumTransition";

/** Compteur « 07 / 24 » + barre de progression, en bas à droite de l'album. */
export default function AlbumCounter({
	gridRef,
	total,
}: {
	gridRef: RefObject<HTMLElement | null>;
	total: number;
}) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [current, setCurrent] = useState(1);
	const [ready, setReady] = useState(false);
	const flying = useSyncExternalStore(
		subscribeAlbumTransition,
		() => !!getAlbumTransition(),
		() => false
	);

	// Apparaît en douceur une fois la page posée (et l'étalement terminé)
	useEffect(() => {
		const t = setTimeout(() => setReady(true), 600);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		const grid = gridRef.current;
		const root = rootRef.current;
		if (!grid || !root) return;
		const items = [...grid.querySelectorAll<HTMLElement>(".album-grid__item")];
		let raf = 0;

		const update = () => {
			raf = 0;
			const vh = window.innerHeight;
			const atEnd =
				window.scrollY + vh >= document.documentElement.scrollHeight - 4;
			// Photos déjà « découvertes » : leur haut est passé au-dessus des 2/3 de l'écran
			let seen = 0;
			for (const el of items) {
				if (el.getBoundingClientRect().top < vh * 0.66) seen++;
			}
			setCurrent(atEnd ? total : Math.max(1, Math.min(total, seen)));

			const r = grid.getBoundingClientRect();
			const span = r.height - vh;
			const p = atEnd
				? 1
				: span > 0
					? Math.min(1, Math.max(0, -r.top / span))
					: 1;
			root.style.setProperty("--p", p.toFixed(4));
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [gridRef, total]);

	if (!total) return null;
	const pad = (n: number) => String(n).padStart(2, "0");

	return (
		<div
			ref={rootRef}
			className={`album-counter${ready && !flying ? " is-visible" : ""}`}
			aria-hidden="true"
		>
			<span>
				<span className="album-counter__current">{pad(current)}</span>
				<span className="album-counter__total"> / {pad(total)}</span>
			</span>
			<span className="album-counter__track">
				<span className="album-counter__bar" />
			</span>
		</div>
	);
}
