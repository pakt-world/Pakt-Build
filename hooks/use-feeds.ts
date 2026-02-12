"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { useGetTimeline4Dashboard } from "@/lib/api/dashboard";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { ACTIVE_FEED_TYPES } from "@/lib/constants";
import { AuthEnums } from "@/lib/enums";
import Logger from "@/lib/utils/logger";

export const useFeeds = (currentPage: number) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [currentData, setCurrentData] = useState([]);

	const router = useRouter();
	const token = getCookie(AUTH_TOKEN_KEY);

	const {
		data: timelineData,
		refetch: refetchFeeds,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTimeline4Dashboard({
		isLoggedIn: !!token,
		page: currentPage,
		limit: 10,
		filter: {
			isOwner: true,
			type: ACTIVE_FEED_TYPES,
		},
	});

	useEffect(() => {
		let totalData: any = [];
		if (timelineData && Array.isArray(timelineData.pages)) {
			for (let i = 0; i < timelineData.pages.length; i++) {
				const timeData = timelineData.pages[i];
				if (Array.isArray(timeData)) {
					totalData = [...totalData, ...timeData];
				}
			}
		}

		const newData = totalData.sort((a: any, b: any) => {
			if (a && b) {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
			return 0;
		});
		setCurrentData(newData);
	}, [timelineData, timelineData?.pages]);

	const fetchMore = (): void => {
		if (hasNextPage && !isFetchingNextPage) {
			void fetchNextPage();
		}
	};

	const handleBottomReach = () => {
		Logger.info("Bottom reached, load more content!");
		// Load more content or trigger action here
		if (!token) {
			if (isMobile) {
				// router.push(`/${AuthEnums.SIGNUP}`);
				Logger.info("Proceed To Signup");
			} else {
				router.push(`/?auth=${AuthEnums.SIGNUP}`);
			}
		} else {
			fetchMore();
		}
	};

	return {
		currentData,
		isLoading,
		isError,
		isFetchingNextPage,
		handleBottomReach,
		refetchFeeds,
	};
};
