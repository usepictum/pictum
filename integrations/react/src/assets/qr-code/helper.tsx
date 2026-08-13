import { type PictumAsset, type QrCodeOptions, qrCode } from "pictum";
import { usePictumOptions } from "../../provider";

export function useQrCode(
	value: string,
	options: QrCodeOptions = {},
): PictumAsset {
	return qrCode(value, {
		...options,
		...usePictumOptions(options),
	});
}
