import styles from "./TaskItem.module.scss";

import Checkbox from "@atoms/Checkbox/Checkbox";

type TaskItemProps = {
	taskName: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
};

export function TaskItem(props: TaskItemProps) {
	const { taskName, checked, onChange } = props;
	return (
		<div className={styles["task-item"]}>
			<Checkbox label={taskName} checked={checked} onChange={onChange} />
		</div>
	);
}
