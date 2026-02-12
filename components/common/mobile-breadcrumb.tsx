"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
	label: string;
	action?: () => void;
	active?: boolean;
	link?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

export const MobileBreadcrumb: FC<BreadcrumbProps> = ({ items, className }) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleItemClick = (index: number): void => {
		setActiveIndex(index);
		if (items[index]?.action) {
			items[index]?.action?.();
		}
	};

	return (
		<div
			className={`sticky left-0 top-[0px] !z-50 inline-flex !min-h-[43px] w-full flex-col items-start justify-center gap-2.5 border-y
				border-green-lighter !bg-white px-4 sm:hidden ${className}`}
		>
			<div className="flex h-full items-center justify-center gap-2">
				{items?.map((item, index) => (
					<div key={index} className="flex h-full items-center gap-2">
						{index !== 0 && <ChevronRight size={16} className="text-title" />}
						<Link
							href={item.link ?? "#"}
							className={`max-w-[200px] truncate text-sm leading-[21px] tracking-wide
							${(item.active ?? index === activeIndex) ? "font-semibold !text-primary" : "!text-title"}`}
							onClick={(e) => {
								e.stopPropagation();
								handleItemClick(index);
							}}
						>
							{item.label}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};
