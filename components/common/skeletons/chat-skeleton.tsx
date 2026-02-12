/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Skeleton } from "./skeleton";

const BUBBLE_HEIGHTS = [3, 4, 5, 3, 4, 6, 3, 5, 4, 3, 5, 4, 3, 5, 4, 6, 3, 4, 5, 3];

const ChatSkeleton = () => {
	const tab = useMediaQuery("(min-width: 640px)");
	return (
		<div
			className="relative flex w-full flex-col items-center gap-1 bg-secondary bg-opacity-50 p-3 text-white max-sm:overflow-y-auto
				max-sm:pb-[64px] sm:p-5"
		>
			<div
				className="flex w-full flex-row items-center justify-between gap-2 border-b border-primary/10 pb-3 max-sm:fixed max-sm:top-0
					max-sm:!z-50 max-sm:bg-white max-sm:px-4"
			>
				<div className="flex w-full items-center gap-2">
					<Skeleton className="h-[65px] w-[65px] rounded-full" />
					<div className="flex flex-col items-start gap-1">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-5 w-32" />
					</div>
				</div>
				<Skeleton className="h-5 w-40" />
			</div>
			{/* Bubbles */}
			<div className="relative flex w-full flex-1 flex-col overflow-y-auto max-sm:!pt-[78px] sm:h-full">
				{BUBBLE_HEIGHTS.map((height, index) => {
					return (
						<div key={index} className={`flex w-full ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
							<Skeleton
								style={{
									height: `${height}rem`,
								}}
								className={`mb-2 w-[20rem]
								${index % 2 === 0 ? "rounded-r-[1.875rem] rounded-tl-[1.875rem]" : "rounded-l-[1.875rem] rounded-tr-[1.875rem]"} px-5
								py-2`}
							>
								<Skeleton className="w-[90%] whitespace-break-spaces" />
								<Skeleton className="float-right ml-4 whitespace-pre text-sm" />
							</Skeleton>
						</div>
					);
				})}
			</div>
			{/* Bubbles */}
			{tab ? (
				<Skeleton className="w-full max-sm:!rounded-none sm:!rounded-2xl">
					<div className="flex w-full flex-col border-b border-[#E8E8E833] p-4">
						<div className="flex w-full items-center justify-between px-4 py-[.5625rem]">
							<Skeleton className="h-5 w-40" />
						</div>
					</div>
					<div className="flex w-full items-center justify-between p-4">
						<div className="flex w-max items-center gap-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-8 w-8 rounded-full" />
						</div>
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</Skeleton>
			) : (
				<div className="fixed bottom-0 z-40 w-full bg-white max-sm:!rounded-xl sm:!rounded-2xl">
					<div className="flex w-full items-center justify-between gap-5 p-4">
						<Skeleton className="h-8 w-8 rounded-full" />

						<Skeleton className="h-8 flex-1" />

						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatSkeleton;
