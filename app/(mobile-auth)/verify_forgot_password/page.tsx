"use client";

import ResetPasswordVerificationForm from "@/widgets/authentication/_shared/forgot-password/_components/verification-form";

const Page = () => {
	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<ResetPasswordVerificationForm />
		</div>
	);
};

export default Page;
