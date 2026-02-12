"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Bookmark } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRemoveFromBookmark, useSaveToBookmark } from "@/lib/api/bookmark";
import { CheckMark } from "@/components/common/icons";

interface bookmarkType {
	// id: string;
	size: number;
	type: string;
	isBookmarked?: boolean;
	bookmarkId: string;
	callback?: () => void;
	useCheck?: boolean;
}

export const BookmarkCollection: FC<bookmarkType> = ({
	size = 24,
	isBookmarked,
	// id,
	bookmarkId,
	type = "collection",
	callback,
	useCheck = false,
}) => {
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	const addBookmark = useSaveToBookmark(callback);
	const removeBookmark = useRemoveFromBookmark(callback);

	const CallFuc = (): void => {
		if (bookmarked) {
			setBookmarked(false);
			removeBookmark.mutate(
				{ id: bookmarkId },
				{
					onSuccess: () => {
						setBookmarked(false);
					},
					onSettled: () => {
						callback?.();
					},
				}
			);
			return;
		}
		setBookmarked(true);
		addBookmark.mutate(
			{ reference: bookmarkId, type },
			{
				onSuccess: () => {
					setBookmarked(true);
				},
				onSettled: () => {
					callback?.();
				},
			}
		);
	};

	if (useCheck) {
		return (
			<div
				className="flex-end flex min-w-fit group-hover:!scale-100 group-active:!scale-100"
				onClick={CallFuc}
				role="button"
				tabIndex={0}
				onKeyPress={(event) => {
					event.stopPropagation();
					if (event.key === "Enter") {
						CallFuc();
					}
				}}
				onMouseEnter={(event) => {
					event.stopPropagation();
				}}
			>
				<CheckMark fill={bookmarked ? "#7DDE86" : undefined} className="cursor-pointer" size={24} />{" "}
				<span className="ml-2 text-body">{bookmarked ? "Saved" : "Save"}</span>
			</div>
		);
	}

	return (
		<Bookmark
			onClick={(e) => {
				e.stopPropagation();
				CallFuc();
			}}
			onMouseEnter={(event) => {
				event.stopPropagation();
			}}
			className={`relative z-50 cursor-pointer group-hover:!scale-100 group-active:!scale-100
				${bookmarked ? "text-green-500" : "text-gray-500"} ${bookmarked ? "fill-green-500" : "fill-transparent"}`}
			size={size}
		/>
	);
};
