import styles from "./Text.module.scss";

import clsx from "clsx";
import { ReactNode } from "react";

type TextProps = {
	size?: "xs" | "sm" | "base" | "lg" | "xl";
	as?: "p" | "span" | "div";
	children: ReactNode;
	className?: string;
	fontWeight?: 300 | 500 | 600 | 700;
};

export function Text({
	size = "base",
	as = "div",
	children,
	className,
	fontWeight,
}: TextProps) {
	const Tag = as;
	return (
		<Tag
			className={clsx(
				styles[`text-${size}`],
				fontWeight && styles[`weight-${fontWeight}`],
				className,
			)}
		>
			{children}
		</Tag>
	);
}
