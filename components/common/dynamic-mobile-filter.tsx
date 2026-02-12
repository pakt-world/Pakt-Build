/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown, Search } from "lucide-react";
import { ReactElement, ReactNode, useEffect, useMemo, useRef } from "react";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "@/components/common/button";
import { SelectDropdown } from "./select-dropdown";
import { RadioGroup } from "./radio-group";

export enum InputType {
	Text = "text",
	Numeric = "number",
	Select = "select",
	Radio = "radio",
}

export interface Option {
	label: string;
	value: string;
}

export interface DynamicInput {
	id: string;
	type: InputType;
	label?: string;
	placeholder?: string;
	value: string | string[] | number | Option;
	onChange: (value: string | number | Option) => void;
	inputComponent?: React.ComponentType<any>; // For custom input components
	props?: Record<string, any>; // Additional props for the input component
	isFullWidth?: boolean; // Optional override for width
	disabled?: boolean;
	options?: Option[] | string[];
}

interface MobileSearchProps {
	inputs: DynamicInput[][];
	onSubmit: (closeModal?: boolean) => void;
	modalTitle?: string;
	isModalOpen: boolean;
	toggleModal: (state: boolean) => void;
	top: string;
	bottom: string;
	trigger?: ReactElement;
	buttonLabel?: string;
}

const InputWrapper = ({ children, inputClassName }: { children: ReactNode; inputClassName: string }) => {
	return <div className={`relative ${inputClassName}`}>{children}</div>;
};

export const DynamicMobileSearch = ({
	inputs,
	onSubmit,
	modalTitle,
	isModalOpen,
	toggleModal,
	top,
	bottom,
	trigger,
	buttonLabel,
}: MobileSearchProps): JSX.Element => {
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const searchIconRef = useRef<HTMLDivElement>(null);

	const allInputValues = useMemo(() => {
		return inputs.flat().map((input) => input.value);
	}, [inputs]);

	const debouncedValues = useDebounce(allInputValues, 500);

	useEffect(() => {
		if (isModalOpen) {
			onSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValues]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
			document.documentElement.style.overflow = "unset";
		}
	}, [isModalOpen]);

	// Handle click outside of modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node) &&
				searchIconRef.current &&
				!searchIconRef.current.contains(event.target as Node)
			) {
				toggleModal(false);
			}
		};

		// Handle iOS keyboard issues
		const handleIOSKeyboard = () => {
			if (isModalOpen && searchContainerRef.current) {
				searchContainerRef.current.style.height = `${window.innerHeight}px`;

				if (window.visualViewport) {
					const keyboardHeight = window.innerHeight - window.visualViewport.height;
					searchContainerRef.current.style.paddingBottom = `${keyboardHeight}px`;
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", handleIOSKeyboard);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			if (window.visualViewport) {
				window.visualViewport.removeEventListener("resize", handleIOSKeyboard);
			}
		};
	}, [isModalOpen, toggleModal]);

	return (
		<div className="relative flex flex-1 items-center justify-end">
			{/* Trigger */}
			<div
				onClick={() => toggleModal(!isModalOpen)}
				ref={searchIconRef}
				className="cursor-pointer rounded-full bg-transparent p-2"
			>
				{trigger ? trigger : <Search className="h-6 w-6 text-title transition-transform" />}
			</div>
			<div
				className={`b_modal fixed right-0 !z-50 flex w-full transform flex-col gap-4 bg-product-bg shadow-lg transition-transform
					duration-300 ease-in-out sm:hidden
					${isModalOpen ? `${bottom} ${top} translate-y-0 opacity-100` : "bottom-0 top-0 translate-y-full opacity-0"}`}
				ref={searchContainerRef}
			>
				{/* Header */}
				<div className="mt-2 flex w-full flex-col items-center justify-center">
					<div className="flex h-6 w-6 flex-col items-center justify-center rounded-lg bg-[#00000033]">
						<ChevronDown
							className="h-8 w-8 rounded-md bg-opacity-30 text-title"
							onClick={(e) => {
								e.stopPropagation();
								toggleModal(false);
							}}
							role="button"
							tabIndex={0}
							aria-label="close"
						/>
					</div>
				</div>

				{/* Dynamic Inputs */}
				<div className="flex-grow space-y-4 overflow-y-auto px-5 py-2 pb-[200px]">
					{modalTitle && <h2 className="text-center text-lg font-semibold text-title">{modalTitle}</h2>}
					<div className="inputs-container">
						{inputs.map((row, rowIndex) => (
							<InputWrapper
								key={`row-${rowIndex}`}
								inputClassName={`flex ${row.length === 1 ? "flex-col" : "flex-row gap-4"} items-end`}
							>
								{row.map((input) => {
									const InputComponent = input.inputComponent || "input";
									return (
										<>
											{input.type === InputType.Text || input.type === InputType.Numeric ? (
												<div
													key={input.id}
													className={`mb-4 flex flex-col gap-1 ${row.length === 1 || input.isFullWidth ? "w-full" : "w-1/2"}`}
												>
													{input.label && (
														<label htmlFor={input.id} className="block text-sm text-body">
															{input.label}
														</label>
													)}
													<InputComponent
														id={input.id}
														type={input.type}
														value={input.value as string | number}
														placeholder={input.placeholder}
														onChange={(e: any) => input.onChange(e.target.value)}
														className="block h-11 w-full rounded-lg border border-line bg-input-bg px-3 focus:outline-none"
														{...input.props}
													/>
												</div>
											) : input.type === InputType.Select ? (
												<div
													key={input.id}
													className={`mb-4 flex flex-col gap-1 ${row.length === 1 || input.isFullWidth ? "w-full" : "w-1/2"}`}
												>
													{input.label && (
														<label htmlFor={input.id} className="block text-sm text-body">
															{input.label}
														</label>
													)}
													<SelectDropdown
														options={input?.options as Option[]}
														value={input.value as Option}
														onChange={(value: Option) => input.onChange(value)}
														placeholder={input.placeholder}
														disabled={input.disabled}
														triggerClassName="h-10 w-full sm:w-[180px] sm:text-base"
													/>
												</div>
											) : input.type === InputType.Radio ? (
												<div
													key={input.id}
													className={`mb-4 flex flex-col gap-1 ${row.length === 1 || input.isFullWidth ? "w-full" : "w-1/2"}`}
												>
													{input.label && (
														<label htmlFor={input.id} className="block text-sm text-body">
															{input.label}
														</label>
													)}
													<RadioGroup
														options={input.options as string[]}
														value={input.value as string[]}
														onChange={(value: string) => input.onChange(value)}
														name="example"
														className="gap-4"
													/>
												</div>
											) : null}
										</>
									);
								})}
							</InputWrapper>
						))}

						<Button variant="primary" fullWidth onClick={() => onSubmit()} className="mt-4 h-[51px]">
							{buttonLabel || "Search"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
