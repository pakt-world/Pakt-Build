"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatTimestampForDisplay, getPreviewByType2 } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { CombinedConversationResponseProps } from "@/providers/socket-types";
import { getLastMessage, getLastMessageTime, getSender } from "@/lib/actions/messages";
import { getUnreadCount } from "@/hooks/use-unread-chats";
import { MediaEnums } from "@/lib/enums";
import { useDraftMessages } from "@/hooks/use-draft-messages";

interface ChatListItemProps {
	conversation: CombinedConversationResponseProps;
	loggedInUser: string;
}

export const ChatListItemComponent = ({ conversation, loggedInUser }: ChatListItemProps) => {
	const router = useRouter();

	const pathname = usePathname();

	const urlChatId = pathname.split("/")[2];
	const isActiveChat = urlChatId === conversation._id;

	const sender = getSender(loggedInUser, conversation.recipients);

	const lastMessage = getLastMessage(conversation.messages ?? []);
	const lastMessageTime = getLastMessageTime(conversation.messages ?? []);
	const lmt = lastMessageTime !== "" ? formatTimestampForDisplay(lastMessageTime) : "";
	const socketStatus = sender?.socket?.status;
	const unreadCount = getUnreadCount(conversation, loggedInUser);

	const { draftMessage } = useDraftMessages({
		messageId: conversation._id || "",
	});

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(`/messages/${conversation._id}`);
			}}
			className="border-b"
		>
			<div
				className={`flex w-full items-center gap-2 border-l-4 px-3 py-3 duration-200 hover:bg-[#F4F4FD]
					${isActiveChat ? "border-primary bg-primary bg-opacity-10" : "border-transparent bg-white"}`}
			>
				<TalentProfile
					score={sender.score ?? 0}
					src={sender.profileImage?.url}
					size="sm"
					url={`/talents/${sender._id}`}
				/>

				<div className="flex grow flex-col">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<div className="text-base font-medium text-title">{`${sender?.firstName}`}</div>
							{unreadCount > 0 && (
								<div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
									{unreadCount}
								</div>
							)}
						</div>
						<div className="flex flex-col items-end gap-2">
							<p className="text-xs text-body">{lmt}</p>
							<div
								className={`h-2 w-2 rounded-full ${socketStatus === "ONLINE" ? "bg-green-500" : socketStatus === "OFFLINE" ? "bg-gray-500" : ""}`}
							/>
						</div>
					</div>
					{draftMessage ? (
						<div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-primary">
							Draft: {draftMessage.length > 30 ? `${draftMessage.slice(0, 30)}...` : draftMessage}
						</div>
					) : lastMessage === MediaEnums.IMAGE_PNG ||
					  lastMessage === MediaEnums.PDF ||
					  lastMessage === MediaEnums.DOC ||
					  lastMessage === MediaEnums.IMAGE_JPEG ||
					  lastMessage === MediaEnums.IMAGE_JPG ? (
						<Image
							className="!h-[30px] !w-[30px] rounded-lg bg-opacity-30 !object-contain"
							src={(lastMessage ?? "") && getPreviewByType2(lastMessage ?? "").preview}
							alt="upload-picture"
							width={30}
							height={30}
							objectFit="contain"
						/>
					) : (
						<div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-body">
							{lastMessage && lastMessage.length > 30 ? `${lastMessage.slice(0, 30)}...` : lastMessage}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
const typedMemo: <T>(c: T) => T = React.memo;
export const ChatListItem = typedMemo(ChatListItemComponent);
