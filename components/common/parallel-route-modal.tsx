"use client";

import React, { ReactNode } from "react";
import { Modal } from "./headless-modal";
import { useRouter } from "next/navigation";
// import { Modal } from './modal'

export const ParallelRouteModal = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	const handleOpenChange = () => {
		router.back();
	};
	return (
		<Modal isOpen closeModal={handleOpenChange}>
			{children}
		</Modal>
	);
};
