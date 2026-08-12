<?php

declare(strict_types=1);

namespace Pictum\Laravel\Facades;

use Illuminate\Support\Facades\Facade;
use Pictum\Pictum as PictumClient;

/**
 * @method static \Pictum\PictumAsset avatar(string $seed, \Pictum\AvatarVariant|string $variant = \Pictum\AvatarVariant::Monogram, \Pictum\AvatarFormat|string|null $format = null, ?string $baseUrl = null, \Pictum\AvatarGender|string|null $gender = null, ?int $size = null)
 * @method static \Pictum\PictumAsset icon(string $name, ?string $baseUrl = null)
 * @method static \Pictum\PictumAsset placeholder(?int $size = null, ?int $width = null, ?int $height = null, \Pictum\PlaceholderFormat|string $format = \Pictum\PlaceholderFormat::Svg, ?int $density = null, ?string $background = null, ?string $color = null, ?string $text = null, ?string $baseUrl = null)
 * @method static \Pictum\PictumAsset qrCode(string $value, \Pictum\QrCodeFormat|string $format = \Pictum\QrCodeFormat::Svg, ?string $baseUrl = null, ?bool $quietZone = null, ?string $foreground = null, ?string $background = null)
 *
 * @see PictumClient
 */
final class Pictum extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return PictumClient::class;
    }
}
