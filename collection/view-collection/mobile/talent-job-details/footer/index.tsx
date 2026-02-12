/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentOpenJobCtas4Mobile, type TalentOpenJobCtasProps4Mobile } from "./open";
import { TalentPrivateJobCtas4Mobile, type TalentPrivateJobCtasProps4Mobile } from "./private";

export const CTAS: {
	open: React.FC<TalentOpenJobCtasProps4Mobile>;
	private: React.FC<TalentPrivateJobCtasProps4Mobile>;
} = {
	open: TalentOpenJobCtas4Mobile,
	private: TalentPrivateJobCtas4Mobile,
};
