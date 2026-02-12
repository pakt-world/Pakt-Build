"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ScrollArea, ScrollBar } from "@/components/common/scroll-area";
import { type StateProps } from "@/lib/types/location";
import { lowerCase, titleCase } from "@/lib/utils";
import { useGetStates } from "@/lib/api/misc";

interface StateDropdownProps {
	onChange: (value: string) => void;
	value: string;
	countryValue: string;
}

interface SelectedValueProps {
	value: string;
	displayName?: string;
	placeholder: string;
}

export const SelectedValue = ({ value, displayName, placeholder }: SelectedValueProps): JSX.Element => {
	return (
		<span className="font-normal text-[#72777A] sm:text-body">
			{value ? displayName || value : <span className="text-gray-500">{placeholder}</span>}
		</span>
	);
};

export const StateDropdown = ({ onChange, value, countryValue }: StateDropdownProps): JSX.Element => {
	const states = useGetStates();

	// Filter states based on the selected country
	const countryStates = useMemo(
		() => (states.data || []).filter((state) => state.country_name === titleCase(countryValue)) as StateProps[],
		[states.data, countryValue]
	);

	const [open, setOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
	const [shouldOpenUp, setShouldOpenUp] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const dropdownStateRef = useRef<HTMLUListElement | null>(null);
	const selectStateRef = useRef<HTMLDivElement | null>(null);

	// Filter states based on the search term
	const filteredStates = useMemo(() => {
		const searchWords = searchTerm.toLowerCase().split(/\s+/);

		return countryStates
			.filter((state) => {
				const itemWords = state.name.toLowerCase().split(/\s+/);
				return searchWords.every((word) => itemWords.some((itemWord) => itemWord.includes(word)));
			})
			.sort((a, b) => {
				const aStartsWith = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
				const bStartsWith = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
				return aStartsWith === bStartsWith ? 0 : aStartsWith ? -1 : 1;
			});
	}, [countryStates, searchTerm]);

	const toggleDropdown = () => setOpen((prev) => !prev);

	const closeDropdown = () => {
		setOpen(false);
		setHighlightedIndex(0);
	};

	const handleSelect = (stateName: string) => {
		onChange(lowerCase(stateName));
		setSearchTerm(stateName); // Update input with selected state
		setOpen(false); // Close dropdown after selection
	};

	// === Handle keyboard navigation === //
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!open) return;

		const listLength = filteredStates?.length || 0;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === listLength - 1 ? 0 : prev + 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === 0 ? listLength - 1 : prev - 1));
		} else if (event.key === "Enter" && highlightedIndex !== null) {
			event.preventDefault();
			const selectedOption = filteredStates?.[highlightedIndex];
			if (selectedOption) {
				handleSelect(selectedOption?.name);
			}
			// Close the dropdown when the user presses the Escape key
		} else if (event.key === "Escape") {
			closeDropdown();
		}
	};

	// Find index of the selected state in the list and Scroll to the selected item when opening the dropdown
	const selectedState = (filteredStates || []).findIndex((state) => lowerCase(state.name) === value);
	useEffect(() => {
		if (open && value) {
			if (selectedState !== -1) {
				// Scroll to the selected item1
				const list = document.querySelector("ul > div:nth-of-type(2) > div > div");
				const item = list?.children[selectedState] as HTMLElement;
				item?.scrollIntoView({ block: "nearest" });
				// Set the highlighted index to the selected item
				setHighlightedIndex(selectedState);
			}
		}
	}, [open, value, selectedState]);

	// Determine if the dropdown should open upwards or downwards
	useEffect(() => {
		if (open && selectStateRef.current) {
			const rect = selectStateRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			setShouldOpenUp(rect.bottom + dropdownHeight > viewportHeight);
		}
	}, [open]);

	// Ensure the highlighted item is visible
	useEffect(() => {
		if (dropdownStateRef.current && highlightedIndex >= 0) {
			const listItem = dropdownStateRef.current.children[highlightedIndex] as HTMLElement;
			if (listItem) {
				listItem.scrollIntoView({ block: "nearest" });
			}
		}
	}, [highlightedIndex]);

	// Close the dropdown when clicked outside
	useOnClickOutside(selectStateRef, closeDropdown);

	return (
		<div ref={selectStateRef} className="relative w-full" tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				onClick={toggleDropdown}
				aria-expanded={open}
				className="flex h-[48px] w-full items-center justify-between rounded-xl border border-line px-4 text-base text-[#72777A]
					outline-none hover:!text-body sm:text-title"
				disabled={!countryValue || filteredStates?.length === 0}
				type="button"
			>
				<SelectedValue
					value={value}
					displayName={countryStates.find((state) => lowerCase(state.name) === lowerCase(value))?.name}
					placeholder="Select State"
				/>
				<ChevronsUpDown className="ml-2 size-4 shrink-0 text-[#72777A] opacity-50 sm:text-body" />
			</button>
			{open && (
				<div
					className={`absolute !z-[99] h-[250px] w-full overflow-hidden rounded-lg border bg-white p-2 pb-2 shadow-lg
					${shouldOpenUp ? "bottom-full mb-2" : "top-full mt-2"}`}
					role="listbox"
				>
					<div className="sticky top-0 z-20 bg-white">
						<input
							className="w-full rounded-lg border border-line bg-input-bg px-4 py-2 !text-base text-[#72777A] sm:text-body"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search for a state/region..."
						/>
					</div>
					<ScrollArea className="z-10 mt-2 h-[calc(100%-52px)] w-full cursor-pointer overflow-y-auto overflow-x-hidden">
						<ul ref={dropdownStateRef} className="w-full">
							{filteredStates.length > 0 ? (
								filteredStates.map((state, index) => (
									<li
										key={state.id}
										role="option"
										aria-selected={value === lowerCase(state.name)}
										onClick={() => handleSelect(state.name)}
										onMouseEnter={() => setHighlightedIndex(state.id)}
										className={`relative flex cursor-pointer items-center justify-between rounded p-2 px-4 py-2 text-base outline-none
											hover:bg-[#ECFCE5] ${highlightedIndex === index || lowerCase(state?.name) === value ? "bg-[#ECFCE5]" : ""}`}
									>
										<div className="flex items-end gap-2">
											<span className="text-[#6c757d]">{state.name}</span>
										</div>
										{value === lowerCase(state.name) && <Check className="mr-2 h-4 w-4" />}
									</li>
								))
							) : (
								<li className="px-4 py-2 text-center text-sm text-gray-500">No state found.</li>
							)}
						</ul>
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</div>
			)}
		</div>
	);
};
