import { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import { type baseCreateJobSchema } from "@/lib/validations";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface CategoryList {
	label: string;
	value: string;
}

// Generic hook to handle key events
const useKeyEventHandler = (
	ref: React.RefObject<HTMLInputElement | HTMLDivElement>,
	event: string,
	handler: (event: KeyboardEvent | MouseEvent) => void
) => {
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const eventHandler = (event: KeyboardEvent | MouseEvent) => handler(event);

		element.addEventListener(event, eventHandler as EventListener);

		return () => {
			element.removeEventListener(event, eventHandler as EventListener);
		};
	}, [ref, event, handler]);
};

// Hook to handle backspace key event
export const useBackspaceKeyHandler = (
	inputRef: React.RefObject<HTMLInputElement>,
	skillValue: string,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const handleKeyDown = (event: KeyboardEvent | MouseEvent): void => {
		if (event instanceof KeyboardEvent && event.key === "Backspace" && skillValue.length === 1) {
			setIsOpen(true);
		}
	};

	useKeyEventHandler(inputRef, "keydown", handleKeyDown);
};

// Hook to close dropdown when no results
export const useCloseDropdownOnNoResults = (
	filteredCategoryList: CategoryList[],
	isLoading: boolean,
	isFetching: boolean,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
	useEffect(() => {
		if (filteredCategoryList.length === 0 && !isLoading && !isFetching) {
			setIsOpen(false);
		}
	}, [filteredCategoryList.length, isFetching, isLoading, setIsOpen]);
};

// Hook to close dropdown when clicking outside
export const useCloseDropdownOnClickOutside = (
	dropdownRef: React.RefObject<HTMLDivElement>,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownRef, setIsOpen]);
};

// Hook to update optionRefs when filteredCategoryList changes
export const useUpdateOptionRefs = (
	filteredCategoryList: CategoryList[],
	optionRefs: React.MutableRefObject<HTMLDivElement[]>
) => {
	useEffect(() => {
		optionRefs.current = optionRefs.current.slice(0, filteredCategoryList.length);
	}, [filteredCategoryList, optionRefs]);
};

// Hook to scroll to highlighted option
export const useScrollToHighlightedOption = (
	isOpen: boolean,
	highlightedIndex: number,
	optionRefs: React.MutableRefObject<HTMLDivElement[]>,
	dropdownRef: React.RefObject<HTMLDivElement>
) => {
	useEffect(() => {
		if (isOpen && highlightedIndex !== -1) {
			const optionElement = optionRefs.current[highlightedIndex];
			if (optionElement && dropdownRef.current) {
				const dropdown = dropdownRef.current;
				const option = optionElement;

				const dropdownRect = dropdown.getBoundingClientRect();
				const optionRect = option.getBoundingClientRect();

				const scrollPadding = 20;

				if (optionRect.top < dropdownRect.top + scrollPadding) {
					dropdown.scrollTop = option.offsetTop - scrollPadding;
				} else if (optionRect.bottom > dropdownRect.bottom - scrollPadding) {
					dropdown.scrollTop = option.offsetTop + option.offsetHeight - dropdown.offsetHeight + scrollPadding;
				}
			}
		}
	}, [dropdownRef, highlightedIndex, isOpen, optionRefs]);
};

export const keyDownHandler = (
	e: React.KeyboardEvent<HTMLInputElement>,
	isOpen: boolean,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
	setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>,
	highlightedIndex: number,
	filteredCategoryList: CategoryList[],
	form: UseFormReturn<FormValues>,
	name: "firstSkill" | "secondSkill" | "thirdSkill"
): void => {
	switch (e.key) {
		case "ArrowDown":
			e.preventDefault();
			if (!isOpen) setIsOpen(true);
			setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredCategoryList.length);
			break;
		case "ArrowUp":
			e.preventDefault();
			if (!isOpen) setIsOpen(true);
			setHighlightedIndex(
				(prevIndex) => (prevIndex - 1 + filteredCategoryList.length) % filteredCategoryList.length
			);
			break;
		case "Enter":
			e.preventDefault();
			if (highlightedIndex !== -1 && isOpen) {
				setIsOpen(false); // Close dropdown
				setHighlightedIndex(-1); // Reset highlighted index
				const selectedOption = filteredCategoryList[highlightedIndex];
				if (selectedOption) {
					form.setValue(name, selectedOption.label, { shouldValidate: true });
				}
				void form.trigger(name); // Trigger validation for all fields on each change
			}
			break;
		case "Escape":
		case "Tab":
			if (isOpen) setIsOpen(false);
			if (highlightedIndex !== -1) setHighlightedIndex(-1);
			break;
		default:
			if (!isOpen) setIsOpen(true); // Open dropdown if starting to type
			break;
	}
};

// export const useUniqueSkillsValidation = (form: UseFormReturn<FormValues>) => {
// 	// Watch values of skill fields
// 	const firstSkill = form.watch("firstSkill");
// 	const secondSkill = form.watch("secondSkill");
// 	const thirdSkill = form.watch("thirdSkill");

// 	useEffect(() => {
// 		// Proceed with validation only if any skill has a value
// 		if (firstSkill || secondSkill || thirdSkill) {
// 			const skills = [firstSkill, secondSkill, thirdSkill];

// 			// Count occurrences of each skill to find duplicates
// 			const duplicateSkills = skills.reduce(
// 				(acc, skill) => {
// 					if (skill) {
// 						acc[skill] = (acc[skill] || 0) + 1;
// 					}
// 					return acc;
// 				},
// 				{} as Record<string, number>
// 			);

// 			// Set errors specifically for fields with duplicates
// 			if (firstSkill && (duplicateSkills[firstSkill] ?? 0) > 1) {
// 				form.setError("firstSkill", { message: "Skills must be unique." });
// 			} else {
// 				form.clearErrors("firstSkill");
// 			}

// 			if (secondSkill && (duplicateSkills[secondSkill] ?? 0) > 1) {
// 				form.setError("secondSkill", { message: "Skills must be unique." });
// 			} else {
// 				form.clearErrors("secondSkill");
// 			}

// 			if (thirdSkill && (duplicateSkills[thirdSkill] ?? 0) > 1) {
// 				form.setError("thirdSkill", { message: "Skills must be unique." });
// 			} else {
// 				form.clearErrors("thirdSkill");
// 			}
// 		}
// 	}, [firstSkill, secondSkill, thirdSkill, form]);
// };
// Hook to validate that skills are unique
export const useUniqueSkillsValidation = (form: UseFormReturn<FormValues>) => {
	const firstSkill = form.watch("firstSkill");
	const secondSkill = form.watch("secondSkill");
	const thirdSkill = form.watch("thirdSkill");

	useEffect(() => {
		// const skills = [firstSkill, secondSkill, thirdSkill];
		const skills = [firstSkill ?? "", secondSkill ?? "", thirdSkill ?? ""];
		const duplicateSkills = skills.reduce(
			(acc, skill) => {
				if (skill) acc[skill] = (acc[skill] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		form.clearErrors();
		skills.forEach((skill, index) => {
			if (skill && (duplicateSkills[skill] ?? 0) > 1) {
				const fieldName = ["firstSkill", "secondSkill", "thirdSkill"][index] as
					| "firstSkill"
					| "secondSkill"
					| "thirdSkill";
				form.setError(fieldName, { message: "Skills must be unique." });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstSkill, secondSkill, thirdSkill]);
};
