import { ReactNode } from "react";

type TextProps = {
	children: ReactNode;
	variant?: "subtitle" | "paragraph";
};

type TitleProps = {
	first: string;
	second: string;
};

export const Title = ({ first, second }: TitleProps) => (
	<h1
		style={{
			fontFamily: "var(--font-display)",
			fontWeight: 900,
			fontSize: "clamp(3.5rem, 7vw, 6rem)",
			lineHeight: 0.95,
			marginBottom: "2rem",
		}}
	>
		{first}
		<em style={{ color: "var(--red)" }}>{second}</em>
	</h1>
);

export const Text = ({ children, variant = "paragraph" }: TextProps) => {
	switch (variant) {
		case "subtitle": {
			return (
				<p
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "0.7rem",
						letterSpacing: "0.2em",
						opacity: 0.4,
						textTransform: "uppercase",
						marginBottom: "1.5rem",
					}}
				>
					{children}
				</p>
			);
		}
		case "paragraph": {
			return (
				<p
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "0.7rem",
						letterSpacing: "0.2em",
						opacity: 0.4,
						textTransform: "uppercase",
						marginBottom: "1.5rem",
					}}
				>
					{children}
				</p>
			);
		}
	}
};
