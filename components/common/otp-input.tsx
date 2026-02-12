/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import ReactOtpInput from "react-otp-input";

interface OtpInputProps {
	value: string;
	numInputs: number;
	onChange: (otp: string) => void;
}

export const OtpInput: FC<OtpInputProps> = ({ numInputs, onChange, value, ...props }) => {
	return (
		<ReactOtpInput
			numInputs={numInputs || 6}
			onChange={onChange}
			value={value}
			containerStyle="gap-4 flex"
			// inputStyle="otp_style"
			inputType="number"
			renderInput={(inputProps) => {
				return (
					<input
						{...inputProps}
						className="otp_style !pl-0 !pr-0 text-center text-base outline-none"
						style={{
							borderRadius: "10px",
							border: "1px solid #E0E0E0",
							background: "#F5F5F5",
						}}
						type="number"
					/>
				);
			}}
			{...props}
		/>
	);
};

OtpInput.displayName = "OtpInput";
