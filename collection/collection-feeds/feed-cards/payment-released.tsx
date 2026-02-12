"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CoinProps } from "@/lib/types/collection";
import { FeedCardWrapper } from "../_components/wrapper";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { formatNumber, titleCase } from "@/lib/utils";

interface PaymentReleasedProps {
	amount: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	jobId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	isCreator: boolean;
	realTimeRate: number;
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	paymentRate: string;
}
export const PaymentReleased = ({
	realTimeRate,
	meta,
	jobId: _jId,
	talent,
	creator,
	title: _t,
	amount,
	description: _d,
	isCreator,
	createdAt,
	refetchFeeds,
	bookmark,
	feedId,
	paymentRate,
}: PaymentReleasedProps): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const coin = meta.coin;

	return (
		<FeedCardWrapper
			borderColor="#7DDE86"
			bgColor="#FBFFFA"
			iconColor="#ECFCE5"
			createdAt={createdAt}
			feedId={feedId}
			dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
			isPaymentReleased
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={isCreator ? talent?.avatar : creator?.avatar}
						score={isCreator ? talent?.score : creator?.score}
						size="lg"
						url={`/talents/${isCreator ? talent?._id : creator?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-body">
								{isCreator ? "Payment Released" : "Payment Released"}
							</h3>
						</div>

						<h3 className="flex items-center gap-[3px] text-2xl font-bold text-title">
							{`${formatNumber(Number(amount))} `}
							<Image
								src={coin?.icon ?? "/icons/avax-logo.svg"}
								alt={coin?.name ?? "AVAX"}
								width={20}
								height={20}
								className="h-[20px] w-[20px] overflow-hidden rounded-full bg-cover"
							/>
							{coin?.symbol.toUpperCase() ?? "AVAX"} has been added to Your Wallet! 💰
						</h3>

						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<JobAmountBadge
									usdInitialValue={meta?.usdInitialValue}
									coin={coin}
									paymentFee={Number(amount)}
									realTimeRate={realTimeRate}
									className="!bg-amount_badge"
									isFunded
									paymentRate={paymentRate}
								/>
								<Button size="md" variant="secondaryOutline" asChild>
									<Link href="/wallet">View Wallet</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Link href="/wallet" className="relative flex w-full flex-col items-start gap-4">
					<div className="flex items-center gap-2">
						<TalentProfile
							src={isCreator ? talent?.avatar : creator?.avatar}
							score={isCreator ? talent?.score : creator?.score}
							size="xs"
							url={`/talents/${isCreator ? talent?._id : creator?._id}`}
						/>
						<div className="w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{creator?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(creator?.title)}
							</span>
						</div>
					</div>
					<h3 className="text-base font-bold text-gray-800">
						{isCreator ? "Payment Released" : "Payment Released"}
					</h3>
					<p className="w-[95%] text-sm font-normal text-gray-500">
						{`${formatNumber(Number(amount))}`}
						<span style={{ verticalAlign: "middle", margin: "0 2px", position: "relative", top: "-2px" }}>
							<Image
								src={coin?.icon ?? "/icons/avax-logo.svg"}
								alt={coin?.name ?? "AVAX"}
								width={13}
								height={13}
								className="inline-block size-[13px] overflow-hidden rounded-full bg-cover"
							/>
						</span>
						{`${coin?.symbol.toUpperCase() ?? "AVAX"} has been added to Your Wallet! 💰`}
					</p>
				</Link>
			)}
		</FeedCardWrapper>
	);
};
