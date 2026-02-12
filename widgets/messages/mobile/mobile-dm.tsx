"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ComponentType, Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import { DropzoneInputProps } from "react-dropzone/.";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChatBoxHeader } from "../_shared/chatbox-header";
import { ExtendedRegularMessage, Message, RowVirtualizerDynamic } from "@/hooks/use-virtualized-messages";
import { MemoizedTextAreaInput } from "../_shared/text-area-input";
import { CombinedConversationResponseProps, RecipientResponseProps } from "@/providers/socket-types";
import { useDraftMessages } from "@/hooks/use-draft-messages";

interface MobileDMProps {
	messageId: string;
	inputMessage: string;
	setInputMessage: Dispatch<SetStateAction<string>>;
	sender: RecipientResponseProps;
	currentConversation: CombinedConversationResponseProps;
	flattenedMessages: Message[];
	Bubble: ComponentType<{ message: ExtendedRegularMessage }>;
	keyboardTyperId: string;
	thisUserIsTyping: string;

	handleSendMessage: () => void;
	handleTyping: () => void;
	getRootProps: <T extends DropzoneInputProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	open: () => void;
	imageFiles: any[];
	removeImg: (id: string) => void;
}

export const MobileDM = ({
	messageId,
	inputMessage,
	setInputMessage,
	sender,
	currentConversation,
	flattenedMessages,
	Bubble,
	keyboardTyperId,
	thisUserIsTyping,
	handleSendMessage,
	handleTyping,
	getRootProps,
	getInputProps,
	open,
	imageFiles,
	removeImg,
}: MobileDMProps) => {
	const { draftMessage, setDraftMessage, clearDraft, loaded: draftLoaded } = useDraftMessages({ messageId });
	const prevMessageId = useRef<string | null>(null);

	useEffect(() => {
		if (!draftLoaded) return;
		if (prevMessageId.current !== messageId) {
			setInputMessage(draftMessage ?? "");
			prevMessageId.current = messageId;
		}
	}, [draftLoaded, draftMessage, messageId, setInputMessage]);

	useEffect(() => {
		if (!draftLoaded) return;
		setDraftMessage(inputMessage);
	}, [draftLoaded, inputMessage, setDraftMessage]);

	const handleSendWithDraft = useCallback(() => {
		handleSendMessage();
		clearDraft();
	}, [clearDraft, handleSendMessage]);

	return (
		<div className="m-0 flex h-[100dvh] w-full flex-col overflow-y-auto bg-white/90 p-0">
			<ChatBoxHeader
				sender={sender}
				time={currentConversation?.createdAt ?? "0"}
				className="!z-50 h-[77px] w-full bg-white px-4 !pb-0"
			/>

			{flattenedMessages.length === 0 ? (
				<div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
					<div className="text-2xl text-slate-300">No messages yet</div>
				</div>
			) : (
				<div className="scrollbar-hide relative flex w-full flex-1 flex-col overflow-y-auto">
					<RowVirtualizerDynamic messages={flattenedMessages} Bubble={Bubble} />
				</div>
			)}
			{keyboardTyperId !== "" && keyboardTyperId !== undefined && keyboardTyperId !== null && (
				<p className="relative block p-2 text-xs font-normal italic text-sky sm:hidden">{thisUserIsTyping}</p>
			)}
			<MemoizedTextAreaInput
				text={inputMessage}
				setText={setInputMessage}
				handleSendMessage={handleSendWithDraft}
				handleTyping={handleTyping}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				open={open}
				imageFiles={imageFiles}
				removeImg={removeImg}
				recipientName={sender.firstName}
			/>
		</div>
	);
};
