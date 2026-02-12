"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { useExchangeRateStore } from "@/lib/store/misc";
import { Feeds } from "../../dashboard/_shared/tabs/feeds";

export const LandingPageTabs = (): JSX.Element => {
	const tab = useMediaQuery("(min-width: 640px)");

	const { isAtTop } = useMobileContext();
	const { data: rates } = useExchangeRateStore();

	const Label4ActiveBounties = tab ? `Active Jobs (0)` : "Active Jobs";
	const Label4Invites = tab ? `Invites (0)` : "Invites";
	const Label4Bookmarks = tab ? `Bookmarks (0)` : "Bookmarks";

	const tabListTopPosition = isAtTop ? "max-sm:top-[0]" : "max-sm:top-[calc(128px)] max-sm:fixed";
	return (
		<div className="z-30 flex h-full flex-1 overflow-y-auto sm:basis-0">
			{tab ? (
				<Tabs
					tabs={[
						{
							label: "Your Feed",
							value: "feed",
							content: <Feeds rates={rates} />,
						},
						{
							label: <span className="flex items-center gap-1">{Label4ActiveBounties}</span>,
							value: "active",
							content: <></>,
						},
						{
							label: <span className="flex items-center gap-1">{Label4Invites}</span>,
							value: "invites",
							content: <></>,
						},
						{
							label: <span className="flex items-center gap-1">{Label4Bookmarks}</span>,
							value: "bookmarks",
							content: <></>,
						},
					]}
					tabListClassName={`transition-all border-t-0 duration-500 ease-in-out -webkit-transition-all -moz-transition-all -o-transition-all z-50 ${tabListTopPosition}`}
					tabContentContainerClassName="transition-all  ease-in-out -webkit-transition-all -moz-transition-all -o-transition-all"
				/>
			) : (
				<Feeds rates={rates} />
			)}
		</div>
	);
};
