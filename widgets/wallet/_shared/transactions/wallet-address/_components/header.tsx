"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { X } from "lucide-react";
import { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

interface WalletAddressHeaderProps {
	title: string | ReactNode;
	close?: () => void;
	className?: string;
}

export const WalletAddressHeader = ({ title, close, className }: WalletAddressHeaderProps) => {
	return (
		<div className={`flex items-center justify-between ${className}`}>
			<h2 className="text-lg font-semibold">{title}</h2>
			<Button
				variant="ghost"
				onClick={close}
				className="size-fit rounded-full border border-body p-1 text-body max-sm:hidden"
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
};
