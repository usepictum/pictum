import type { QrCodeAssetProps } from "pictum";
import type { ComponentPropsWithoutRef } from "react";

type NativeImageProps = Omit<
	ComponentPropsWithoutRef<"img">,
	"children" | "src" | keyof QrCodeAssetProps
>;

export type QrCodeProps = NativeImageProps & QrCodeAssetProps;
