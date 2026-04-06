"use client";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

// const links = [
// 	{ href: "/", label: "Accueil" },
// 	{ href: "/galleries", label: "Galeries" },
//  { href: "/about", label: "À propos" },
// 	{ href: "/contact", label: "Contact" },
// ];

export default function Nav() {
	return (
		<nav className="nav">
			<Link
				href="/"
				className="nav__logo"
			>
				Emma
			</Link>
			<ul className="nav__links">
				<li>
					<a
						href="https://www.instagram.com/mama_clic"
						target="_blank"
					>
						<FaInstagram
							size={30}
							color="white"
						/>
					</a>
				</li>
			</ul>
		</nav>
	);
}
