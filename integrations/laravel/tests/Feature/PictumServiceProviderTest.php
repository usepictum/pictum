<?php

declare(strict_types=1);

namespace Pictum\Laravel\Tests\Feature;

use Pictum\AvatarGender;
use Pictum\Laravel\Facades\Pictum as PictumFacade;
use Pictum\Laravel\Tests\TestCase;

final class PictumServiceProviderTest extends TestCase
{
    public function test_it_registers_the_configured_client_as_a_singleton(): void
    {
        $this->config()->set('pictum.base_url', 'https://assets.example.com/v1/');

        $first = $this->pictum();
        $second = $this->pictum();

        self::assertSame($first, $second);
        self::assertSame($first, PictumFacade::getFacadeRoot());
        self::assertSame(
            'https://assets.example.com/v1/icons/lucide:sparkles.svg',
            $first->icon('lucide:sparkles')->url,
        );
    }

    public function test_the_facade_exposes_core_helpers(): void
    {
        self::assertSame(
            'https://pictum.dev/v1/avatar.webp?seed=ada&variant=portrait&gender=female',
            PictumFacade::avatar(
                'ada',
                variant: 'portrait',
                gender: AvatarGender::Female,
            )->url,
        );
        self::assertSame(
            'https://pictum.dev/v1/qrcode.jpg?data=aGVsbG8%3D&quiet_zone=0&foreground=%23AABBCC&background=%2311223344',
            PictumFacade::qrCode(
                'hello',
                format: 'jpg',
                quietZone: false,
                foreground: '#AABBCC',
                background: '#11223344',
            )->url,
        );
    }

    public function test_the_facade_forwards_avatar_source_size(): void
    {
        self::assertSame(
            'https://pictum.dev/v1/avatar.webp?seed=ada&variant=portrait&size=256',
            PictumFacade::avatar(
                'ada',
                variant: 'portrait',
                size: 256,
            )->url,
        );
    }
}
