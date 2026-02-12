"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { forwardRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageLoading } from "@/components/common/page-loading";
import { TalentCrucialData } from "@/lib/types/talents";
import { PageEmpty } from "@/components/common/page-empty";
import { TalentCard } from "./_components/card";

interface TalentListProps {
	talents: TalentCrucialData[];
	isFetchingNextPage: boolean;
	isLoading?: boolean;
}

const RenderLoading = (): JSX.Element => {
	return (
		<div className="z-20 my-auto flex h-full w-full items-center justify-center">
			<PageLoading color="#3055B3" />
		</div>
	);
};

export const TalentList = forwardRef<HTMLDivElement, TalentListProps>((props, ref): JSX.Element => {
	const { talents, isLoading, isFetchingNextPage } = props;
	return (
		<div className="overflow-y-auto overflow-x-hidden">
			{isLoading ? (
				<RenderLoading />
			) : talents.length > 0 ? (
				<div className="grid grid-cols-1 items-center justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
					{talents.map((t: TalentCrucialData, i: number) => (
						<TalentCard
							key={i}
							id={t?._id}
							name={t?.name}
							title={t?.title ?? ""}
							score={(t?.score as string) ?? "0"}
							imageUrl={t?.image}
							skills={t?.skills}
							achievements={t?.achievements ?? []}
						/>
					))}
				</div>
			) : (
				<PageEmpty label="No result Found..." className="h-[70vh] rounded-2xl" />
			)}

			{isFetchingNextPage && (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<Loader size={25} className="animate-spin text-center text-white" />
				</div>
			)}
			<div ref={ref} className="!h-4 !w-full" />
		</div>
	);
});

TalentList.displayName = "TalentList";
