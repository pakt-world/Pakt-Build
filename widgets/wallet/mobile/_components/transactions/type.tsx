"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ArrowDownLeft, ArrowUpRight, Circle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TransactionType as TransactionTypeEnum } from "@/lib/enums";
import { ElementType } from "react";

export const MobileTransactionType = ({ type }: { type: TransactionTypeEnum }): JSX.Element => {
	let color: string;
	let Icon: ElementType;

	switch (type) {
		case TransactionTypeEnum.DEPOSIT:
			color = "success";
			Icon = ArrowDownLeft;
			break;
		case TransactionTypeEnum.WITHDRAWAL:
			color = "danger";
			Icon = ArrowUpRight;
			break;
		default:
			color = "gray-300";
			Icon = Circle;
			break;
	}

	return (
		<div className="flex items-center gap-2">
			<div className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}>
				<Icon className={`text-${color}`} size={12} />
			</div>
			<span className="text-sm capitalize text-[#787389]">{type}</span>
		</div>
	);
};
