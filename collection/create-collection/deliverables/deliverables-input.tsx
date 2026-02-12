"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Dispatch, FC, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

interface DeliverablesProps {
	deliverables: string[];
	setDeliverables: Dispatch<React.SetStateAction<string[]>>;
}

export const DeliverablesInput: FC<DeliverablesProps> = ({ deliverables, setDeliverables }) => {
	const MAX_DELIVERABLES = 5;
	const deliverableListRef = useRef<HTMLDivElement>(null);
	const newTextareaRef = useRef<HTMLTextAreaElement>(null);

	const addDeliverable = (): void => {
		const newDeliverables = [...deliverables, ""];
		setDeliverables(newDeliverables);
	};

	useEffect(() => {
		// Focus on the last textarea when a new deliverable is added
		if (newTextareaRef.current) {
			newTextareaRef.current.focus();
			newTextareaRef.current.setSelectionRange(0, 0);
			newTextareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [deliverables.length]);

	const deleteDeliverable = (deliverableIndex: number): void => {
		const newDeliverables = deliverables.filter((_, index) => index !== deliverableIndex);
		setDeliverables(newDeliverables);
	};

	const editDeliverable = (deliverableIndex: number, newDeliverable: string): void => {
		const updatedDeliverables = deliverables.map((d, index) => (index === deliverableIndex ? newDeliverable : d));
		setDeliverables(updatedDeliverables);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if (e.key === "Enter" && deliverables.length < MAX_DELIVERABLES) {
			addDeliverable();
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-2" ref={deliverableListRef}>
				{deliverables.map((deliverable, index) => {
					const isLastDeliverable = index === deliverables.length - 1;
					return (
						<div key={index} className="flex gap-2">
							<div className="relative w-full rounded-lg border border-green-lighter pr-16 hover:border-line hover:duration-200">
								<textarea
									ref={isLastDeliverable ? newTextareaRef : null}
									contentEditable
									data-index={index}
									value={deliverable}
									onKeyDown={handleKeyDown}
									onChange={(e) => {
										editDeliverable(index, e.target.value);
									}}
									style={{
										fontSize: "16px", // Prevent iOS zooming
										lineHeight: "1.5", // Improve touch targets
									}}
									maxLength={120}
									className="w-full resize-none rounded-lg px-4 py-2 text-base outline-none focus-within:border-none"
								/>
								<div className="absolute bottom-0 right-0 top-0 flex w-[64px] items-center justify-center rounded-lg text-sm text-body">
									{deliverable.length}/120
								</div>
							</div>
							<button
								type="button"
								onClick={() => {
									deleteDeliverable(index);
								}}
								className="flex shrink-0 basis-[50px] items-center justify-center rounded-lg border border-line bg-slate-50 shadow duration-200
									hover:bg-gray-100"
								aria-label="Delete Deliverable"
							>
								<Trash2 size={20} strokeWidth={2} className="text-danger" />
							</button>
						</div>
					);
				})}
			</div>

			{deliverables.length < MAX_DELIVERABLES && (
				<button
					type="button"
					onClick={addDeliverable}
					disabled={deliverables.length === MAX_DELIVERABLES}
					className="flex items-center justify-center rounded-3xl border border-primary border-opacity-30 bg-success bg-opacity-10 px-2 py-2
						text-center text-base text-primary duration-200 hover:bg-opacity-20 disabled:opacity-50 sm:rounded-lg"
				>
					<div className="flex items-center gap-2">
						<Plus size={18} strokeWidth={2} />
						<span>Add New Deliverable</span>
					</div>
				</button>
			)}
		</div>
	);
};
