"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, ChevronsUpDown } from "lucide-react";
import { type UseFormSetValue } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { lowerCase } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/common/scroll-area";
import { type EditProfileFormValues } from "@/widgets/settings/desktop/edit-profile";
import { useGetCountries } from "@/lib/api/misc";
import { CountryProps } from "@/lib/types/location";

interface CountryDropdownProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	value: string;
	setValue?: UseFormSetValue<EditProfileFormValues>;
}

interface SelectedCountryProps {
	value: string | null; // The selected country value (name)
	data: CountryProps[]; // The array of country data
}

const SelectedCountry: React.FC<SelectedCountryProps> = ({ value, data }) => {
	const selectedCountry = useMemo(
		() => data.find((country) => lowerCase(country.name) === lowerCase(value ?? "")),
		[value, data]
	);

	if (!selectedCountry) {
		return <span>{value ? "Country not found" : "Select Country..."}</span>;
	}

	return (
		<div className="flex items-end gap-2">
			<span>{selectedCountry.emoji}</span>
			<span>{selectedCountry.name}</span>
		</div>
	);
};

export const CountryDropdown = ({ disabled, onChange, value, setValue }: CountryDropdownProps): JSX.Element => {
	const { data: countries } = useGetCountries();
	const [open, setOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
	const [shouldOpenUp, setShouldOpenUp] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const dropdownCountryRef = useRef<HTMLUListElement | null>(null);
	const selectCountryRef = useRef<HTMLDivElement>(null);

	// === Filter countries based on search term === //
	const filteredCountries = useMemo(() => {
		if (!searchTerm) return countries;

		const lowerSearchTerm = searchTerm.toLowerCase();
		return countries
			?.filter((country) => country.name.toLowerCase().includes(lowerSearchTerm))
			.sort((a, b) => {
				const aStartsWith = a.name.toLowerCase().startsWith(lowerSearchTerm);
				const bStartsWith = b.name.toLowerCase().startsWith(lowerSearchTerm);
				return aStartsWith === bStartsWith ? 0 : aStartsWith ? -1 : 1;
			});
	}, [countries, searchTerm]);

	const toggleDropdown = () => !disabled && setOpen((prev) => !prev);

	const closeDropdown = () => {
		setOpen(false);
		setHighlightedIndex(0);
	};

	const handleOptionSelect = (selectedValue: string) => {
		onChange(selectedValue);
		setValue?.("location", "");
		closeDropdown();
	};

	// === Handle keyboard navigation === //
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!open) return;

		const listLength = filteredCountries?.length || 0;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === listLength - 1 ? 0 : prev + 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === 0 ? listLength - 1 : prev - 1));
		} else if (event.key === "Enter" && highlightedIndex !== null) {
			event.preventDefault();
			const selectedOption = filteredCountries?.[highlightedIndex];
			if (selectedOption) {
				handleOptionSelect(selectedOption?.name);
			}
			// Close the dropdown when the user presses the Escape key
		} else if (event.key === "Escape") {
			closeDropdown();
		}
	};

	// Find index of the selected country in the list and Scroll to the selected item when opening the dropdown
	const selectedCountry = (filteredCountries || []).findIndex((country) => lowerCase(country.name) === value);
	useEffect(() => {
		if (open && value) {
			if (selectedCountry !== -1) {
				// Scroll to the selected item1
				const list = document.querySelector("ul > div:nth-of-type(2) > div > div");
				const item = list?.children[selectedCountry] as HTMLElement;
				item?.scrollIntoView({ block: "nearest" });
				// Set the highlighted index to the selected item
				setHighlightedIndex(selectedCountry);
			}
		}
	}, [open, value, selectedCountry]);

	// Determine if the dropdown should open upwards or downwards
	useEffect(() => {
		if (open && selectCountryRef.current) {
			const rect = selectCountryRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			setShouldOpenUp(rect.bottom + dropdownHeight > viewportHeight);
		}
	}, [open]);

	// Ensure the highlighted item is visible
	useEffect(() => {
		if (dropdownCountryRef.current && highlightedIndex >= 0) {
			const listItem = dropdownCountryRef.current.children[highlightedIndex] as HTMLElement;
			if (listItem) {
				listItem.scrollIntoView({ block: "nearest" });
			}
		}
	}, [highlightedIndex]);

	// Close the dropdown when clicked outside
	useOnClickOutside(selectCountryRef, closeDropdown);

	return (
		<div ref={selectCountryRef} className="relative w-full" tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				onClick={toggleDropdown}
				aria-expanded={open}
				className="flex h-[48px] w-full items-center justify-between rounded-xl border border-line px-4 text-base text-[#72777A]
					outline-none hover:!text-body sm:text-title"
				disabled={disabled}
				type="button"
			>
				<SelectedCountry value={value} data={countries || []} />
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</button>
			{open && (
				<div
					className={`absolute !z-[99] h-[250px] w-full overflow-x-hidden rounded-lg border bg-white p-2 shadow-lg
					${shouldOpenUp ? "bottom-full mb-2" : "top-full mt-2"}`}
					role="listbox"
				>
					<div className="sticky top-0 z-20 bg-white">
						<input
							className="w-full rounded-lg border border-line bg-input-bg px-4 py-2 !text-base text-[#72777A] sm:text-body"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search country..."
						/>
					</div>
					<ScrollArea className="z-10 mt-2 h-[calc(100%-52px)] w-full cursor-pointer overflow-y-auto overflow-x-hidden">
						<ul ref={dropdownCountryRef} className="w-full">
							{(filteredCountries || []).length > 0 ? (
								filteredCountries?.map((country, index) => {
									return (
										<li
											key={country.id}
											role="option"
											aria-selected={value === country?.name}
											onClick={() => handleOptionSelect(country.name)}
											onMouseEnter={() => setHighlightedIndex(index)}
											className={`relative flex cursor-pointer items-center justify-between rounded p-2 px-4 py-2 text-base outline-none
												hover:bg-[#ECFCE5] ${highlightedIndex === index || lowerCase(country?.name) === value ? "bg-[#ECFCE5]" : ""}`}
										>
											<div className="flex items-end gap-2">
												<span>{country.emoji}</span>
												<span className="text-[#6c757d]">{country.name}</span>
											</div>
											{value === lowerCase(country.name) && <Check className="mr-2 h-4 w-4" />}
										</li>
									);
								})
							) : (
								<li className="p-2 text-center text-gray-500">No results found</li>
							)}
						</ul>
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</div>
			)}
		</div>
	);
};
