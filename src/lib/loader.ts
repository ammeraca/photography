// Permet aux animations de la page d'attendre la fin du loader.
const EVENT = "loader:done";
let finished = false;

export function markLoaderDone() {
	finished = true;
	window.dispatchEvent(new Event(EVENT));
}

/** Appelle `cb` quand le loader a disparu (immédiatement s'il l'est déjà). Renvoie une fonction de nettoyage. */
export function onLoaderDone(cb: () => void): () => void {
	if (finished) {
		cb();
		return () => {};
	}
	window.addEventListener(EVENT, cb, { once: true });
	return () => window.removeEventListener(EVENT, cb);
}
