<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * When serving over a LAN (e.g. accessing via a phone on the same Wi-Fi),
     * build absolute URLs (logo/listing images, etc.) from the host of the
     * incoming request instead of the static APP_URL. This lets the site be
     * reached at any local IP (localhost or the machine's LAN address) without
     * reconfiguring when the IP changes.
     */
    public function boot(): void
    {
        if (app()->runningInConsole()) {
            return;
        }

        $this->app->afterResolving(\Illuminate\Routing\UrlGenerator::class, function ($url) {
            $request = $this->app->make(Request::class);
            if ($request->getHost()) {
                $url->forceRootUrl($request->getScheme().'://'.$request->getHttpHost());
            }
        });
    }
}
