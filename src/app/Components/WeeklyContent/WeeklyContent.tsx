"use client";

import styles from "./WeeklyContent.module.scss";

import type { Block } from "@blocknote/core";
import { DailyTextareaBlock } from "@components/DailyTextareaBlock/DailyTextareaBlock";

type NotesCache = {
	getNote: (dateString: string) => Promise<Block[] | undefined>;
	getCachedNote: (dateString: string) => { content: Block[] | undefined; loading: boolean } | undefined;
	updateNote: (dateString: string, content: Block[]) => void;
};

type WeeklyContentProps = {
	selectedDate: Date;
	notesCache: NotesCache;
};

export function WeeklyContent(props: WeeklyContentProps) {
	const { selectedDate, notesCache } = props;

	return (
		<div className={styles["weekly-content"]}>
			<DailyTextareaBlock textareaDate={selectedDate} autoFocus={true} notesCache={notesCache} />
		</div>
	);
}
