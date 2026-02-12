"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getConversationHeader } from "@/lib/actions/messages";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";
import type { CombinedConversationResponseProps } from "@/providers/socket-types";
import { ChatListSkeleton } from "@/components/common/skeletons/chat-list-skeleton";

import { ChatListItem } from "./_components/chat-item";
import { ChatListSearch } from "./_components/chat-list-search";

export const ChatList = (): JSX.Element => {
	const pathname = usePathname();
	const { allConversations, loadingChats } = useMessaging();
	const { user } = useUserState();
	const { _id: loggedInUser } = user || { _id: "" };

	const [searchChat, setSearchChat] = useState<string>("");
	const [convos, setConvos] = useState<CombinedConversationResponseProps[]>(allConversations);

	// Function to handle search
	const searchHandler = (chat: string): void => {
		setSearchChat(chat);
	};

	useEffect(() => {
		// If search is empty, set chat to all conversations
		if (searchChat.length === 0) {
			setConvos(allConversations);
		} else {
			// Filter chat based on search
			const searchResult = allConversations.filter((c) => {
				const sender = getConversationHeader(c, loggedInUser);
				return (sender?.title || "").toLowerCase().includes(searchChat.toLowerCase());
			});
			setConvos(searchResult);
		}
	}, [searchChat, allConversations, loggedInUser]);

	// Sort data and make sure the latest chat or new incoming message at the top of the list
	useEffect(() => {
		const sortedConversations = convos.sort((a, b) => {
			const aMessages = a.messages || [];
			const bMessages = b.messages || [];
			const aLastMessage = aMessages[aMessages.length - 1];
			const bLastMessage = bMessages[bMessages.length - 1];

			if (!aLastMessage || !bLastMessage) return 0;

			return new Date(bLastMessage.createdAt).getTime() - new Date(aLastMessage.createdAt).getTime();
		});

		setConvos(sortedConversations);
	}, [convos]);

	useEffect(() => {
		window.scroll(0, 0);
	}, [pathname]);

	return (
		<div
			className={`chat-list relative z-40 flex h-full shrink-0 flex-col divide-line bg-white max-sm:w-full max-sm:!overflow-hidden
				sm:basis-[370px] sm:rounded-lg sm:rounded-r-none sm:border ${convos.length > 6 ? "max-sm:pb-[64px]" : ""}`}
		>
			<ChatListSearch searchChat={searchChat} searchHandler={searchHandler} />
			<div className="flex w-full grow flex-col overflow-y-auto border-t max-sm:mt-[70px] sm:h-full">
				{loadingChats && <ChatListSkeleton />}
				{convos.map((conversation: CombinedConversationResponseProps) => (
					<ChatListItem key={conversation._id} conversation={conversation} loggedInUser={loggedInUser} />
				))}
			</div>
		</div>
	);
};
