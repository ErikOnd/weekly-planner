"use client";

import type { Block } from "@blocknote/core";
import { useCallback, useState } from "react";
import { getDailyNote } from "../app/actions/dailyNotes";

type DailyNotesState = {
	[dateString: string]: {
		content: Block[] | undefined;
		loading: boolean;
	};
};

export function useDailyNotesCache() {
	const [notes, setNotes] = useState<DailyNotesState>({});

	const getNote = useCallback(async (dateString: string): Promise<Block[] | undefined> => {
		const existing = notes[dateString];
		if (existing !== undefined) {
			return existing.content;
		}

		setNotes(prev => ({
			...prev,
			[dateString]: { content: undefined, loading: true },
		}));

		try {
			const note = await getDailyNote(dateString);
			const content = note?.content as Block[] | undefined;

			setNotes(prev => ({
				...prev,
				[dateString]: { content, loading: false },
			}));

			return content;
		} catch (error) {
			console.error("Error fetching daily note:", error);
			setNotes(prev => ({
				...prev,
				[dateString]: { content: undefined, loading: false },
			}));
			return undefined;
		}
	}, [notes]);

	const updateNote = useCallback((dateString: string, content: Block[]) => {
		setNotes(prev => ({
			...prev,
			[dateString]: { content, loading: false },
		}));
	}, []);

	const getCachedNote = useCallback((dateString: string) => {
		return notes[dateString];
	}, [notes]);

	return {
		notes,
		getNote,
		getCachedNote,
		updateNote,
	};
}
