// Transition « Mon travail » → album.
// Les photos qui s'étalent vivent dans <AlbumTransitionLayer /> (layout), au-dessus
// des pages : elles restent donc à l'écran pendant le changement de page.

export type Pose = {
	left: number;
	top: number;
	width: number;
	height: number;
	rotation: number;
};

export type FlyingPhoto = {
	src: string;
	pose: Pose;
	z: number; // ordre d'empilement (le plus grand = sur le dessus)
};

type Transition = {
	album: string;
	photos: FlyingPhoto[];
	targets: Map<string, HTMLElement> | null;
};

let current: Transition | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribeAlbumTransition(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getAlbumTransition() {
	return current;
}

/** Page « Mon travail » : les photos du paquet prennent leur envol. */
export function startAlbumTransition(album: string, photos: FlyingPhoto[]) {
	current = { album, photos, targets: null };
	emit();
}

/** Page album : une transition est-elle en cours pour cet album ? */
export function isAlbumTransitionPending(album: string) {
	return !!current && current.album === album && !current.targets;
}

/** Page album : voici où chaque photo (par src) doit se poser. */
export function landAlbumTransition(
	album: string,
	targets: Map<string, HTMLElement>
) {
	if (!current || current.album !== album || current.targets) return;
	current = { ...current, targets }; // nouvel objet : React voit le changement
	emit();
}

export function endAlbumTransition() {
	current = null;
	emit();
}
