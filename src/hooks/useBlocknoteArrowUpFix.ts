import type { BlockNoteEditor } from "@blocknote/core";
import { useEffect } from "react";

/**
 * Custom hook to fix arrow up navigation in Blocknote checklist items.
 * This is a workaround for a known Blocknote bug where arrow up doesn't work in todos.
 *
 * @param editor - The Blocknote editor instance
 */
export function useBlocknoteArrowUpFix(editor: BlockNoteEditor | null) {
	useEffect(() => {
		if (!editor) return;

		let isHandlingArrowUp = false;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "ArrowUp") return;
			if (isHandlingArrowUp) return;

			try {
				const textCursorPosition = editor.getTextCursorPosition();
				if (!textCursorPosition) return;

				const currentBlock = textCursorPosition.block;

				if (currentBlock.type !== "checkListItem") return;

				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				const blocks = editor.document;

				let currentIndex = -1;
				for (let i = 0; i < blocks.length; i++) {
					if (blocks[i].id === currentBlock.id) {
						currentIndex = i;
						break;
					}
				}

				if (currentIndex > 0) {
					isHandlingArrowUp = true;
					const previousBlock = blocks[currentIndex - 1];

					editor.setTextCursorPosition(previousBlock, "end");

					setTimeout(() => {
						isHandlingArrowUp = false;
					}, 10);
				} else {
					isHandlingArrowUp = false;
				}
			} catch (error) {
				console.error("Arrow up handler error:", error);
				isHandlingArrowUp = false;
			}
		};

		document.addEventListener("keydown", handleKeyDown, { capture: true });

		return () => {
			document.removeEventListener("keydown", handleKeyDown, { capture: true });
		};
	}, [editor]);
}
