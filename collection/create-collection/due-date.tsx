"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type ReactElement } from "react";
import { endOfYesterday } from "date-fns";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { DatePicker } from "@/components/common/date-picker";
import { TIMEZONE_KEY } from "@/lib/utils";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobDueDateProps {
	form: UseFormReturn<FormValues>;
}

const JobDueDate = ({ form }: JobDueDateProps): ReactElement => {
	const [openDateModal, setOpenDateModal] = useState(false);
	const getTimezone = () => {
		if (typeof window === "undefined") return "";

		return (localStorage.getItem(TIMEZONE_KEY) as string | undefined) || "";
	};
	return (
		<div className="relative">
			<Controller
				name="due"
				control={form.control}
				render={({ field: { onChange, value } }) => (
					<DatePicker
						className="h-10 w-max min-w-[150px] rounded-3xl !border-[#0065D0CC] bg-blue-lightest px-4 py-2 text-sm text-[#0065D0CC] sm:text-lg"
						placeholder="Due Date"
						selected={value}
						onSelect={(date) => {
							onChange(date);
							setOpenDateModal(false);
						}}
						timeZone={getTimezone()}
						disabled={(date) => date < endOfYesterday()}
						openDateModal={openDateModal}
						setOpenDateModal={setOpenDateModal}
					/>
				)}
			/>
			<span className="mt-2 flex w-full">
				{form.formState.errors.due?.message != null && (
					<span className="text-sm text-red-200">{form.formState.errors.due?.message}</span>
				)}
			</span>
		</div>
	);
};

export default JobDueDate;
