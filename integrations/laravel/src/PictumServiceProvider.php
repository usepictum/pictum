<?php

declare(strict_types=1);

namespace Pictum\Laravel;

use Illuminate\Cache\CacheManager;
use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Pictum\Pictum;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;

final class PictumServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom($this->configPath(), 'pictum');

        $this->app->singleton(Pictum::class, function (Application $app): Pictum {
            $config = $app->make(ConfigRepository::class);
            $baseUrl = $config->string('pictum.base_url', Pictum::DEFAULT_BASE_URL);

            $httpClient = $app->bound(ClientInterface::class)
                ? $app->make(ClientInterface::class)
                : null;
            $requestFactory = $app->bound(RequestFactoryInterface::class)
                ? $app->make(RequestFactoryInterface::class)
                : null;

            return new Pictum($httpClient, $requestFactory, $baseUrl);
        });

        $this->app->singleton(IconMarkupLoader::class, function (Application $app): IconMarkupLoader {
            $config = $app->make(ConfigRepository::class);
            $store = $config->get('pictum.cache.store') === null
                ? null
                : $config->string('pictum.cache.store');

            return new IconMarkupLoader(
                $app->make(Pictum::class),
                $app->make(CacheManager::class)->store($store),
            );
        });
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pictum');
        Blade::componentNamespace('Pictum\\Laravel\\View\\Components', 'pictum');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                $this->configPath() => $this->app->configPath('pictum.php'),
            ], 'pictum-config');
        }
    }

    private function configPath(): string
    {
        return __DIR__.'/../config/pictum.php';
    }
}
