"use client";

import styles from "./SmartEditor.module.scss";

import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { filterSuggestionItems } from "@blocknote/core";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { getSlashMenuItemsWithAliases } from "@utils/blocknoteSlashMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { useBlocknoteArrowUpFix } from "@hooks/useBlocknoteArrowUpFix";

export default function SmartEditor() {
	const { theme, mounted } = useTheme();

	const editor = useCreateBlockNote({
		dictionary: {
			...en,
			placeholders: { ...en.placeholders, emptyDocument: "Start typing.." },
		},
	});

	useBlocknoteArrowUpFix(editor);

	if (typeof window === "undefined" || !mounted) return null;

	const aliasMap = { "Check list": ["todo", "to-do"] };

	return (
		<BlockNoteView editor={editor} className={styles["smart-editor"]} theme={theme} slashMenu={false}>
			<SuggestionMenuController
				triggerCharacter="/"
				getItems={async (query) => filterSuggestionItems(getSlashMenuItemsWithAliases(editor, aliasMap), query)}
			/>
		</BlockNoteView>
	);
}
