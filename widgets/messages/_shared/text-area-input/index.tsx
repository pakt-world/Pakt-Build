"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type { EmojiClickData } from "emoji-picker-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
	Dispatch,
	ForwardedRef,
	KeyboardEvent,
	SetStateAction,
	memo,
} from "react";
import type { DropzoneInputProps } from "react-dropzone";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import type { AttachmentsSendingProps } from "@/providers/socket-types";
import { truncateText } from "@/lib/utils";
import { RenderAttachmentPreviewer } from "./_components/render-attachment-viewer";

interface Props {
	text: string;
	setText: Dispatch<SetStateAction<string>>;
	handleTyping: () => void;
	handleSendMessage: () => void;
	getRootProps: <T extends DropzoneInputProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	open: () => void;
	removeImg: (id: string) => void;
	imageFiles: AttachmentsSendingProps[];
	recipientName: string;
}

const TextAreaInput = forwardRef(
	(
		{
			text,
			setText,
			handleSendMessage,
			handleTyping,
			getRootProps,
			getInputProps,
			open,
			removeImg,
			imageFiles,
			recipientName = "",
		}: Props,
		ref: ForwardedRef<HTMLDivElement | null>
	): JSX.Element => {
		const isMobile = useMediaQuery("(max-width: 640px)");

		const [showEmoji, setShowEmoji] = useState(false);

		// Memoize the onKeyDownPress function
		const onKeyDownPress = useCallback(
			async (e: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
				handleTyping();
				if (e.which === 13 && !e.shiftKey) {
					e.preventDefault();
					return handleSendMessage();
				}
			},
			[handleTyping, handleSendMessage]
		);

		// Memoize the onChange handler
		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
				const { value } = e.target;

				// Trim the start of the string to prevent leading spaces
				setText(value.trimStart());
			},
			[setText]
		);

		const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
			const { emoji } = emojiData;
			setText((prevMsg: string) => prevMsg + emoji);
			setShowEmoji(false);
			// Prevent the default behavior of the event
			event.preventDefault();
		};

		const inputRef = useRef<HTMLTextAreaElement>(null);

		useEffect(() => {
			const handleFocus = () => {
				inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
			};

			const handleBlur = () => {
				window.scrollTo(0, document.body.scrollHeight);
			};

			const input = inputRef.current;

			if (input) {
				input.addEventListener("focus", handleFocus);
				input.addEventListener("blur", handleBlur);
			}

			return () => {
				if (input) {
					input.removeEventListener("focus", handleFocus);
					input.removeEventListener("blur", handleBlur);
				}
			};
		}, []);

		if (isMobile) {
			return (
				<div
					className="flex min-h-[80px] w-full items-center gap-2 border bg-secondary/10 !py-2 px-2"
					ref={ref}
					{...getRootProps()}
				>
					<button
						className="relative flex size-8 items-center justify-center rounded-full bg-[#008D6C1A] text-[#007C5B]"
						onClick={open}
						type="button"
					>
						<Paperclip size={16} />
						<input {...getInputProps()} />
					</button>

					<div className="relative flex flex-1 flex-col rounded-2xl bg-secondary/20 p-2 sm:border sm:border-line sm:shadow">
						<textarea
							ref={inputRef}
							id="messageTextarea"
							rows={1}
							className="relative w-full resize-none rounded-t-lg bg-transparent p-2 !text-base focus:outline-none"
							placeholder={`Message ${truncateText(recipientName, 20, false)}`}
							value={text}
							onChange={handleChange}
							onKeyDown={onKeyDownPress}
						/>
						<RenderAttachmentPreviewer images={imageFiles} removeImage={removeImg} />
					</div>
					<button
						type="submit"
						aria-label="Send"
						className="relative flex size-8 -rotate-45 items-center justify-center rounded-full border !bg-primary text-white"
						onClick={handleSendMessage}
						onKeyDown={handleSendMessage}
						disabled={text === "" && imageFiles.length === 0}
					>
						<SendHorizontal size={16} />
					</button>
				</div>
			);
		}

		return (
			<div className="flex w-full items-end gap-4" {...getRootProps()}>
				<div className="relative flex w-max items-center gap-2">
					<button
						className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary"
						onClick={open}
						type="button"
					>
						<Paperclip size={16} />
						<input {...getInputProps()} />
					</button>

					<div className="relative">
						<Button
							className="flex !size-8 items-center justify-center rounded-full bg-secondary p-0 text-primary"
							onClick={() => {
								setShowEmoji(true);
							}}
							type="button"
							variant="ghost"
						>
							<Smile size={16} />
						</Button>
						{showEmoji && (
							<EmojiPicker
								className="!absolute !bottom-32 !left-0"
								onEmojiClick={handleEmojiClick}
								theme={Theme.LIGHT}
								emojiStyle={EmojiStyle.APPLE}
								// lazyLoadEmojis
								customEmojis={[
									{
										names: ["Pakt"],
										imgUrl: "/icons/PAKT-EMOJI.png",
										id: ":pakt:",
									},
								]}
							/>
						)}
					</div>
				</div>

				<div className="flex w-full flex-1 flex-col rounded-xl border border-line bg-input-bg p-4">
					<textarea
						rows={1}
						className="w-full grow resize-none rounded-t-lg bg-transparent p-2 text-base text-title focus:outline-none"
						placeholder={`Message ${recipientName}`}
						value={text}
						onChange={handleChange}
						onKeyDown={onKeyDownPress}
					/>
					<RenderAttachmentPreviewer images={imageFiles} removeImage={removeImg} />
				</div>
				<Button
					type="submit"
					aria-label="Send"
					variant="primary"
					className="!m-0 flex !size-10 -rotate-45 items-center justify-center !rounded-full p-0"
					onClick={handleSendMessage}
					disabled={text === "" && imageFiles.length === 0}
				>
					<SendHorizontal size={16} />
				</Button>
			</div>
		);
	}
);

// Set the display name for the component
TextAreaInput.displayName = "TextAreaInput";

// Memoize the TextAreaInput component
export const MemoizedTextAreaInput = memo(TextAreaInput);
