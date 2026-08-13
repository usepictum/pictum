import type { HTMLAttributes } from "astro/types";
import type { QrCodeAssetProps } from "pictum";

type NativeImageProps = Omit<
	HTMLAttributes<"img">,
	"src" | keyof QrCodeAssetProps
>;

export type QrCodeProps = NativeImageProps & QrCodeAssetProps;
