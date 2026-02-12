/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface Props {
	isOpen: boolean;
	className?: string;
	children: React.ReactNode;
	onOpenChange: (open: boolean) => void;
	disableClickOutside?: boolean;
}

export const Modal: FC<Props> = ({ children, isOpen, onOpenChange, className, disableClickOutside }) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay
					className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-none duration-200 data-[state=open]:animate-in
						data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
				/>
				<Dialog.Content
					className={cn(
						`fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-transparent
						shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] duration-200
						focus:outline-none data-[state=open]:animate-contentShow`,
						className
					)}
					onInteractOutside={(e) => {
						if (disableClickOutside) {
							e.preventDefault();
						}
					}}
				>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
