"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useParams, usePathname, useRouter } from "next/navigation";
import type React from "react";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import useFileDropzone from "@/hooks/use-file-dropzone";
import { useMessageQueue } from "@/hooks/use-message-queue";
import type { DateMessage, ExtendedRegularMessage } from "@/hooks/use-virtualized-messages";
import {
	getConversationById,
	getRecipient,
	getSender,
	groupMessagesByDate,
	parseMessages,
	removeSingleRecipientMessages,
} from "@/lib/actions/messages";
import { ConversationEnums, ConversationTypeEnums, MessageTypeEnums } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";

import type {
	CombinedAttachmentType,
	CombinedConversationResponseProps,
	CombinedMessageProps,
	GetAllChatsResponseProps,
	GetAllChatsResponseProps2,
	InitializeMessageProps,
	PopUpConversationDataProps,
	SocketContextType,
	SocketResponse,
	TemporaryBubbleProps,
} from "./socket-types";
import useSocket from "@/hooks/use-socket";

interface TypingProps {
	message: string;
	sender: string;
}

const MIN_LEN = 25;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// @ts-expect-error --- TODO: Fix this
const defaultContext: SocketContextType = {};

export const SocketContext = createContext<SocketContextType>(defaultContext);

const status = "pending";

export const MessagingProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const typingTimer = useRef<NodeJS.Timeout | null>(null);
	const router = useRouter();
	const initiated = useRef(false);
	const pathname = usePathname();
	const params = useParams();
	const messageId = params["message-id"];

	const { user } = useUserState();
	const { _id: loggedInUser } = user ?? { _id: "" };

	// connect to chat socket
	const socket = useSocket(SOCKET_URL as string);

	const [startingNewChat, setStartingNewChat] = useState(false);

	const [allConversations, setAllConversations] = useState<CombinedConversationResponseProps[]>([]);

	// Derived current conversation from allConversations using messageId from URL
	const currentConversation = useMemo(() => {
		if (!messageId) {
			return {
				_id: "",
				type: "",
				recipients: [],
				messages: [],
				createdAt: "",
				updatedAt: "",
				__v: 0,
				title: "",
				description: "",
			};
		}
		return (
			getConversationById(messageId as string, allConversations) || {
				_id: "",
				type: "",
				recipients: [],
				messages: [],
				createdAt: "",
				updatedAt: "",
				__v: 0,
				title: "",
				description: "",
			}
		);
	}, [messageId, allConversations]);

	const [messageQueue, setMessageQueue] = useState<TemporaryBubbleProps[]>([]);
	const [temporaryMessages, setTemporaryMessages] = useState<TemporaryBubbleProps[]>([]);

	const [loadingChats, setLoadingChats] = useState<boolean>(true);

	const [inputMessage, setInputMessage] = useState<string>("");
	const [keyboardTyperId, setKeyboardTyperId] = useState<string>("");

	// Fetch Updated Chats
	const fetchUserChats = useCallback(
		async (messageToSendId?: string): Promise<void> => {
			try {
				if (!socket) return;
				const socketResponse: SocketResponse<GetAllChatsResponseProps> = await new Promise(
					(resolve, reject) => {
						socket.emit(
							ConversationEnums.GET_ALL_CONVERSATIONS,
							{ type: ConversationTypeEnums.DIRECT },
							(response: SocketResponse<GetAllChatsResponseProps>) => {
								if (response.error) {
									reject(response.error);
								} else {
									resolve(response);
								}
							}
						);
					}
				);

				const payload = socketResponse?.data?.messages;
				const DATA = removeSingleRecipientMessages(payload);
				setAllConversations(DATA as CombinedConversationResponseProps[]);
				setMessageQueue((prev) => prev.filter((msg) => msg._id !== messageToSendId));
				setTemporaryMessages((prev) => prev.filter((msg) => msg._id !== messageToSendId));
				setLoadingChats(false);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Error fetching user chats";
				toast.error(errorMessage ?? "Error fetching user chats");
				setLoadingChats(false);
			}
		},
		[setMessageQueue, setTemporaryMessages, socket]
	);

	const markUserMessageAsSeen = useCallback(
		async (conversationId: string): Promise<null> => {
			try {
				socket?.emit(ConversationEnums.MARK_MESSAGE_AS_SEEN, {
					conversationId,
					seen: new Date(),
				});

				// Update the conversation in allConversations to mark the message as seen
				setAllConversations((prevConversations) =>
					prevConversations.map((conv): CombinedConversationResponseProps => {
						if (conv._id !== conversationId) return conv;
						return {
							...conv,
							messages: (conv.messages ?? []).map((msg) =>
								msg.user !== loggedInUser && msg.readBy && !msg.readBy.includes(loggedInUser)
									? {
											...msg,
											readBy: [...msg.readBy, loggedInUser],
										}
									: msg
							),
						} as CombinedConversationResponseProps;
					})
				);
				return null;
			} catch (e) {
				return null;
			}
		},
		[loggedInUser, socket]
	);

	const sendUserMessage = useCallback(
		async (
			type: MessageTypeEnums,
			message: string,
			conversationId: string,
			images: CombinedAttachmentType[],
			messageToSendId: string,
			onSuccess: () => void
		): Promise<void> => {
			const attachments = images.map((image) => image._id);

			// Create a unique lock key for this message
			const lockKey = `send_lock_${messageToSendId}`;

			// Check if this message is already being sent
			if ((window as any)[lockKey]) {
				// Logger.info(
				// 	"Message already being sent, skipping:",
				// 	messageToSendId
				// );
				return;
			}

			// Set the lock
			(window as any)[lockKey] = true;
			// const msg = message.length > 0 ? { message } : {};
			try {
				await new Promise<void>((resolve, reject) => {
					socket?.emit(
						ConversationEnums.SEND_MESSAGE,
						{
							type,
							// ...msg,
							...(message ? { message } : {}),
							conversationId,
							attachments,
						},
						async (socketResponse: SocketResponse<GetAllChatsResponseProps2>) => {
							// Extract the messages from the response payload
							const payload = socketResponse?.data?.chats?.messages;
							const convoId = socketResponse?.data?._id as string;
							if (!convoId) {
								// Handle the case where convoId is undefined
								toast.error("Conversation ID is undefined");
								reject(new Error("Conversation ID is undefined"));
								return;
							}
							// Update allConversation state with the conversation
							setAllConversations((prev) => {
								const index = prev.findIndex((c) => c._id === convoId);
								if (index > -1 && prev[index]) {
									const messages = payload as CombinedMessageProps[];
									if (messages.every((msg) => msg.type === MessageTypeEnums.TEXT)) {
										const updatedConversations = [...prev];
										updatedConversations[index] = {
											...updatedConversations[index],
											messages,
										} as CombinedConversationResponseProps;
										return updatedConversations;
									}
								}
								return prev;
							});
							await markUserMessageAsSeen(conversationId);
							// Call the onSuccess callback to update the queue and temporary messages
							onSuccess();
							resolve();
						}
					);
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Failed to Send Message. Try again.";
				toast.error(errorMessage);
			}
		},
		[markUserMessageAsSeen, socket]
	);

	const handleTyping = useCallback(() => {
		// const sender = getSender(loggedInUser, currentConversation.recipients);
		socket?.emit(ConversationEnums.SENDER_IS_TYPING, {
			conversationId: currentConversation._id,
		});
		// Clear existing timer
		if (typingTimer.current) {
			clearTimeout(typingTimer.current);
		}
		// Set a new timer
		typingTimer.current = setTimeout(() => {
			socket?.emit(ConversationEnums.SENDER_IS_TYPING, {
				conversationId: currentConversation._id,
			});
		}, 1000); // 1 seconds timeout
	}, [currentConversation._id, socket]);

	useEffect(() => {
		// Handler for incoming typing messages
		const handleIncomingTyping = (data: TypingProps): void => {
			if (data.message && data.sender !== loggedInUser) {
				setKeyboardTyperId(data.sender);
				// Reset the timer to clear the typing message
				if (typingTimer.current) {
					clearTimeout(typingTimer.current);
				}
				typingTimer.current = setTimeout(() => {
					setKeyboardTyperId("");
				}, 1000); // Clears typing indicator after 1 seconds of inactivity
			} else if (!data.message) {
				setKeyboardTyperId("");
			}
		};

		socket?.on(ConversationEnums.SENDER_IS_TYPING, handleIncomingTyping);

		return () => {
			if (typingTimer.current) {
				clearTimeout(typingTimer.current);
			}
			socket?.off(ConversationEnums.SENDER_IS_TYPING, handleIncomingTyping);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, loggedInUser, setKeyboardTyperId]);

	// ===========  LISTEN TO POPUP EVENTS =========== //
	useEffect(() => {
		if (!socket) return;
		const handlePopup = async (response: SocketResponse<PopUpConversationDataProps>): Promise<void> => {
			const c = response.data;

			if (c._id === messageId) {
				await markUserMessageAsSeen(c._id);
			}

			setAllConversations((prev) => {
				const index = prev.findIndex((conv) => conv._id === c._id);
				if (index > -1) {
					const updatedConversations = [...prev];
					updatedConversations[index] = {
						...updatedConversations[index],
						messages: c.chats.messages as CombinedMessageProps[],
					} as CombinedConversationResponseProps;
					return updatedConversations;
				}
				return prev;
			});

			if (c.currentMessage) {
				const messageContent =
					c.currentMessage.content?.length > MIN_LEN
						? `${c.currentMessage.content.slice(0, MIN_LEN)}...`
						: c.currentMessage.content;
				if (messageContent) {
					const messageSender = getSender(loggedInUser, c.recipients);

					if (messageSender) {
						const messageTitle = `${messageSender.firstName}`;
						const senderImage = messageSender?.profileImage?.url;
						const senderScore = messageSender?.score ?? 0;
						const senderId = messageSender._id;
						const msgId = c._id;
						const audio = new Audio("/sound/notification.mp3");
						audio.play();
						const onChatScreen = pathname.includes(`/messages/${c._id}`);
						if (!onChatScreen) {
							toast.message(messageTitle, messageContent, senderId, senderImage, senderScore, msgId);
						}
					}
				}
			}
		};

		socket.on(ConversationEnums.POPUP_MESSAGE, handlePopup);
		return () => {
			socket.off(ConversationEnums.POPUP_MESSAGE, handlePopup);
		};
	}, [loggedInUser, markUserMessageAsSeen, messageId, pathname, socket]);

	// =========== Initialize User Conversation e.g when user clicks on a user to chat from profile or for the first time
	const startUserInitializeConversation = useCallback(
		async (recipientId: string): Promise<void> => {
			try {
				setStartingNewChat(true);
				socket?.emit(
					ConversationEnums.INITIALIZE_CONVERSATION,
					{
						recipientId,
						type: ConversationTypeEnums.DIRECT,
					},
					async (response: SocketResponse<InitializeMessageProps>) => {
						const { conversation } = response.data;
						if (conversation?._id) {
							await fetchUserChats();
							setStartingNewChat(false);
							if (response.error) {
								router.back();
								return;
							}

							router.push(`/messages/${conversation._id}`);
						}
						if (response.error) {
							toast.error(response.message);
							router.push("/messages");
						}
					}
				);
				setStartingNewChat(false);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Socket Connection Error";
				toast.error(errorMessage);
			}
		},
		[fetchUserChats, router, socket]
	);

	// PREPARE CONVERSATIONS
	const recipient = getRecipient(loggedInUser, currentConversation.recipients);
	const sender = getSender(loggedInUser, currentConversation.recipients);

	const { imageFiles, setImageFiles, getRootProps, getInputProps, open, removeImg } = useFileDropzone();

	const { handleSendMessage } = useMessageQueue(
		recipient._id,
		sender._id,
		inputMessage,
		currentConversation._id ?? "",
		imageFiles,
		sendUserMessage,
		// Actions
		setInputMessage,
		setImageFiles,
		messageQueue,
		setMessageQueue,
		setTemporaryMessages
	);
	const filteredTemporaryMessages = useMemo(
		() => (temporaryMessages ?? []).filter((msg) => msg.conversationId === currentConversation._id),
		[currentConversation._id, temporaryMessages]
	);

	const allMessages: CombinedMessageProps[] = useMemo(() => {
		const permanentMessages = currentConversation.messages ?? [];
		return [...permanentMessages, ...filteredTemporaryMessages].sort(
			(a, b) => new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()
		);
	}, [currentConversation.messages, filteredTemporaryMessages]);

	// Group messages by date
	const groupedMessages = useMemo(() => groupMessagesByDate(allMessages), [allMessages]);
	// Parse messages
	const parsedMsgs = useMemo(() => parseMessages(groupedMessages, loggedInUser), [groupedMessages, loggedInUser]);

	// Flatten messages into a single array for virtualization
	const flattenedMessages = parsedMsgs
		.flatMap(([date, messagesForDate], dateIndex) => {
			return [
				{
					category: "date",
					content: date,
					key: `${date}-${dateIndex}`,
				} as DateMessage,
				...messagesForDate.map(
					(message) =>
						({
							...message,
							category: "message" as const, // Explicitly type category as "message"
							isTemporary: filteredTemporaryMessages.some((temp) => temp._id === message._id) || false,
							key: message._id ?? `${date}-${dateIndex}-${message._id}`, // Ensure key is always a string
						}) as ExtendedRegularMessage
				),
			];
		})
		.reverse();

	// =========== Establish Connection to the WebSocket Server =========== //
	const handleSocketConnect = useCallback(() => {
		socket?.emit(
			ConversationEnums.USER_CONNECT,
			{ type: ConversationTypeEnums.DIRECT },
			(socketResponse: SocketResponse<GetAllChatsResponseProps>) => {
				if (!socketResponse.error) {
					const payload = socketResponse?.data?.messages;
					const DATA = removeSingleRecipientMessages(payload);
					setAllConversations(DATA);
					setLoadingChats(false);
				}
			}
		);
	}, [socket]);

	useEffect(() => {
		if (!socket || !loggedInUser || initiated.current) return;
		initiated.current = true;
		socket.on("connect", handleSocketConnect);
		return () => {
			socket.off("connect", handleSocketConnect);
		};
	}, [handleSocketConnect, loggedInUser, socket]);

	const SocketServer: SocketContextType = useMemo(
		() => ({
			currentConversation,
			loadingChats,
			status,
			allConversations,
			socket,
			startingNewChat,
			startUserInitializeConversation,
			markUserMessageAsSeen,
			handleTyping,
			keyboardTyperId,
			handleSendMessage,
			parsedMsgs,
			inputMessage,
			setInputMessage,
			flattenedMessages,
			getRootProps,
			getInputProps,
			open,
			removeImg,
			imageFiles,
			messageQueue,
			setMessageQueue,
			temporaryMessages,
			setTemporaryMessages,
		}),
		[
			currentConversation,
			loadingChats,
			allConversations,
			socket,
			startingNewChat,
			startUserInitializeConversation,
			markUserMessageAsSeen,
			handleTyping,
			keyboardTyperId,
			handleSendMessage,
			parsedMsgs,
			inputMessage,
			setInputMessage,
			flattenedMessages,
			getRootProps,
			getInputProps,
			open,
			removeImg,
			imageFiles,
			messageQueue,
			setMessageQueue,
			temporaryMessages,
			setTemporaryMessages,
		]
	);

	return <SocketContext.Provider value={SocketServer}>{children}</SocketContext.Provider>;
};

export const useMessaging = (): SocketContextType => {
	const context = useContext(SocketContext);
	if (!context) throw new Error("useSocket must be use inside SocketProvider");
	return context;
};
