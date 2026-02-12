/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Archivo } from "next/font/google";

/* istanbul ignore next */
export const archivo = Archivo({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	subsets: ["latin-ext", "vietnamese"],
});
