import type { HTMLAttributes } from "astro/types";
import type { IconAssetProps } from "pictum";

type NativeSvgProps = Omit<
	HTMLAttributes<"svg">,
	"children" | keyof IconAssetProps
>;

export type IconProps = NativeSvgProps & IconAssetProps;
