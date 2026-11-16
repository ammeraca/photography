"use client";
import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const MAIL = "amme.rachlin@gmail.com";
const INSTAGRAM = "https://www.instagram.com/mama_clic";

const parisTime = new Intl.DateTimeFormat("fr-FR", {
	timeZone: "Europe/Paris",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

/** Heure actuelle à Paris, mise à jour chaque seconde (côté navigateur uniquement). */
function useParisTime() {
	const [time, setTime] = useState<string | null>(null);
	useEffect(() => {
		const tick = () => setTime(parisTime.format(new Date()));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);
	return time;
}

export default function Footer() {
	const time = useParisTime();
	// Écrans tactiles : un appui affiche / masque le lieu et l'heure
	const [open, setOpen] = useState(false);

	return (
		<footer className="footer">
			<div className="container">
				<p className="footer__kicker">Contact</p>
				<a
					href={`mailto:${MAIL}`}
					className="footer__mail"
				>
					{MAIL}
				</a>

				<div className="footer__bar">
					<a
						href={INSTAGRAM}
						target="_blank"
						rel="noopener noreferrer"
						className="footer__link"
					>
						<FaInstagram aria-hidden="true" />
						<span>@mama_clic</span>
						<FiArrowUpRight
							className="footer__arrow"
							aria-hidden="true"
						/>
					</a>

					<button
						type="button"
						className={`footer__where${open ? " is-open" : ""}`}
						onClick={() => setOpen((o) => !o)}
						aria-label={`Where to find me : Paris, France${time ? `, ${time}` : ""}`}
					>
						<span className="footer__where-roll">
							<span className="footer__where-label">Where to find me</span>
							<span className="footer__where-info">
								<span className="footer__dot" />
								Paris, France
								<span className="footer__sep">—</span>
								<time>{time ?? "--:--:--"}</time>
							</span>
						</span>
					</button>

					<span className="footer__copy">
						© {new Date().getFullYear()} Mama_clic
					</span>
				</div>
			</div>
		</footer>
	);
}
