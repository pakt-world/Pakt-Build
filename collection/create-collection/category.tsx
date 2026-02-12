"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { SelectDropdown } from "@/components/common/select-dropdown";

export const CATEGORY_OPTIONS = [
	{ label: "Design", value: "design" },
	{ label: "Engineering", value: "engineering" },
	{ label: "Product", value: "product" },
	{ label: "Marketing", value: "marketing" },
	{ label: "Copywriting", value: "copywriting" },
	{ label: "Others", value: "others" },
];

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobDescriptionProps {
	form: UseFormReturn<FormValues>;
	disabled?: boolean;
}

const JobCategory = ({ form, disabled }: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex flex-col gap-2 max-sm:w-full">
			<label className="text-sm text-body">Job Category</label>

			<Controller
				name="category"
				control={form.control}
				render={({ field: { onChange, value } }) => {
					return (
						<SelectDropdown
							options={CATEGORY_OPTIONS}
							value={value}
							onChange={onChange}
							placeholder="Select Category"
							disabled={disabled}
							triggerClassName="h-10 w-full sm:w-[180px] sm:text-base"
						/>
					);
				}}
			/>
			<span className="absolute -bottom-5 flex w-full">
				{form.formState.errors.category?.message != null && (
					<span className="text-sm text-red-500">{form.formState.errors.category?.message}</span>
				)}
			</span>
		</div>
	);
};

export default JobCategory;
