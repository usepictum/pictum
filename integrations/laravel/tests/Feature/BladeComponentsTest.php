<?php

declare(strict_types=1);

namespace Pictum\Laravel\Tests\Feature;

use GuzzleHttp\Psr7\HttpFactory;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\ViewException;
use Pictum\AvatarGender;
use Pictum\AvatarVariant;
use Pictum\Exception\SvgRequestFailed;
use Pictum\Laravel\Exception\InvalidIconMarkup;
use Pictum\Laravel\IconMarkupLoader;
use Pictum\Laravel\Tests\Support\QueueHttpClient;
use Pictum\Laravel\Tests\TestCase;
use Pictum\Pictum;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;

final class BladeComponentsTest extends TestCase
{
    public function test_image_components_generate_urls_and_forward_native_attributes(): void
    {
        $avatar = Blade::render(
            '<x-pictum::avatar seed="ada-lovelace" variant="gradient" format="webp" alt="Ada" loading="lazy" src="ignored" class="avatar" />',
        );
        $qrCode = Blade::render(
            '<x-pictum::qr-code value="hello" format="jpg" quiet-zone="false" foreground="#AABBCC" background="#11223344" alt="Hello" />',
        );

        self::assertStringContainsString(
            'src="https://pictum.dev/v1/avatar.webp?seed=ada-lovelace&amp;variant=gradient"',
            $avatar,
        );
        self::assertStringContainsString('alt="Ada"', $avatar);
        self::assertStringContainsString('loading="lazy"', $avatar);
        self::assertStringContainsString('class="avatar"', $avatar);
        self::assertStringNotContainsString('src="ignored"', $avatar);
        self::assertStringContainsString(
            'src="https://pictum.dev/v1/qrcode.jpg?data=aGVsbG8%3D&amp;quiet_zone=0&amp;foreground=%23AABBCC&amp;background=%2311223344"',
            $qrCode,
        );
        self::assertStringNotContainsString('quiet-zone', $qrCode);
        self::assertStringNotContainsString(' foreground=', $qrCode);
        self::assertStringNotContainsString(' background=', $qrCode);
    }

    public function test_avatar_components_support_identicon_and_portrait_variants(): void
    {
        $identicon = Blade::render(
            '<x-pictum::avatar seed="ada" variant="identicon" alt="Ada" />',
        );
        $portrait = Blade::render(
            '<x-pictum::avatar seed="ada" :variant="$variant" :gender="$gender" alt="Ada" />',
            [
                'variant' => AvatarVariant::Portrait,
                'gender' => AvatarGender::Female,
            ],
        );
        $unfilteredPortrait = Blade::render(
            '<x-pictum::avatar seed="ada" :variant="$variant" :gender="$gender" alt="Ada" />',
            [
                'variant' => AvatarVariant::Portrait,
                'gender' => AvatarGender::Any,
            ],
        );

        self::assertStringContainsString(
            'src="https://pictum.dev/v1/avatar.svg?seed=ada&amp;variant=identicon"',
            $identicon,
        );
        self::assertStringContainsString(
            'src="https://pictum.dev/v1/avatar.webp?seed=ada&amp;variant=portrait&amp;gender=female"',
            $portrait,
        );
        self::assertStringContainsString(
            'src="https://pictum.dev/v1/avatar.webp?seed=ada&amp;variant=portrait"',
            $unfilteredPortrait,
        );
        self::assertStringNotContainsString(' gender=', $portrait);
    }

    public function test_avatar_source_size_is_independent_of_native_dimensions(): void
    {
        $html = Blade::render(
            '<x-pictum::avatar seed="ada" variant="portrait" :size="256" width="64" height="96" alt="Ada" />',
        );

        self::assertStringContainsString(
            'src="https://pictum.dev/v1/avatar.webp?seed=ada&amp;variant=portrait&amp;size=256"',
            $html,
        );
        self::assertStringContainsString('width="64"', $html);
        self::assertStringContainsString('height="96"', $html);
        self::assertStringNotContainsString(' size="256"', $html);
    }

    public function test_qr_code_components_normalize_quiet_zone_attributes(): void
    {
        $enabled = Blade::render('<x-pictum::qr-code value="hello" quiet-zone />');
        $disabled = Blade::render('<x-pictum::qr-code value="hello" :quiet-zone="false" />');
        $omitted = Blade::render('<x-pictum::qr-code value="hello" />');

        self::assertStringContainsString('quiet_zone=1', $enabled);
        self::assertStringContainsString('quiet_zone=0', $disabled);
        self::assertStringNotContainsString('quiet_zone', $omitted);

        $this->expectException(ViewException::class);
        $this->expectExceptionMessage('QR code quietZone must be a boolean.');

        Blade::render('<x-pictum::qr-code value="hello" quiet-zone="sometimes" />');
    }

    public function test_a_component_base_url_overrides_application_configuration(): void
    {
        $this->config()->set('pictum.base_url', 'https://assets.example.com/v1');

        $html = Blade::render(
            '<x-pictum::avatar seed="ada" variant="monogram" base-url="https://preview.example.com/v1" />',
        );

        self::assertStringContainsString(
            'src="https://preview.example.com/v1/avatar.svg?seed=ada"',
            $html,
        );
    }

    public function test_placeholder_dimensions_remain_logical_at_raster_density(): void
    {
        $html = Blade::render(
            '<x-pictum::placeholder :width="640" :height="360" format="webp" :density="2" text="Coming soon" alt="Coming soon" />',
        );

        self::assertStringContainsString(
            'src="https://pictum.dev/v1/placeholder.webp?width=640&amp;height=360&amp;density=2&amp;text=Coming+soon"',
            $html,
        );
        self::assertStringContainsString('width="640"', $html);
        self::assertStringContainsString('height="360"', $html);
    }

    public function test_square_placeholders_emit_equal_logical_dimensions(): void
    {
        $html = Blade::render('<x-pictum::placeholder :size="320" alt="Placeholder" />');

        self::assertStringContainsString('src="https://pictum.dev/v1/placeholder.svg?size=320"', $html);
        self::assertStringContainsString('width="320"', $html);
        self::assertStringContainsString('height="320"', $html);
    }

    public function test_icons_render_trusted_inline_markup_and_cache_successes(): void
    {
        $httpClient = $this->useHttpClient(new Response(200, [], <<<'SVG'
            <svg viewBox="0 0 24 24" fill="red" class="upstream"><path stroke="currentColor" d="M1 1h22"/></svg>
            SVG));

        $template = '<x-pictum::icon name="lucide:sparkles" aria-label="Sparkles" class="icon" />';
        $first = Blade::render($template);
        $second = Blade::render($template);

        self::assertStringContainsString('viewBox="0 0 24 24"', $first);
        self::assertStringContainsString('aria-label="Sparkles"', $first);
        self::assertStringContainsString('class="icon"', $first);
        self::assertStringContainsString('<path stroke="currentColor" d="M1 1h22"/>', $first);
        self::assertStringNotContainsString('fill="red"', $first);
        self::assertStringNotContainsString('upstream', $first);
        self::assertSame($first, $second);
        self::assertCount(1, $httpClient->requests);
        self::assertSame('image/svg+xml', $httpClient->request(0)->getHeaderLine('Accept'));
    }

    public function test_icon_attributes_can_override_the_returned_viewbox(): void
    {
        $this->useHttpClient(new Response(200, [], '<svg viewBox="0 0 24 24"><path/></svg>'));

        $html = Blade::render(
            '<x-pictum::icon name="lucide:sparkles" viewBox="0 0 16 16" />',
        );

        self::assertStringContainsString('viewBox="0 0 16 16"', $html);
        self::assertStringNotContainsString('viewBox="0 0 24 24"', $html);
    }

    public function test_failed_icon_markup_is_not_cached_and_can_be_retried(): void
    {
        $httpClient = $this->useHttpClient(
            new Response(200, [], '<svg><path/></svg>'),
            new Response(200, [], '<svg viewBox="0 0 24 24"><path/></svg>'),
        );
        $loader = $this->iconMarkupLoader();

        try {
            $loader->load('lucide:sparkles');
            self::fail('Invalid icon markup should throw.');
        } catch (InvalidIconMarkup $exception) {
            self::assertSame('Pictum returned invalid icon SVG markup.', $exception->getMessage());
        }

        self::assertSame('0 0 24 24', $loader->load('lucide:sparkles')->viewBox);
        self::assertCount(2, $httpClient->requests);
    }

    public function test_failed_icon_requests_are_not_cached_and_can_be_retried(): void
    {
        $httpClient = $this->useHttpClient(
            new Response(503, [], null, '1.1', 'Service Unavailable'),
            new Response(200, [], '<svg viewBox="0 0 24 24"><path/></svg>'),
        );
        $loader = $this->iconMarkupLoader();

        try {
            $loader->load('lucide:sparkles');
            self::fail('Failed icon requests should throw.');
        } catch (SvgRequestFailed $exception) {
            self::assertSame(503, $exception->statusCode);
        }

        self::assertSame('0 0 24 24', $loader->load('lucide:sparkles')->viewBox);
        self::assertCount(2, $httpClient->requests);
    }

    public function test_icon_cache_entries_are_separated_by_base_url(): void
    {
        $httpClient = $this->useHttpClient(
            new Response(200, [], '<svg viewBox="0 0 24 24"><path id="one"/></svg>'),
            new Response(200, [], '<svg viewBox="0 0 24 24"><path id="two"/></svg>'),
        );
        $loader = $this->iconMarkupLoader();

        $loader->load('lucide:sparkles', 'https://one.example.com/v1');
        $loader->load('lucide:sparkles', 'https://two.example.com/v1');

        self::assertCount(2, $httpClient->requests);
        self::assertStringStartsWith('https://one.example.com/', (string) $httpClient->request(0)->getUri());
        self::assertStringStartsWith('https://two.example.com/', (string) $httpClient->request(1)->getUri());
    }

    private function useHttpClient(Response ...$responses): QueueHttpClient
    {
        Cache::flush();

        $client = new QueueHttpClient(...$responses);
        $app = $this->application();
        $app->instance(ClientInterface::class, $client);
        $app->instance(RequestFactoryInterface::class, new HttpFactory);
        $app->forgetInstance(Pictum::class);
        $app->forgetInstance(IconMarkupLoader::class);

        return $client;
    }
}
