@echo off
setlocal

echo Running backend tests...
pushd employee-creator-api
call mvn test
set "test_result=%ERRORLEVEL%"
popd
if not "%test_result%"=="0" goto :failure

echo.
echo Running frontend tests...
pushd employee-creator-web
call npm test
set "test_result=%ERRORLEVEL%"
popd
if not "%test_result%"=="0" goto :failure

echo.
echo All tests passed.
exit /b 0

:failure
echo.
echo A test suite failed.
exit /b 1
