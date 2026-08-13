import type { PictumAsset } from "pictum";
import { Suspense, use } from "react";
import { useIcon } from "./helper";
import type { IconProps } from "./types";

interface ParsedIcon {
	body: string;
	viewBox: string;
}

const iconCache = new Map<string, Promise<ParsedIcon>>();

export function Icon(props: IconProps) {
	return (
		<Suspense fallback={null}>
			<ResolvedIcon {...props} />
		</Suspense>
	);
}

function ResolvedIcon({ name, options, ...svgProps }: IconProps) {
	const asset = useIcon(name, options);
	const markup = use(loadIcon(asset));

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={markup.viewBox}
			{...svgProps}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Pictum returns trusted canonical SVG markup.
			dangerouslySetInnerHTML={{ __html: markup.body }}
		/>
	);
}

function loadIcon(asset: PictumAsset): Promise<ParsedIcon> {
	const cached = iconCache.get(asset.url);
	if (cached !== undefined) {
		return cached;
	}

	const request = asset.svg().then(parseIcon);
	iconCache.set(asset.url, request);
	void request.catch(() => {
		if (iconCache.get(asset.url) === request) {
			iconCache.delete(asset.url);
		}
	});

	return request;
}

function parseIcon(svg: string): ParsedIcon {
	const root = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i.exec(svg);
	const attributes = root?.[1];
	const body = root?.[2];
	const viewBox =
		attributes === undefined
			? undefined
			: /\bviewBox\s*=\s*(["'])(.*?)\1/i.exec(attributes)?.[2];

	if (body === undefined || viewBox === undefined) {
		throw new Error("Pictum returned invalid icon SVG markup.");
	}

	return { body, viewBox };
}
