@echo off
REM Navigate to the backend directory
cd /d "%~dp0\..\backend" || exit /b 1

REM Install dependencies using uv
uv sync 