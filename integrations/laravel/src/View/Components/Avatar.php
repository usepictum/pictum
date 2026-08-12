<?php

declare(strict_types=1);

namespace Pictum\Laravel\View\Components;

use Illuminate\View\Component;
use Pictum\AvatarFormat;
use Pictum\AvatarGender;
use Pictum\AvatarVariant;
use Pictum\Pictum;
use Pictum\PictumAsset;

final class Avatar extends Component
{
    public readonly PictumAsset $asset;

    public function __construct(
        Pictum $pictum,
        string $seed,
        AvatarVariant|string $variant = AvatarVariant::Monogram,
        AvatarFormat|string|null $format = null,
        ?string $baseUrl = null,
        AvatarGender|string|null $gender = null,
        ?int $size = null,
    ) {
        $this->asset = $pictum->avatar(
            seed: $seed,
            variant: $variant,
            format: $format,
            baseUrl: $baseUrl,
            gender: $gender,
            size: $size,
        );
    }

    public function render(): string
    {
        return 'pictum::components.avatar';
    }
}
