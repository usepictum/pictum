import type { QrCodeOptions } from "pictum";
import { useQrCode } from "./helper";
import type { QrCodeProps } from "./types";

export function QrCode({
	value,
	format,
	quietZone,
	foreground,
	background,
	options,
	alt,
	...imageProps
}: QrCodeProps) {
	const helperOptions: QrCodeOptions = {
		...(options ?? {}),
		...(format === undefined ? {} : { format }),
		...(quietZone === undefined ? {} : { quietZone }),
		...(foreground === undefined ? {} : { foreground }),
		...(background === undefined ? {} : { background }),
	};
	const asset = useQrCode(value, helperOptions);

	return <img {...imageProps} src={asset.url} alt={alt} />;
}
