"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useEffect, useRef, type ComponentType } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { formatDateHandler } from "@/lib/utils";
import type { CombinedMessageProps } from "@/providers/socket-types";
import Logger from "@/lib/utils/logger";

export interface DateMessage {
	category: "date";
	content: string; // The date string or formatted date content
	key: string;
}

export interface RegularMessage {
	category: "message";
	isTemporary: boolean; // Optional, true if the message is temporary
	key: string;
}

export type ExtendedRegularMessage = Partial<CombinedMessageProps> & Partial<RegularMessage>;

export type Message = DateMessage | ExtendedRegularMessage;

interface UseVirtualizedMessagesProps {
	messages: Message[]; // Array of messages to render
	Bubble: ComponentType<{ message: ExtendedRegularMessage }>; // Bubble component to render each message
	debug?: boolean; // Optional debug flag
}

// Memoized Bubble for Performance Optimization
const MemoizedBubble = memo(function MemoizedBubble({
	Bubble,
	message,
}: {
	Bubble: ComponentType<{ message: ExtendedRegularMessage }>;
	message: ExtendedRegularMessage;
}) {
	return <Bubble message={message} />;
});

// Dynamic height calculator (placeholder logic, adjust as needed)
function getDynamicHeight(message: Message | undefined): number {
	if (!message) return 45; // Default height for invalid messages

	if (message.category === "date") {
		return 30; // Example: Date messages have a smaller height
	}

	// Example: Calculate height based on message content length
	const bubble = message as ExtendedRegularMessage;
	if (bubble.content) {
		const length = bubble.content.length;
		return Math.max(45, Math.min(200, length * 1.5)); // Dynamically adjust height
	}

	return 45; // Default height
}

export function RowVirtualizerDynamic({ messages, Bubble, debug = false }: UseVirtualizedMessagesProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	// const [enabled, setEnabled] = useState(true);

	const count = messages.length;
	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: (index) => getDynamicHeight(messages[index]), // Calculate height dynamically
		overscan: 20,
		// enabled,
	});

	const items = virtualizer.getVirtualItems();
	// Log debug information
	useEffect(() => {
		if (debug) {
			Logger.info("Virtualizer State:", {
				items,
				totalSize: virtualizer.getTotalSize(),
				// range: virtualizer.getVirtualRange(),
			});
		}
	}, [items, virtualizer, debug]);

	// Invert the scroll direction
	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;
		const invertedWheelScroll = (event: WheelEvent) => {
			el.scrollTop -= event.deltaY;
			event.preventDefault();
		};

		el.addEventListener("wheel", invertedWheelScroll, false);

		return () => el.removeEventListener("wheel", invertedWheelScroll);
	}, []);

	// Scroll anchoring when new messages are added
	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;

		const lastItem = items[items.length - 1]; // Get the last visible item
		const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5;

		if (isAtBottom && lastItem) {
			virtualizer.scrollToIndex(lastItem.index);
		}
	}, [messages.length, items, virtualizer]);

	// virtualizer.scrollToIndex(0); === scroll to the top
	// virtualizer.scrollToIndex(count / 2); === scroll to the middle
	// virtualizer.scrollToIndex(count - 1); === scroll to the end
	// setEnabled((prev) => !prev); === toggle virtualizer {enabled ? "off" : "on"}

	return (
		<div
			ref={parentRef}
			style={{
				height: "100%",
				width: "100%",
				overflowY: "auto",
				// overflowAnchor: "none",
				transform: "scaleY(-1)",
				contain: "strict",
			}}
		>
			<div
				style={{
					height: virtualizer.getTotalSize(),
					width: "100%",
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						transform: `translateY(${items[0]?.start || 0}px)`,
					}}
				>
					{items.map((virtualRow) => {
						const message = messages[virtualRow.index];
						if (!message) return null;

						const bubbleContent = message as ExtendedRegularMessage;

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
								style={{
									transform: `scaleY(-1)`,
									// padding: "8px 0", // Add padding for better spacing
								}}
							>
								{message?.category === "date" ? (
									<div className="chat-date">
										<h2>{formatDateHandler(bubbleContent?.content, "DD MMM YYYY")}</h2>
									</div>
								) : bubbleContent ? (
									<MemoizedBubble Bubble={Bubble} message={bubbleContent} />
								) : (
									<p className="text-white">Loading...</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
