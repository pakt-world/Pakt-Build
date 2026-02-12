"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../common/button";
import { Modal } from "../common/headless-modal";

interface LogoutConfirmationProps {
	showLogoutConfirmation: boolean;
	stayActive: () => void;
	Logout: () => void;
}

const LogoutConfirmation = ({ showLogoutConfirmation, stayActive, Logout }: LogoutConfirmationProps): JSX.Element => {
	return (
		<Modal
			isOpen={showLogoutConfirmation}
			closeModal={() => {
				stayActive();
			}}
			// disableClickOutside
		>
			<div className="relative flex w-full flex-col items-center gap-4 !overflow-hidden rounded-xl bg-white p-4 text-center">
				<h2 className="z-[2] text-2xl font-bold text-title">Logout</h2>
				<p className="text-body">Do you want to logout of pakt.build?</p>

				<div className="z-[2] flex w-full items-center gap-1">
					<Button fullWidth variant="secondary" className="scale-95" onClick={stayActive}>
						No
					</Button>
					<Button fullWidth variant="primary" onClick={Logout}>
						Yes
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default memo(LogoutConfirmation);
