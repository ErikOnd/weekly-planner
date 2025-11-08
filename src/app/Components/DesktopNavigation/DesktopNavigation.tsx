import styles from "./DesktopNavigation.module.scss";

import logoText from "@assets/logo/logo-text.png";
import { Text } from "@atoms/Text/Text";
import Image from "next/image";

type DesktopNavigationProps = {
	rangeLabel: string;
};

export function DesktopNavigation({ rangeLabel }: DesktopNavigationProps) {
	return (
		<nav className={styles["desktop-navigation"]}>
			<div className={styles["logo-section"]}>
				<Image alt="logo" src={logoText} height={32} />
			</div>
			<div className={styles["main-section"]}>
				<Text size="xl">Weekly Overview</Text>
				<Text size="lg" className={styles["current-week"]}>{rangeLabel}</Text>
			</div>
		</nav>
	);
}
