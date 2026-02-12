"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Rating from "react-rating";
import { Star } from "lucide-react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";
import { type ReviewProps } from "./types";

interface Props extends ReviewProps {
	tab?: boolean;
}

export const Review = ({ body, title, rating, user, date, index, tab }: Props): JSX.Element => {
	const { user: userAccount } = useUserState();
	const { _id: loggedInUser } = userAccount ?? { _id: "" };

	// const MAX_LEN = 150;
	const navigateUrl = loggedInUser === user._id ? "/profile" : `/talents/${user?._id}`;

	return (
		<div
			className="flex h-auto w-full cursor-grab select-none flex-col gap-2 rounded-2xl border border-[#CDCFD0] bg-white p-4 sm:gap-4"
			style={{ maxWidth: tab ? "50%" : "100%" }}
		>
			<div
				className="flex max-w-[100%] flex-1 flex-col gap-2 break-all sm:gap-4"
				style={{
					wordWrap: "break-word",
					overflowWrap: "break-word",
					wordBreak: "break-word",
				}}
			>
				<div className="flex w-full items-center justify-between">
					<p className="text-xs tracking-wide text-neutral-400 sm:text-base sm:leading-[18px]">
						{date && format(new Date(date), "dd MMM, yyyy")}
					</p>
					<p className="text-xs tracking-wide text-neutral-400 sm:leading-[18px]">{index}</p>
				</div>
				<h3 className="line-clamp-1 font-bold text-title sm:text-2xl sm:font-medium">{title}</h3>
				<p className="line-clamp-2 max-w-fit text-sm font-thin text-body sm:text-base">{body}</p>
			</div>

			<div className="flex items-end justify-between">
				<div className="flex items-center gap-2">
					<TalentProfile size="sm" score={user.afroScore as number} src={user?.avatar} url={navigateUrl} />

					<div className="flex flex-col">
						<span className="text-lg font-medium text-title">{user.name}</span>
						<span className="text-xs text-body sm:text-sm">{sentenceCase(user.title)}</span>
					</div>
				</div>
				{/* @ts-ignore */}
				<Rating
					initialRating={rating}
					fullSymbol={<Star className="max-sm:w-[15px]" fill="#15D28E" color="#15D28E" />}
					emptySymbol={<Star className="max-sm:w-[15px]" fill="transparent" color="#15D28E" />}
					readonly
				/>
			</div>
		</div>
	);
};
