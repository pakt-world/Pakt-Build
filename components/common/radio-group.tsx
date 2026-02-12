"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";

import {
	FieldValues,
	Path,
	// UseFormReturn
} from "react-hook-form";
import { Checkbox } from "./checkbox";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

// import { sentenceCase } from "@/lib/utils";

interface RadioGroupItemProps {
	value: string;
	isSelected: boolean;
	onChange: () => void;
	name?: string;
	radioClassName?: string;
	disabled?: boolean;
}

const RadioGroupItem = ({
	value,
	isSelected,
	onChange,
	radioClassName = "",
	disabled = false,
}: RadioGroupItemProps) => {
	return (
		<button
			key={value}
			onClick={onChange}
			className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-gray-50 px-3 py-3 hover:border-[#7DDE86]
				${radioClassName}`}
			type="button"
			disabled={disabled}
		>
			<span className="capitalize text-body">{value}</span>
			<Checkbox checked={isSelected} />
		</button>
	);
};

interface RadioGroupProps<T extends FieldValues> {
	options: string[]; // Accepts an array of strings
	value?: string | string[];
	onChange: (value: string) => void;
	className?: string;
	radioClassName?: string;
	// form?: UseFormReturn<T>;
	name?: Path<T>;
	disabled?: boolean;
}

export const RadioGroup = <T extends FieldValues>({
	options,
	value,
	onChange,
	disabled = false,
	className = "",
	radioClassName = "",
	name,
}: RadioGroupProps<T>) => {
	const handleChange = (optionValue: string) => {
		if (!disabled) {
			onChange(optionValue);
		}
	};
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{options.map((option) => {
				const s = value?.includes(option) as boolean;
				return (
					<RadioGroupItem
						key={option}
						value={option}
						isSelected={s}
						onChange={() => handleChange(option)}
						radioClassName={radioClassName}
						disabled={disabled}
						name={name}
					/>
				);
			})}
		</div>
	);
};
