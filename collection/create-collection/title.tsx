"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobTitleProps {
	form: UseFormReturn<FormValues>;
}

const JobTitle = ({ form }: JobTitleProps): JSX.Element => {
	return (
		<div className="relative">
			<textarea
				// type="text"
				// autoFocus
				maxLength={60}
				{...form.register("title")}
				placeholder="Enter Job Title"
				className="w-full bg-transparent text-lg !text-white caret-white placeholder:text-white placeholder:text-opacity-60
					focus:outline-none max-sm:placeholder:text-2xl sm:!text-3xl"
				rows={2}
				cols={20}
			/>
			<div className="ml-auto text-right text-sm text-white">{form.watch("title")?.length}/60</div>
			<span className="absolute bottom-0 flex w-full">
				{form.formState.errors.title?.message != null && (
					<span className="text-sm text-red-200">{form.formState.errors.title?.message}!</span>
				)}
			</span>
		</div>
	);
};

export default JobTitle;
