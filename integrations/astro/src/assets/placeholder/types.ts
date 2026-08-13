import type { HTMLAttributes } from "astro/types";
import type { PlaceholderAssetProps } from "pictum";

type PlaceholderImageProps = Omit<
	HTMLAttributes<"img">,
	"color" | "height" | "src" | "width" | keyof PlaceholderAssetProps
>;

export type PlaceholderProps = PlaceholderImageProps & PlaceholderAssetProps;
