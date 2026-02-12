"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { Spinner } from "@/components/common/loader";
import { sentenceCase } from "@/lib/utils";

interface CategoryList {
	label: string;
	value: string;
}

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface DropdownProps {
	isOpen: boolean;
	isFetching: boolean;
	isLoading: boolean;
	filteredCategoryList: CategoryList[];
	highlightedIndex: number;
	setSkillValue: React.Dispatch<React.SetStateAction<string>>;
	form: UseFormReturn<FormValues>;
	name: "thirdSkill" | "secondSkill" | "firstSkill";
	optionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
	dropdownRef: React.RefObject<HTMLDivElement>;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SkillDropdown = ({
	isOpen,
	isFetching,
	isLoading,
	filteredCategoryList,
	highlightedIndex,
	setSkillValue,
	form,
	name,
	optionRefs,
	dropdownRef,
	setIsOpen,
}: DropdownProps): JSX.Element | null => {
	if (!isOpen) return null;

	return (
		<div
			className="absolute z-50 max-h-[200px] min-w-[271px] translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg
				border border-green-300 bg-white p-4 shadow"
			style={{ maxHeight: "200px", overflowY: "auto" }}
			ref={dropdownRef}
		>
			{isFetching || isLoading ? (
				<Spinner />
			) : (
				filteredCategoryList.map(({ label, value: v }, index) => (
					<div
						key={v}
						className={`${highlightedIndex === index ? "bg-[#ECFCE5]" : ""} relative flex w-full cursor-pointer select-none items-center rounded
							p-2 text-base outline-none hover:bg-[#ECFCE5]`}
						onMouseDown={() => {
							setSkillValue(label);
							form.setValue(name, label, { shouldValidate: true });
							setIsOpen(false);
						}}
						ref={(el) => {
							optionRefs.current[index] = el;
						}}
					>
						{sentenceCase(label)}
						{label === form.getValues(name) && (
							<span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
								<Check className="h-4 w-4" />
							</span>
						)}
					</div>
				))
			)}
		</div>
	);
};
