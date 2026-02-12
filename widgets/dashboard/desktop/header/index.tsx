"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
// import { UserPlus } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UserBalance } from "@/components/common/user-balance";
import { ReferralSideModal } from "./refer";
import { useUserState } from "@/lib/store/account";
// import { useGetTalentReviewById } from "@/lib/api";
// import { hasFiveStarReview } from "@/lib/actions/talent";
// import { Button } from "@/components/common/button";

export const DashboardHeader = (): ReactElement => {
	const [referOpen, _setReferOpen] = useState(false);
	const { user } = useUserState();
	const { firstName } = user ?? { firstName: "" };
	// const { data: reviewData, refetch, isLoading } = useGetTalentReviewById(_id, "1", "100");

	// checking refer availability
	// useEffect(() => {
	// 	void refetch();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// const hasFiveStar = useMemo(() => {
	// 	if (!reviewData || isLoading) return false;
	// 	return hasFiveStarReview(reviewData.data);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [reviewData]);

	return (
		<div className="hidden items-center justify-between sm:flex">
			<ReferralSideModal
				isOpen={referOpen}
				onOpenChange={(e) => {
					_setReferOpen(e);
				}}
			/>
			<div className="text-3xl font-bold text-title">Hello {firstName}!</div>

			<div className="flex items-center gap-7">
				{/* {hasFiveStar && (
					<Button
						className="mr-6 flex items-center gap-2"
						onClick={() => {
							_setReferOpen(true);
						}}
						type="button"
						variant="secondary"
						size="sm"
					>
						<UserPlus size={18} />
						<span>Refer</span>
					</Button>
				)} */}
				<div className="flex items-center gap-2 text-3xl text-title">
					<UserBalance />
					<span className="font-bold">|</span> <span className="text-body">Balance</span>
				</div>
			</div>
		</div>
	);
};
