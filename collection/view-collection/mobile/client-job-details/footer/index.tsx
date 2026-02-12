/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientOpenJobCtas4Mobile, type ClientOpenJobCtasProps4Mobile } from "./open";
import { ClientPrivateJobCtas4Mobile, type ClientPrivateJobCtasProps4Mobile } from "./private";

export const CTAS: {
	open: FC<ClientOpenJobCtasProps4Mobile>;
	private: FC<ClientPrivateJobCtasProps4Mobile>;
} = {
	open: ClientOpenJobCtas4Mobile,
	private: ClientPrivateJobCtas4Mobile,
};
