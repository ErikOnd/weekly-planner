import styles from "./SmartTextarea.module.scss";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type SmartTextareaProps = {
	textareaDate: Date;
	autoFocus?: boolean;
};

export function SmartTextarea({ textareaDate, autoFocus = false }: SmartTextareaProps) {
	const [text, setText] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const weekdayLong = textareaDate.toLocaleDateString("en-US", { weekday: "long" });
	const uniqueId = `task-${uuidv4()}`;

	useEffect(() => {
		if (autoFocus && textareaRef.current) {
			textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
			textareaRef.current.focus();
		}
	}, [autoFocus, textareaDate]);

	return (
		<textarea
			ref={textareaRef}
			className={styles["smart-textarea"]}
			value={text}
			onChange={(e) => setText(e.target.value)}
			placeholder={`Add tasks for ${weekdayLong} ...`}
			name={uniqueId}
			id={uniqueId}
		/>
	);
}
