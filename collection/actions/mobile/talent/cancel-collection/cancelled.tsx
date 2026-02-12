/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import warning from "@/lottiefiles/warning.json";
import { Button } from "@/components/common/button";
import Lottie from "@/components/common/lottie";

interface Props {
	closeMobileSheet: () => void;
}

export const CollectionHasBeenCancelled4Mobile = ({ closeMobileSheet }: Props): JSX.Element => {
	const router = useRouter();
	return (
		<div className="size-full overflow-y-auto">
			<div className="flex h-full flex-col items-center justify-center bg-red-50 text-body">
				<div className="flex w-[200px] items-center justify-center">
					<Lottie animationData={warning} loop={false} />
				</div>
				<span>This Job has been cancelled</span>
				<div className="mt-8 w-full max-w-[200px]">
					<Button
						fullWidth
						size="md"
						onClick={() => {
							closeMobileSheet();
							router.push("/dashboard");
						}}
						variant="primary"
					>
						Go To Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
};
