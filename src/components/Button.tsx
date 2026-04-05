import Link from "next/link";
import { ReactNode, useRef } from "react";

type TextProps = {
	children: ReactNode;
	link: string;
};

export default function Button({ children, link }: TextProps) {
	const btnRef = useRef<HTMLAnchorElement>(null);

	const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const btn = btnRef.current;
		if (!btn) return;

		const rect = btn.getBoundingClientRect();
		const diagonal = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;
		btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
		btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
		btn.style.setProperty("--size", `${diagonal}px`);
		btn.classList.add("is-hovering");
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const btn = btnRef.current;
		if (!btn) return;

		const rect = btn.getBoundingClientRect();
		btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
		btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
		btn.classList.remove("is-hovering");
	};

	return (
		<Link
			ref={btnRef}
			href={link}
			className="btn btn--red"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
		</Link>
	);
}
