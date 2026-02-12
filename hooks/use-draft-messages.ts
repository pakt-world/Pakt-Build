"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

const DRAFT_CONFIG = {
	EXPIRY_TIME: 7 * 24 * 60 * 60 * 1000, // 7 days
	AUTO_SAVE_INTERVAL: 3000, // 3 seconds
};

const saveToLocalStorage = (key: string, value: string): void => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// fail silently
	}
};

const getFromLocalStorage = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};

const removeFromLocalStorage = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch {
		// fail silently
	}
};

interface UseDraftOptions {
	messageId: string;
	autoSaveInterval?: number;
	expiryTime?: number;
}

interface UseDraftReturn {
	draftMessage: string;
	setDraftMessage: Dispatch<SetStateAction<string>>;
	clearDraft: () => void;
	loaded: boolean;
}

export const useDraftMessages = ({
	messageId,
	autoSaveInterval = DRAFT_CONFIG.AUTO_SAVE_INTERVAL,
	expiryTime = DRAFT_CONFIG.EXPIRY_TIME,
}: UseDraftOptions): UseDraftReturn => {
	const [draftMessage, setDraftMessage] = useState<string>("");
	const [loaded, setLoaded] = useState(false);

	const draftKey = `draft_${messageId}`;

	// Reset local state when the conversation changes
	useEffect(() => {
		setDraftMessage("");
		setLoaded(false);
	}, [messageId]);

	// Do not save when we haven't loaded the current draft state
	const shouldPersist = loaded;

	const saveDraft = useCallback(() => {
		if (!shouldPersist) return;
		const trimmed = draftMessage.trim();
		if (!trimmed) {
			removeFromLocalStorage(draftKey);
			return;
		}
		const timestamp = Date.now();
		const draftData = { message: trimmed, timestamp };
		saveToLocalStorage(draftKey, JSON.stringify(draftData));
	}, [draftKey, draftMessage, shouldPersist]);

	const clearDraft = useCallback(() => {
		setDraftMessage("");
		removeFromLocalStorage(draftKey);
	}, [draftKey]);

	useEffect(() => {
		if (!messageId) return;
		const savedDraft = getFromLocalStorage(draftKey);
		if (savedDraft) {
			try {
				const parsed = JSON.parse(savedDraft);
				const isValid = Date.now() - parsed.timestamp < expiryTime;
				if (isValid) {
					setDraftMessage(parsed.message ?? "");
				} else {
					removeFromLocalStorage(draftKey);
				}
			} catch {
				removeFromLocalStorage(draftKey);
			}
		}
		setLoaded(true);
	}, [draftKey, expiryTime, messageId]);

	// Autosave on interval
	useEffect(() => {
		if (!loaded) return;
		const id = setInterval(() => {
			saveDraft();
		}, autoSaveInterval);
		return () => clearInterval(id);
	}, [autoSaveInterval, loaded, saveDraft]);

	// Save on change (debounced)
	useEffect(() => {
		if (!loaded) return;
		const id = setTimeout(() => {
			saveDraft();
		}, 300);
		return () => clearTimeout(id);
	}, [draftMessage, loaded, saveDraft]);

	return { draftMessage, setDraftMessage, clearDraft, loaded };
};
