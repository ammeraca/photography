// Inclinaison et léger décalage « naturels » pour chaque photo de la grille.
// Calculés à partir du chemin de la photo : toujours les mêmes pour une photo
// donnée (pas de saut entre le rendu serveur et le navigateur).

function hash(str: string) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

/** Nombre pseudo-aléatoire stable dans [min, max]. */
function seeded(key: string, min: number, max: number) {
	return min + (hash(key) / 0xffffffff) * (max - min);
}

export type Scatter = { rotation: number; x: number; y: number };

export function scatterFor(src: string): Scatter {
	return {
		rotation: seeded(src + ":r", -4, 4),
		x: seeded(src + ":x", -14, 14),
		y: seeded(src + ":y", -14, 14),
	};
}

/** Les premières photos de l'album, bien rangées par-dessus tout le reste. */
const ON_TOP = 6;

/**
 * Ordre d'empilement dans la grille.
 * - Les ON_TOP premières photos sont au-dessus de toutes les autres, dans
 *   l'ordre (la 1re sur la 2e, la 2e sur la 3e…).
 * - Les suivantes : en général dans l'ordre aussi, mais pas toujours (comme
 *   des tirages posés à la main) : chacune peut passer devant ses 2-3
 *   voisines suivantes.
 */
export function stackFor(src: string, index: number, count: number) {
	// (+30 : reste toujours positif, sinon la photo passerait derrière la page)
	if (index < ON_TOP) return count * 10 + 100 + (ON_TOP - index);
	return 30 + (count - index) * 10 + Math.round(seeded(src + ":z", -28, 28));
}
