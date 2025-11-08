import styles from "./WeeklySlider.module.scss";

import { Icon } from "@atoms/Icons/Icon";
import { Text } from "@atoms/Text/Text";

type WeeklySlider = {
	baseDate: Date;
	setBaseDate: (date: Date) => void;
	rangeLabel: string;
};

export default function WeeklySlider(props: WeeklySlider) {
	const { baseDate, setBaseDate, rangeLabel } = props;
	const dayInMs = 86400000;
	return (
		<div className={styles["weekly-slider"]}>
			<button
				className={styles["icon-button"]}
				onClick={() => setBaseDate(new Date(baseDate.getTime() - 7 * dayInMs))}
			>
				<Icon name="chevron-left" />
			</button>
			<Text>{rangeLabel}</Text>
			<button
				className={styles["icon-button"]}
				onClick={() => setBaseDate(new Date(baseDate.getTime() + 7 * dayInMs))}
			>
				<Icon name="chevron-right" />
			</button>
		</div>
	);
}
