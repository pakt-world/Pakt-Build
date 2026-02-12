"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { DayPicker, PropsSingle } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useOnClickOutside, useMediaQuery } from "usehooks-ts";
import React, { useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	showOutsideDays?: boolean;
	className?: string;
	classNames?: Record<string, string>;
	mode?: "single" | "range";
	selected?: Date | Date[];
	initialFocus?: boolean;
	// ...p
};

const IconLeft = (): React.JSX.Element => <ChevronLeft className="h-4 w-4" />;
const IconRight = (): React.JSX.Element => <ChevronRight className="h-4 w-4" />;

export const Calendar = ({
	className,
	classNames,
	showOutsideDays = true,
	timeZone,
	...props
}: CalendarProps): React.JSX.Element => {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col space-y-4 sm:space-y-0 relative",
				nav: "space-x-1 flex items-center justify-between w-full absolute top-0 left-0 z-10",
				button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				month_caption:
					"flex justify-center w-full relative items-center mb-3 text-sm font-medium text-center pt-[2px]",
				weekday: "text-muted-foreground rounded-full w-8 font-normal text-[0.8rem] mb-2",
				week: "top-2 relative",
				day: cn(
					"h-8 w-8 p-0 text-center font-normal text-sm aria-selected:opacity-100 hover:bg-green-500 hover:text-green-50 rounded-full duration-100 c_day_style"
				),
				range_start: "day-range-start",
				range_end: "day-range-end",
				selected: "bg-green-600 text-green-50",
				today: "bg-green-200",
				outside: "text-gray-400",
				disabled: "text-gray-400 hover:bg-transparent hover:!text-gray-400",
				range_middle: "aria-selected:bg-green-100 aria-selected:text-green-600",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: (props) => {
					return props.orientation === "left" ? (
						<button {...props} type="button">
							<IconLeft />
						</button>
					) : (
						<button {...props} type="button">
							<IconRight />
						</button>
					);
				},
			}}
			formatters={{
				formatCaption: (date) => format(date, "LLLL yyyy"),
			}}
			timeZone={timeZone}
			{...props}
		/>
	);
};

type DatePickerProps = Omit<PropsSingle, "mode"> & {
	placeholder?: string;
	openDateModal: boolean;
	setOpenDateModal: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
	timeZone: string;
	disabled?: (date: Date) => boolean;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	selected,
	onSelect,
	className,
	placeholder,
	openDateModal,
	setOpenDateModal,
	timeZone,
	disabled,
	...props
}) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const f = isMobile ? "MMM do, yyyy" : "MMMM do, yyyy";
	const ref = useRef(null);

	const handleClickOutside = (): void => {
		// Your custom logic here
		setOpenDateModal(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div className="relative">
			<button
				className={cn(
					`flex w-fit items-center gap-2 rounded-lg border border-line px-4 py-3 text-body shadow outline-none
					focus-within:border-line hover:border-line hover:duration-200`,
					className
				)}
				type="button"
				onClick={() => {
					setOpenDateModal(true);
				}}
			>
				<CalendarIcon className="size-5" />

				<span className="flex-1 text-left">
					{selected ? (
						<span>{format(selected, f)}</span>
					) : (
						<span className="">{placeholder ?? "Select a date"}</span>
					)}
				</span>
			</button>
			{openDateModal && (
				<div
					className="absolute right-0 z-50 w-[248px] rounded-lg border border-green-200 bg-green-50 p-0 shadow-lg"
					ref={ref}
				>
					<Calendar
						mode="single"
						selected={selected}
						onSelect={onSelect}
						disabled={disabled}
						timeZone={timeZone}
						initialFocus
						{...props}
					/>
				</div>
			)}
		</div>
	);
};
