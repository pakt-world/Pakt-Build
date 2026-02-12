"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

// import { addDays, format, getDate, parseISO, startOfWeek } from "date-fns";
import { format, getDate } from "date-fns";
import { useState } from "react";
import {
	Brush,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type TooltipProps,
} from "recharts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatNumberWithCommas } from "@/lib/utils";
import { Skeleton } from "./skeletons/skeleton";
import { AxisInterval } from "recharts/types/util/types";

interface TransformedData {
	date: string;
	amt: number;
	timestamp?: number;
	// [key: string]: string | number; // Add this line
}
interface ChartProps {
	data: TransformedData[];
	height?: "sm" | "md" | "lg";
	dataKey: string;
	xAxisKey: string;
	showBrush?: boolean;
	showTooltip?: boolean;
	fullBrush?: boolean;
	noOfTicks?: number;
	useFormattedDateTick?: boolean;
	isLoading?: boolean;
	interval?: AxisInterval;
	xTickFormatter?: (value: string, index: number, data: TransformedData[]) => string;
}

const HEIGHT_MAP = {
	sm: 200,
	md: 300,
	lg: 400,
};

const formatter = (value: number): string => {
	if (value >= 1_000 && value < 1_000_000) {
		return `$${(value / 1_000).toFixed(1)}K`; // thousands
	} else if (value >= 1_000_000 && value < 1_000_000_000) {
		return `$${(value / 1_000_000).toFixed(1)}M`; // millions
	} else if (value >= 1_000_000_000) {
		return `$${(value / 1_000_000_000).toFixed(1)}B`; // billions
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>): JSX.Element | null => {
	if (active && payload?.length) {
		return (
			<div className="flex flex-col gap-y-1 rounded-[4px] border-none bg-[#4CD471] px-[10px] py-2">
				<p className="label text-xs leading-5 text-white">{payload[0]?.payload?.date}</p>

				<div className="flex items-center gap-x-1">
					<div className="size-2 rounded-full bg-[#ECFCE5]" />
					<p className="label text-sm font-medium leading-4 text-white">
						$
						{formatNumberWithCommas(payload[0]?.payload?.value?.toFixed(2)) ||
							formatNumberWithCommas(payload[0]?.value?.toFixed(2))}
					</p>
				</div>
			</div>
		);
	}

	return null;
};

const formatDateTick = (tick: string): string => {
	const date = new Date(tick);

	if (getDate(date) % 5 === 0) {
		return format(date, "MMM dd");
	}
	return "";
};

interface BrushStartEndIndexProps {
	startIndex?: number;
	endIndex?: number;
}

// Custom tick formatter function to show only the first instance of each day
// const tickFormatter = (value: string) => {
// 	return value;
// };

export const Chart = ({
	data,
	dataKey,
	xAxisKey,
	height = "sm",
	showBrush = false,
	showTooltip = true,
	fullBrush = false,
	noOfTicks = 7,
	useFormattedDateTick = false,
	isLoading,
	// xTickFormatter = tickFormatter,
	// interval = "preserveEnd",
}: ChartProps): JSX.Element => {
	const totalDataPoints = data.length;

	const [brushIndex, setBrushIndex] = useState({
		startIndex: fullBrush || useFormattedDateTick ? 0 : Math.max(0, totalDataPoints - 1 - noOfTicks),
		endIndex: totalDataPoints - 1,
	});

	const handleBrushChange = (area: BrushStartEndIndexProps): void => {
		const startIndex = area.startIndex ?? 0;
		const endIndex = area.endIndex ?? 0;

		setBrushIndex({ startIndex, endIndex });
	};

	if (isLoading) {
		return (
			<div
				className={`z-50 flex size-full grow flex-col items-center justify-center rounded-lg p-0 ${HEIGHT_MAP[height]}`}
			>
				<Skeleton className="size-full" />
			</div>
		);
	}
	const checkAllAmountsZero = (d: TransformedData[]): boolean => {
		return d.every((item) => item.amt === 0);
	};

	if (!isLoading && checkAllAmountsZero(data)) {
		return (
			<div className="flex size-full flex-col items-center justify-center gap-4">
				<svg width="77" height="73" viewBox="0 0 77 73" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M24.9243 70.6022V25.133L28.191 21.9404L40.642 34.3459L50.2198 24.8138V70.6022H24.9243Z"
						fill="white"
					/>
					<path
						d="M74.1396 0.77832L50.2183 24.8595V70.6029H74.1396C74.1396 70.6029 75.6673 44.4018 75.6673 27.596C75.6673 5.52158 74.1396 0.77832 74.1396 0.77832Z"
						fill="#ECFCE5"
					/>
					<path d="M0.870605 49.2127L3.74107 70.6014H24.9432V25.084L0.870605 49.2127Z" fill="#ECFCE5" />
					<path
						d="M2.83105 47.2881L28.1908 21.9291L40.6351 34.3734L71.3944 3.61426"
						stroke="#4EA55C"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M72.5563 15.0977C73.0578 10.0522 73.0578 7.28107 72.5563 2.45602C67.7313 1.95462 64.9601 1.95491 59.915 2.45602"
						stroke="#4EA55C"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M24.9243 70.6043V43.1562"
						stroke="#4EA55C"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M50.2222 70.6043V43.1562"
						stroke="#4EA55C"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M2.59277 62.0227L3.74108 70.6014H73.6572L75.2731 32.1416"
						stroke="#4EA55C"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>

				<p className="text-sm text-title sm:text-base">
					Your chart will appear here in 24hrs after first deposit
				</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height="100%" maxHeight={HEIGHT_MAP[height]} className="w-full grow">
			<LineChart data={data} margin={{ right: 5, top: 5, left: 0, bottom: 5 }}>
				<XAxis
					dataKey={xAxisKey}
					fontSize="12px"
					tick={{
						fill: "#1818196B",
						transform: "translate(0, 5)",
					}}
					stroke="#E8E8E8"
					interval={showBrush || useFormattedDateTick ? 0 : "preserveEnd"}
					tickFormatter={useFormattedDateTick ? formatDateTick : undefined}
					// type="number"
					// scale="time"
					// domain={["dataMin", "dataMax"]}
					// interval={interval}
					// tickFormatter={tickFormatter}
					// tickFormatter={(value, index) => xTickFormatter(value, index, data)}
					// allowDuplicatedCategory={false}
					// minTickGap={20}
				/>
				<YAxis
					fontSize="12px"
					tick={{
						fill: "#1818196B",
					}}
					stroke="#E8E8E8"
					// domain={["auto", "auto"]}
					tickFormatter={formatter}
					axisLine={false}
				/>
				<CartesianGrid stroke="#F0F1F2" horizontal={false} />
				<Line dot={false} type="stepAfter" stroke="#28A745" strokeWidth={2} name={dataKey} dataKey={dataKey} />
				{showTooltip && <Tooltip offset={-20} content={CustomTooltip} />}
				{showBrush && (
					<Brush
						dataKey={xAxisKey}
						onChange={handleBrushChange}
						startIndex={brushIndex.startIndex}
						endIndex={brushIndex.endIndex}
						height={18}
						stroke="#28A745"
						fontSize="12px"
					/>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
};
