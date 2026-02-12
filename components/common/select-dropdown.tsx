"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { sentenceCase } from "@/lib/utils";

interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	options: Option[];
	value: Option;
	onChange: (value: Option) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	triggerClassName?: string;
}

export const SelectDropdown = ({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	disabled = false,
	className = "",
	triggerClassName = "",
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
	const [shouldOpenUp, setShouldOpenUp] = useState(false);
	const selectRef = useRef<HTMLDivElement | null>(null);

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen((prev) => !prev);
		}
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setHighlightedIndex(null);
	};

	const handleOptionSelect = (selectedValue: Option) => {
		onChange(selectedValue);
		closeDropdown();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!isOpen) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
		} else if (event.key === "Enter" && highlightedIndex !== null) {
			event.preventDefault();
			const selectedOption = options[highlightedIndex];
			if (selectedOption) {
				handleOptionSelect(selectedOption);
			}
		} else if (event.key === "Escape") {
			closeDropdown();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				closeDropdown();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen && selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			setShouldOpenUp(rect.bottom + dropdownHeight > viewportHeight);
		}
	}, [isOpen]);

	return (
		<div ref={selectRef} className={`relative w-full sm:w-fit ${className}`} tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				className={`flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm text-title ${triggerClassName}
					${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isOpen ? "bg-gray-100" : "bg-[#F2F4F5]"}`}
				onClick={toggleDropdown}
				disabled={disabled}
				type="button"
			>
				{value?.label || placeholder} <ChevronDown size={15} />
			</button>

			{isOpen && (
				<ul
					className={`absolute z-10 mt-2 h-fit max-h-40 w-full overflow-y-auto overflow-x-hidden rounded-lg border bg-[#F2F4F5] shadow-lg
					${shouldOpenUp ? "bottom-full mb-2" : "top-full mt-2"}`}
					role="listbox"
				>
					{options.map((option: Option, index) => (
						<li
							key={option.value}
							className={`relative flex cursor-pointer items-center rounded p-2 px-4 py-2 text-base outline-none hover:bg-[#ECFCE5]
							${highlightedIndex === index || option.label === value?.label ? "bg-[#ECFCE5]" : ""}`}
							onClick={() => handleOptionSelect(option)}
							onMouseEnter={() => setHighlightedIndex(index)}
							role="option"
							aria-selected={value?.value === option.value}
						>
							{sentenceCase(option.label)}
							{option.label === value?.label && (
								<span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
									<Check className="h-4 w-4" />
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
