"use client";
import { useEffect } from "react";

/**
 * Décourage le téléchargement des photos : pas de menu clic droit
 * (« Enregistrer l'image sous… ») ni de glisser-déposer vers le bureau.
 * L'appui long sur mobile est bloqué en CSS (voir « Protection des photos »
 * dans globals.css).
 * Ce n'est qu'un frein : le vrai garde-fou, ce sont le filigrane et la
 * résolution réduite des fichiers (scripts/web_photos.py).
 */
export default function ImageProtection() {
	useEffect(() => {
		const isPhoto = (target: EventTarget | null) =>
			target instanceof Element &&
			(target.tagName === "IMG" ||
				!!target.closest("picture, .flying-photo, .album-grid__item"));

		const block = (e: Event) => {
			if (isPhoto(e.target)) e.preventDefault();
		};
		document.addEventListener("contextmenu", block);
		document.addEventListener("dragstart", block);
		return () => {
			document.removeEventListener("contextmenu", block);
			document.removeEventListener("dragstart", block);
		};
	}, []);

	return null;
}
