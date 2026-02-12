"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { AuthEnums } from "@/lib/enums";
import { useGetParams } from "@/hooks/use-get-params";
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void;
	className?: string;
	children?: React.ReactNode;
	disableClickOutside?: boolean;
}

export const Modal: FC<ModalProps> = ({ children, isOpen, closeModal, className, disableClickOutside }) => {
	const router = useRouter();
	const auth = useGetParams("auth");

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative !z-[79]"
				onClose={() => {
					if (!disableClickOutside) {
						closeModal();
					}
				}}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out "
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						{auth === AuthEnums.LOGIN && (
							<div
								className="!absolute inset-0 !z-[9] !size-full cursor-pointer overflow-auto bg-black bg-opacity-50"
								onClick={() => {
									router.push("/");
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									router.push("/");
								}}
							/>
						)}
						<Transition.Child
							as={Fragment}
							enter="ease-out "
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel
								className={cn(
									"relative !z-10 w-full max-w-lg transform overflow-hidden bg-transparent text-left align-middle transition-all",
									className
								)}
							>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
