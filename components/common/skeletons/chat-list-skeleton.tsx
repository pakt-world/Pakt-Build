/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Skeleton } from "./skeleton";

export const ChatListSkeleton = () => (
	<div className="flex h-auto w-full flex-col overflow-y-auto">
		{[...Array(20)].map((_, i) => (
			<Skeleton
				className="flex h-auto w-full items-center justify-start gap-2 border-b border-primary/10 bg-secondary bg-opacity-50 p-4
					sm:rounded-none"
				key={i}
			>
				<Skeleton className="!h-[66px] !w-[66px] !rounded-full bg-primary/10" />
				<div className="flex w-full flex-1 items-start justify-between gap-3">
					<div className="flex flex-col items-start gap-1">
						<Skeleton className="!h-[16px] !w-[85px] !rounded-sm bg-primary/10" />
						<Skeleton className="!h-[10px] !w-[70px] !rounded-sm bg-primary/10" />
					</div>

					<div className="flex w-max flex-col items-end gap-1">
						<Skeleton className="!h-[7px] !w-[25px] !rounded-sm bg-primary/10" />
						<Skeleton className="!h-[10px] !w-[10px] !rounded-full bg-primary/10" />
					</div>
				</div>
			</Skeleton>
		))}
	</div>
);
