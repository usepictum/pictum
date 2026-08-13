import type { PlaceholderOptions } from "pictum";
import { usePlaceholder } from "./helper";
import type { PlaceholderProps } from "./types";

export function Placeholder({
	size,
	width,
	height,
	format,
	density,
	background,
	color,
	text,
	options,
	alt,
	...imageProps
}: PlaceholderProps) {
	const dimensions =
		size === undefined
			? { width: width as number, height: height as number }
			: { size };
	const helperOptions = {
		...(options ?? {}),
		...dimensions,
		...(format === undefined ? {} : { format }),
		...(density === undefined ? {} : { density }),
		...(background === undefined ? {} : { background }),
		...(color === undefined ? {} : { color }),
		...(text === undefined ? {} : { text }),
	} as PlaceholderOptions;
	const asset = usePlaceholder(helperOptions);

	return (
		<img
			{...imageProps}
			src={asset.url}
			alt={alt}
			width={size ?? width}
			height={size ?? height}
		/>
	);
}
