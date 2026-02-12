/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn, disallowedChars, filterSkillsByName, rejectSpecialCharacters, sentenceCase } from "@/lib/utils";
import { useGetCategory } from "@/lib/api/category";
import { Spinner } from "./loader";

interface TagInputProps<T extends FieldValues> {
	tags: string[];
	setTags: (tags: string[]) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	form?: UseFormReturn<T> | undefined;
	onBlur: () => void;
	fieldName: Path<T>;
}

export const TagInput = <T extends FieldValues>({
	tags,
	setTags,
	className,
	placeholder,
	disabled,
	form,
	onBlur,
	fieldName,
}: TagInputProps<T>) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");

	const debouncedInputValue = useDebounce(inputValue, 500);

	const ref = useRef<HTMLDivElement | null>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if ((event.key === "Enter" || event.key === ",") && inputValue.trim() !== "") {
			// Validate the input when it changes
			event.preventDefault();
			if (rejectSpecialCharacters(inputValue)) {
				setTags([...tags, inputValue.trim()]);
				setInputValue("");
			}
		}
		if (event.key === "Backspace" && inputValue === "") {
			setTags(tags.slice(0, -1));
		}
		// Open the dropdown when the user types
		if (event.key.length === 1) {
			setIsOpened(true);
		} else {
			setIsOpened(false);
		}
	};

	const { data, isFetching, isLoading } = useGetCategory(debouncedInputValue);
	const categories = data?.data ?? [];
	const ct = filterSkillsByName(categories, disallowedChars);

	const CATEGORY_LIST: Array<{ label: string; value: string }> = (ct || []).map((c) => ({
		label: sentenceCase(c.name),
		value: sentenceCase(c.name),
	}));

	// Filter with skillValue/inputValue
	const filteredCategoryList = CATEGORY_LIST.filter((category) => {
		return category.label.toLowerCase().includes(inputValue.toLowerCase());
	});

	const handleClickOutside = (): void => {
		setIsOpened(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	useEffect(() => {
		if (filteredCategoryList.length === 0 && !isLoading && !isFetching) {
			setIsOpened(false);
		}
	}, [filteredCategoryList.length, isFetching, isLoading]);

	useEffect(() => {
		// Throw form error if isNot valid
		if (form) {
			const hasSpecialCharacters = !rejectSpecialCharacters(inputValue) && inputValue !== "";
			const currentError = form.getFieldState(fieldName).error;

			if (hasSpecialCharacters && !currentError) {
				form.setError(fieldName, {
					type: "manual",
					message: "Special characters are not allowed",
				});
			} else if (!hasSpecialCharacters && currentError) {
				form.clearErrors(fieldName);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, inputValue]);
	return (
		<div
			className={`${cn( `flex flex-wrap items-center gap-2 rounded-lg border border-line px-2 py-2 duration-200 hover:border-line
				group-focus-within:border-line peer-focus-within:border-line`, className )}`}
		>
			{tags.map((tag) => (
				<div
					key={tag}
					className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-secondary px-3 py-1 text-sm
						text-[#198155]"
				>
					<span>{tag}</span>
					<button
						type="button"
						className="text-[#198155]"
						onClick={() => {
							setTags(tags.filter((t) => t !== tag));
						}}
						aria-label="Close"
					>
						<X size={16} strokeWidth={1} />
					</button>
				</div>
			))}
			<div className="relative !w-[300px]">
				<input
					data-test-id="tag-input"
					type="text"
					className="peer w-full grow !bg-transparent outline-none disabled:!bg-transparent"
					placeholder={placeholder ?? "Add skills"}
					value={inputValue}
					onChange={(event) => {
						setInputValue(event.target.value);
					}}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					onBlur={() => {
						onBlur();
					}}
				/>
				{isOpened && (
					<div
						className="absolute z-50 max-h-[230px] min-w-[271px] translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg
							border border-green-300 bg-white p-4 shadow"
						ref={ref}
					>
						{isFetching || isLoading ? (
							<Spinner />
						) : (
							<>
								{filteredCategoryList.map(({ label, value: v }) => (
									<div
										key={v}
										className="relative flex w-full cursor-pointer select-none items-center rounded p-2 text-base outline-none hover:bg-[#ECFCE5]"
										onClick={() => {
											setIsOpened(false);
											setTags([...tags, label]);
											setInputValue("");
										}}
										onKeyDown={handleKeyDown}
										role="button"
										tabIndex={0}
									>
										{label}
										{label === inputValue && (
											<span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
												<Check className="h-4 w-4" />
											</span>
										)}
									</div>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

interface TagInputProps2 {
	tags: string[];
	setTags: (tags: string[]) => void;
	className?: string;
	placeholder?: string;
}

export const TagInput2: FC<TagInputProps2> = ({ tags, setTags, className, placeholder }) => {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === "Enter" && inputValue.trim() !== "") {
			event.preventDefault();
			setTags([...tags, inputValue.trim()]);
			setInputValue("");
		}
		if (event.key === "Backspace" && inputValue === "") {
			setTags(tags.slice(0, -1));
		}
	};

	return (
		<div
			className={`${cn( `flex flex-wrap items-center gap-2 rounded-lg border border-line px-2 py-2 duration-200 hover:border-line
				group-focus-within:border-line peer-focus-within:border-line`, className )}`}
		>
			{tags.map((tag) => (
				<div
					key={tag}
					className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-[#ECFCE5] px-3 py-1 text-sm
						text-[#198155]"
				>
					<span>{tag}</span>
					<button
						type="button"
						className="text-[#198155]"
						onClick={() => {
							setTags(tags.filter((t) => t !== tag));
						}}
						aria-label="Close"
					>
						<X size={16} strokeWidth={1} />
					</button>
				</div>
			))}
			<input
				type="text"
				className="peer flex-grow outline-none"
				placeholder={placeholder ?? "Add skills"}
				value={inputValue}
				onChange={(event) => {
					setInputValue(event.target.value);
				}}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};
