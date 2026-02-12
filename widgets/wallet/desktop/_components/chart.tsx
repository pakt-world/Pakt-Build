"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Tabs from "@radix-ui/react-tabs";
// import { parseISO } from "date-fns";
// import { useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Chart } from "@/components/common/chart";
import { useFetchWalletStats } from "@/lib/api/wallet";
import { transformAndSortData } from "@/lib/utils/wallet";
import { walletPageRefetchInterval } from "@/lib/utils";

export interface TransformedData {
	date: string;
	amt: number;
	// timestamp?: number;
	// [key: string]: string | number;
}

// const formatTickLabel = (value: string, index: number, data: TransformedData[]): string => {
// 	const currentDate = new Date(value);
// 	const previousDate = index > 0 ? new Date(data[index - 1]?.timestamp || "") : null;

// 	// Only show the day label if it's the first occurrence of that day
// 	if (!previousDate || format(currentDate, "yyyy-MM-dd") !== format(previousDate, "yyyy-MM-dd")) {
// 		return format(currentDate, "EEE"); // Show "Mon", "Tue", etc.
// 	}
// 	return ""; // Hide duplicate labels for the same day
// };

export const WalletBalanceChart = (): JSX.Element => {
	// const searchParams = useSearchParams();
	// const router = useRouter();

	// const queryParams = new URLSearchParams(searchParams);

	// const period = queryParams.get("period") ?? "weekly";
	// const format = period === "weekly" ? "ddd" : period === "monthly" ? "DD MMM" : "MMM YY";
	const { data: stats, isLoading } = useFetchWalletStats({
		format: "weekly",
		refetchInterval: walletPageRefetchInterval,
	});

	// const data: TransformedData[] = nTransformAndSortData(stats);

	// const transformedData = data.map((item) => ({
	// 	...item,
	// 	timestamp: parseISO(item.date).getTime(),
	// }));

	// const modifiedData = [...transformedData];

	// if (modifiedData.length > 0) {
	// 	const lastData = modifiedData[modifiedData.length - 1] as TransformedData;
	// 	const additionalDataPoint = { date: "", amt: lastData.amt, timestamp: Date.now() };
	// 	modifiedData.push(additionalDataPoint);
	// }

	const data: TransformedData[] = transformAndSortData(stats, "ddd");
	
	const modifiedData = [...data];

	if (modifiedData.length > 0) {
		const lastData = modifiedData[modifiedData.length - 1] as TransformedData;
		const additionalDataPoint = { date: "", amt: lastData.amt };
		modifiedData.push(additionalDataPoint);
	}
	return (
		<Tabs.Root
			// value={period}
			value="weekly"
			defaultValue="week"
			aria-label="Wallet Balance Chart"
			className="flex flex-col gap-2 rounded-lg border border-line bg-white p-2 shadow max-sm:h-[250px]"
		>
			{/* <div className="flex items-center justify-between gap-2">
				<span className="text-lg font-medium text-title">Balance Chart</span>

				<Tabs.List className="flex gap-1 rounded-lg bg-[#F0F2F5] p-1 px-2 text-xs text-[#828A9B]">
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="weekly"
						onClick={() => {
							router.push("/wallet?period=weekly");
						}}
					>
						7 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="monthly"
						onClick={() => {
							router.push("/wallet?period=monthly");
						}}
					>
						30 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
						value="yearly"
						onClick={() => {
							router.push("/wallet?period=yearly");
						}}
					>
						1 Year
					</Tabs.Trigger>
				</Tabs.List>
			</div> */}
			<div className="px-4 py-2">
				<h3>Balance Chart</h3>
			</div>
			<div className="h-full">
				<Tabs.Content value="weekly" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						isLoading={isLoading}
						// interval={0}
						// xTickFormatter={formatTickLabel}
						// xAxisKey="timestamp"
					/>
				</Tabs.Content>
				{/* <Tabs.Content value="monthly" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						noOfTicks={10}
						showBrush
						fullBrush
						isLoading={isLoading}
						useFormattedDateTick
					/>
				</Tabs.Content>
				<Tabs.Content value="yearly" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						noOfTicks={12}
						fullBrush
						showBrush
						isLoading={isLoading}
					/>
				</Tabs.Content> */}
			</div>
		</Tabs.Root>
	);
};
