@echo off
REM Decorum backend dev server launcher
REM Loads phponly/fix override (backend\phpconf\zz-decorum.ini) via PHP_INI_SCAN_DIR
REM so file uploads don't emit the "PHP Request Startup" notice that corrupts JSON.
set PHP_INI_SCAN_DIR=%~dp0phpconf
php artisan serve %*