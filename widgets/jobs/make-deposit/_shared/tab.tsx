/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Info } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Checkbox } from "@/components/common/checkbox";
import { PaymentMethodType } from "@/lib/enums";

export const PaymentMethodTab = ({
	paymentMethod,
	paymentMethods,
	setPaymentMethod,
}: {
	paymentMethod: PaymentMethodType;
	paymentMethods: { label: string; value: PaymentMethodType }[];
	setPaymentMethod: (method: PaymentMethodType) => void;
}) => {
	const smallerScreen = useMediaQuery("(max-width: 640px)");
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div className="flex items-center gap-2 sm:gap-4">
			{paymentMethods.map((method) => (
				<button
					key={method.value}
					className="flex items-center gap-2 rounded-xl border border-line bg-white p-2 text-base font-medium sm:p-4 sm:text-lg"
					onClick={() => setPaymentMethod(method.value)}
					type="button"
				>
					{method.label === "stripe" && (
						<div
							className="relative"
							// Desktop
							onMouseEnter={() => {
								if (!smallerScreen) setShowInfo(true);
							}}
							onMouseLeave={() => {
								if (!smallerScreen) setShowInfo(false);
							}}
							// Mobile
							onClick={(e) => {
								e.stopPropagation();
								if (smallerScreen) setShowInfo(!showInfo);
							}}
						>
							<Info size={16} className="text-blue-darkest" />
							{showInfo && (
								<div
									className="absolute -left-8 -top-[110px] w-[216px] rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] p-2 shadow-lg sm:-top-[70px]
										sm:left-0 sm:w-[400px] sm:px-4"
								>
									<p className="text-sm italic text-blue-darkest">
										Stripe empowers you to pay with Credit Card, Apple Pay, Google Pay, Cash App,
										WeChat Pay and Bank Transfer
									</p>
									<div
										className="absolute left-10 top-full h-0 w-0 -translate-x-1/2 transform border-l-8 border-r-8 border-t-8 border-l-transparent
											border-r-transparent border-t-[#BFDBFE] sm:left-4"
									/>
								</div>
							)}
						</div>
					)}
					{method.label}
					<Checkbox
						id={`payment-method-(${method})`}
						checked={method.value === paymentMethod}
						onCheckedChange={() => setPaymentMethod(method.value)}
						className="checkbox_style !size-[20px] sm:!size-[24px]"
					/>
				</button>
			))}
		</div>
	);
};
