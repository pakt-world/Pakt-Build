"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import ChatSkeleton from "@/components/common/skeletons/chat-skeleton";
import { RowVirtualizerDynamic } from "@/hooks/use-virtualized-messages";
import { getSender, whichUserTyping } from "@/lib/actions/messages";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";
import { ChatBoxHeader } from "@/widgets/messages/_shared/chatbox-header";
import { MemoizedTextAreaInput } from "@/widgets/messages/_shared/text-area-input";
import { MobileDM } from "@/widgets/messages/mobile/mobile-dm";
import { Bubble } from "@/widgets/messages/_shared/chat-bubble";

interface Props {
	params: {
		"message-id": string;
	};
}
export default function ChatPage({ params }: Props): JSX.Element {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const isClient = useIsClient();
	const { "message-id": messageId } = params;
	const {
		currentConversation,
		loadingChats,
		markUserMessageAsSeen,
		handleTyping,
		keyboardTyperId,
		inputMessage,
		setInputMessage,
		handleSendMessage,
		flattenedMessages,
		getRootProps,
		getInputProps,
		open,
		removeImg,
		imageFiles,
	} = useMessaging();

	const { user } = useUserState();
	const { _id: loggedInUser } = user || { _id: "" };

	useEffect(() => {
		if (!loadingChats && currentConversation._id === messageId) {
			markUserMessageAsSeen(messageId);
		}
	}, [loadingChats, currentConversation._id, messageId, markUserMessageAsSeen]);

	const sender = getSender(loggedInUser, currentConversation.recipients);
	const thisUserIsTyping = whichUserTyping(
		keyboardTyperId,
		loggedInUser,
		currentConversation._id ?? "",
		messageId,
		sender
	);

	if (!isClient || loadingChats) return <ChatSkeleton />;

	if (isMobile) {
		return (
			<MobileDM
				messageId={messageId}
				inputMessage={inputMessage}
				setInputMessage={setInputMessage}
				sender={sender}
				currentConversation={currentConversation}
				flattenedMessages={flattenedMessages}
				Bubble={Bubble}
				keyboardTyperId={keyboardTyperId}
				thisUserIsTyping={thisUserIsTyping}
				handleSendMessage={handleSendMessage}
				handleTyping={handleTyping}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				open={open}
				imageFiles={imageFiles}
				removeImg={removeImg}
			/>
		);
	}

	return (
		<div className="flex size-full grow flex-col p-6 pt-3">
			<ChatBoxHeader
				sender={sender}
				time={currentConversation?.createdAt ?? "0"}
				className="relative justify-between"
			/>
			{flattenedMessages.length === 0 ? (
				<div className="flex h-full w-full grow flex-col items-center justify-center gap-1 px-6">
					<div className="text-2xl text-slate-300">No messages yet</div>
				</div>
			) : (
				<RowVirtualizerDynamic messages={flattenedMessages} Bubble={Bubble} />
			)}
			<MemoizedTextAreaInput
				text={inputMessage}
				setText={setInputMessage}
				handleSendMessage={handleSendMessage}
				handleTyping={handleTyping}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				open={open}
				imageFiles={imageFiles}
				removeImg={removeImg}
				recipientName={sender.firstName}
			/>

			{keyboardTyperId !== "" && keyboardTyperId !== undefined && keyboardTyperId !== null && (
				<p className="absolute bottom-[0.5rem] hidden text-xs font-normal italic text-sky sm:block">
					{thisUserIsTyping}
				</p>
			)}
		</div>
	);
}
