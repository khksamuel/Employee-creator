@echo off
setlocal

set "project_root=%~dp0"

echo Starting Employee Creator API...
start "Employee Creator API" /D "%project_root%employee-creator-api" cmd /k mvn spring-boot:run

echo Starting Employee Creator web app...
start "Employee Creator Web" /D "%project_root%employee-creator-web" cmd /k npm run dev

echo.
echo The API starts at http://localhost:8080
echo The web app URL will appear in its terminal, usually http://localhost:5173
