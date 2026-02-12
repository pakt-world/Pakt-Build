"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatDistance } from "date-fns";
import {
	memo,
	// useEffect,
	// useState
} from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../common/button";
import { Modal } from "../common/headless-modal";
import { emptyFunction } from "@/lib/utils";

interface SessionTimeoutAlertProps {
	isTimeoutModalOpen: boolean;
	getRemainingTime: () => number;
	stayActive: () => void;
	Logout: () => void;
}

const SessionTimeoutAlert = ({
	isTimeoutModalOpen,
	getRemainingTime,
	stayActive,
	Logout,
}: SessionTimeoutAlertProps): JSX.Element => {
	// const [remainingTime, setRemainingTime] = useState(0);
	// useEffect(() => {
	// 	const updateRemainingTime = () => {
	// 		setRemainingTime(getRemainingTime());
	// 	};
	// 	const intervalId = setInterval(updateRemainingTime, 1000);

	// 	return () => {
	// 		clearInterval(intervalId);
	// 	};
	// }, [getRemainingTime]);

	return (
		<Modal
			isOpen={isTimeoutModalOpen}
			closeModal={() => {
				emptyFunction();
			}}
			disableClickOutside
		>
			<div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-4 py-4 text-center">
				<h2 className="text-2xl font-bold text-title">Session Expiring</h2>
				<p className="text-body">
					Logging out{" "}
					<span className="">
						{formatDistance(getRemainingTime(), 0, {
							includeSeconds: true,
							addSuffix: true,
						})}
					</span>
				</p>

				<div className="flex w-full items-center gap-1">
					<Button size="lg" fullWidth variant="secondary" className="scale-90" onClick={Logout}>
						Log Out
					</Button>
					<Button size="lg" fullWidth variant="primary" className="scale-95" onClick={stayActive}>
						Stay Active
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default memo(SessionTimeoutAlert);
