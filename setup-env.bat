@echo off
echo Setting up IkazeProperty environment variables...
echo.

echo Please provide the following information:
echo.

set /p CLOUD_NAME="Enter your Cloudinary Cloud Name: "
set /p API_KEY="Enter your Cloudinary API Key: "
set /p API_SECRET="Enter your Cloudinary API Secret: "
set /p SUPABASE_URL="Enter your Supabase URL: "
set /p SUPABASE_ANON="Enter your Supabase Anon Key: "

echo.
echo Creating .env.local file...

(
echo # IkazeProperty Environment Variables
echo # Generated on %date% at %time%
echo.
echo # Cloudinary Configuration
echo NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=%CLOUD_NAME%
echo NEXT_PUBLIC_CLOUDINARY_API_KEY=%API_KEY%
echo CLOUDINARY_API_SECRET=%API_SECRET%
echo.
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=%SUPABASE_URL%
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%SUPABASE_ANON%
echo.
echo # App Configuration
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
) > .env.local

echo.
echo ✅ Environment variables configured successfully!
echo.
echo Please restart your development server with:
echo npm run dev
echo.
pause
