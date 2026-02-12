"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";

import { SkillInput } from "./_components/skill-input";
import { useUniqueSkillsValidation } from "./_components/hooks";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface PreferredSkillsProps {
	form: UseFormReturn<FormValues>;
	isEdit?: boolean;
}

const PreferredSkills = ({ form, isEdit }: PreferredSkillsProps): ReactElement => {
	useUniqueSkillsValidation(form);

	return (
		<div className="relative flex w-full flex-col gap-2">
			<h3 className="flex flex-col items-start text-lg font-bold text-black sm:flex-row sm:items-center sm:gap-4 sm:font-medium">
				Preferred Skills
				{!isEdit && <span className="text-sm font-thin text-body">You must add three skills</span>}
			</h3>
			<div className="flex w-full flex-wrap items-start gap-2 sm:justify-start">
				<SkillInput form={form} name="firstSkill" />
				<SkillInput form={form} name="secondSkill" />
				<SkillInput form={form} name="thirdSkill" />
			</div>
		</div>
	);
};

export default PreferredSkills;
