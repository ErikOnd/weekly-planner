import styles from "./Checkbox.module.scss";

import { Text } from "@atoms/Text/Text";
import { useId } from "react";

type CheckboxProps = {
	label: string;
};

export default function Checkbox({ label }: CheckboxProps) {
	const id = useId();

	return (
		<label className={styles["checkbox"]}>
			<input type="checkbox" id={id} />
			<span className={styles["checkmark"]}></span>
			<Text className={styles["label"]}>{label}</Text>
		</label>
	);
}
