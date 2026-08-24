@echo off
setlocal

set "project_root=%~dp0"
set "api_run_args="

if "%~1"=="" goto :start
if /I "%~1"=="demo" (
    set "api_run_args=-Dspring-boot.run.profiles=demo"
    echo Demo mode: seeding the database on API startup.
    goto :start
)

echo Usage: run.bat [demo]
exit /b 1

:start

echo Starting Employee Creator API...
start "Employee Creator API" /D "%project_root%employee-creator-api" cmd /k mvn spring-boot:run %api_run_args%

echo Starting Employee Creator web app...
start "Employee Creator Web" /D "%project_root%employee-creator-web" cmd /k npm run dev

echo.
echo The API starts at http://localhost:8080
echo The web app URL will appear in its terminal, usually http://localhost:5173
