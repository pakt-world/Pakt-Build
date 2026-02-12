type LinkCheckType = (link: string) => string;

export const linkChecker: LinkCheckType = (link: string): string => {
	if (!link) {
		return "";
	}
	if (!link.includes("https://")) {
		return `https://${link}`;
	}
	return link;
};
