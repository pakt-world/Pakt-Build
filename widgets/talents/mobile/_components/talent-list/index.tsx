"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentCard } from "./_components/card";
import { PageLoading } from "@/components/common/page-loading";
import { TalentCrucialData } from "@/lib/types/talents";
import { PageEmpty } from "@/components/common/page-empty";

interface MobileTalentListProps {
	talents: TalentCrucialData[];
	isFetchingNextPage: boolean;
	isLoading?: boolean;
}

export const TalentList = (props: MobileTalentListProps): JSX.Element => {
	const { talents, isLoading, isFetchingNextPage } = props;

	if (isLoading) return <PageLoading className="h-[calc(100vh-200px)]" color="#3055B3" />;
	if (!talents.length) return <PageEmpty label="No result Found..." className="h-[calc(100vh-200px)]" />;

	return (
		<div className="scrollbar-hide relative mb-[64px] mt-[63px] flex w-full flex-1 flex-col overflow-y-auto">
			{talents.map((t: TalentCrucialData, i: number) => (
				<TalentCard
					key={i}
					id={t?._id}
					name={t?.name}
					title={t?.title ?? ""}
					score={(t?.score as string) ?? "0"}
					imageUrl={t?.image}
					skills={t?.skills}
				/>
			))}
			{isFetchingNextPage && (
				<div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
					<Loader size={25} className="animate-spin text-center text-black" />
				</div>
			)}
		</div>
	);
};
