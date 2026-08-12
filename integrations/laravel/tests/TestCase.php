<?php

declare(strict_types=1);

namespace Pictum\Laravel\Tests;

use Illuminate\Config\Repository as ConfigRepository;
use Illuminate\Foundation\Application;
use LogicException;
use Orchestra\Testbench\TestCase as Orchestra;
use Pictum\Laravel\IconMarkupLoader;
use Pictum\Laravel\PictumServiceProvider;
use Pictum\Pictum;

abstract class TestCase extends Orchestra
{
    /**
     * @return list<class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [PictumServiceProvider::class];
    }

    protected function defineEnvironment($app): void
    {
        $config = $app->make(ConfigRepository::class);
        $config->set('cache.default', 'array');
        $config->set('cache.stores.array', [
            'driver' => 'array',
            'serialize' => true,
        ]);
    }

    protected function application(): Application
    {
        return $this->app ?? throw new LogicException('The test application has not been created.');
    }

    protected function config(): ConfigRepository
    {
        return $this->application()->make(ConfigRepository::class);
    }

    protected function pictum(): Pictum
    {
        return $this->application()->make(Pictum::class);
    }

    protected function iconMarkupLoader(): IconMarkupLoader
    {
        return $this->application()->make(IconMarkupLoader::class);
    }
}
