"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageLoading } from "@/components/common/page-loading";
import { useMessaging } from "@/providers/socket-provider";
import { Queue } from "@/lib/request-queue";

const messageQueue = new Queue();

export default function MessagesPage(): JSX.Element {
	const { startUserInitializeConversation, startingNewChat, socket } = useMessaging();
	const tab = useMediaQuery("(min-width: 640px)");

	const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(searchParams as unknown as string);
	const userId = queryParams.get("userId");
	const initialized = useRef(false);

	useEffect(() => {
		if (socket && userId && !initialized.current) {
			initialized.current = true;
			messageQueue.addTask(() => startUserInitializeConversation(userId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, socket]);

	if (startingNewChat || userId) return <PageLoading color="#3055B3" />;

	return tab ? (
		<div className="flex size-full flex-col items-center justify-center bg-white p-6 pt-3">
			<div className="flex flex-col items-center gap-2 text-center text-body">
				<MessageCircle size={120} className="text-slate-400" />
				<span>Send private messages to a client or talent</span>
			</div>
		</div>
	) : (
		<div />
	);
}
