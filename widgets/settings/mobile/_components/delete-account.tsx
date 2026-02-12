/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import DeleteAccount from "@/widgets/settings/_shared/delete-account";

export const DeleteAccountMobile = (): JSX.Element => {
	return (
		<div className="relative z-[2] size-full overflow-hidden bg-white">
			<DeleteAccount />
		</div>
	);
};
