/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useLogoutConfirmationStore } from "@/lib/store/misc";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "@/lib/utils";

// const SIX_MINUTES_IN_MS = 6 * 60 * 1000;
const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

export const useInactivityTimeout = () => {
	const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
	const { showLogoutConfirmation, setShowLogoutConfirmation } = useLogoutConfirmationStore();

	const router = useRouter();
	const queryClient = useQueryClient();

	const notLoggingOut = (): void => {
		setShowLogoutConfirmation(false);
	};

	const onIdle = (): void => {
		setIsTimeoutModalOpen(false);
		queryClient.clear();
		router.push("/");
		deleteCookie(AUTH_TOKEN_KEY);
	};

	const onActive = (): void => {
		setIsTimeoutModalOpen(false);
	};

	const onPrompt = (): void => {
		setIsTimeoutModalOpen(true);
	};

	const { getRemainingTime, activate } = useIdleTimer({
		onIdle,
		onActive,
		onPrompt,
		timeout: THIRTY_MINUTES_IN_MS,
		promptBeforeIdle: THIRTY_MINUTES_IN_MS / 2,
	});

	const stayActive = (): void => {
		setIsTimeoutModalOpen(false);
		setTimeout(() => {
			activate();
		}, 1000);
	};

	return {
		getRemainingTime,
		isTimeoutModalOpen,
		showLogoutConfirmation,
		notLoggingOut,
		stayActive,
	};
};
