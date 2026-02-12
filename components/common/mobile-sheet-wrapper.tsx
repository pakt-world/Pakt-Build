"use client";

interface MobileSheetWrapperProps {
	children: React.ReactNode;
	isOpen: boolean;
	className?: string;
}

export const MobileSheetWrapper = ({ children, isOpen, className }: MobileSheetWrapperProps): JSX.Element => {
	return (
		<div
			className={`fixed top-16 z-50 h-[calc(100vh-70px)] w-full overflow-y-scroll bg-white transition-all ease-in-out
				${isOpen ? "right-0" : "-right-full"} ${className}`}
		>
			<div className="relative size-full">{children}</div>
		</div>
	);
};
