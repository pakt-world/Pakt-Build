"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { type CategoryData, useGetCategory } from "@/lib/api/category";
import { disallowedChars, filterSkillsByName, sentenceCase } from "@/lib/utils";
import { SkillDropdown } from "./skill-dropdown";
import {
	useBackspaceKeyHandler,
	useCloseDropdownOnClickOutside,
	useCloseDropdownOnNoResults,
	keyDownHandler,
	useScrollToHighlightedOption,
	useUpdateOptionRefs,
} from "./hooks";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface SkillInputProps {
	form: UseFormReturn<FormValues>;
	name: "thirdSkill" | "secondSkill" | "firstSkill";
}
interface CategoryList {
	label: string;
	value: string;
}

export const SkillInput = ({ form, name }: SkillInputProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [skillValue, setSkillValue] = useState<string>("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

	// Register input with react-hook-form
	const { ref, onChange: f, ...rest } = form.register(name);

	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const optionRefs = useRef<HTMLDivElement[]>([]);

	const { data, isFetching, isLoading } = useGetCategory(debouncedSearchQuery);
	const categories = data?.data ?? [];
	const ct = filterSkillsByName(categories, disallowedChars);

	const CATEGORY_LIST: CategoryList[] = (ct || []).map((c: CategoryData) => ({
		label: c.name,
		value: c.name,
	}));

	// Filter with skillValue/inputValue
	const filteredCategoryList: CategoryList[] = CATEGORY_LIST.filter((category) => {
		return category.label.toLowerCase().includes(skillValue.toLowerCase());
	});

	useBackspaceKeyHandler(inputRef, skillValue, setIsOpen);
	useCloseDropdownOnNoResults(filteredCategoryList, isLoading, isFetching, setIsOpen);
	useCloseDropdownOnClickOutside(dropdownRef, setIsOpen);
	useUpdateOptionRefs(filteredCategoryList, optionRefs);
	useScrollToHighlightedOption(isOpen, highlightedIndex, optionRefs, dropdownRef);

	// Use the key down handler hook
	const m = (e: React.KeyboardEvent<HTMLInputElement>) => {
		keyDownHandler(e, isOpen, setIsOpen, setHighlightedIndex, highlightedIndex, filteredCategoryList, form, name);
	};

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedSearchQuery(skillValue), 300);
		return () => clearTimeout(timeout);
	}, [skillValue]);
	// Logger.info("error", form.formState.errors[name]?.message);
	return (
		<div className="relative flex flex-col max-sm:w-full">
			<Controller
				name={name}
				control={form?.control}
				render={({ field: { onChange, value } }) => {
					return (
						<div className="relative w-full">
							<input
								type="text"
								placeholder="Enter skill"
								className="z-50 h-full w-full rounded-full !border !border-line bg-input-bg py-3 pl-4 text-base focus:outline-none sm:w-fit"
								ref={(el) => {
									ref(el);
									inputRef.current = el;
								}}
								onKeyDown={m}
								maxLength={20}
								value={sentenceCase(value)}
								onChange={(e) => {
									onChange(e);
									setSkillValue(e.target.value);
									setIsOpen(true);
									setHighlightedIndex(-1); // Reset highlighted index on input change
									form.trigger(name); // Trigger validation for all fields on each change
								}}
								onFocus={() => {
									form.trigger(name); // Trigger validation for all fields on each change
								}}
								{...rest}
							/>
							<SkillDropdown
								isOpen={isOpen}
								setIsOpen={setIsOpen}
								isFetching={isFetching}
								isLoading={isLoading}
								filteredCategoryList={filteredCategoryList}
								highlightedIndex={highlightedIndex}
								setSkillValue={setSkillValue}
								form={form}
								name={name}
								optionRefs={optionRefs}
								dropdownRef={dropdownRef}
							/>
						</div>
					);
				}}
			/>
			<span className="left-0 mt-1 flex w-full">
				{form.formState.errors[name]?.message && (
					<span className="text-sm !text-red-500">{form.formState.errors[name]?.message}</span>
				)}
			</span>
		</div>
	);
};
