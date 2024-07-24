@echo off
cd /d "C:\path\to\your\project"

if not exist node_modules (
    echo node_modules folder not found. Running npm install...
    npm install
) else (
    echo node_modules folder found. Skipping npm install...
)

echo Starting server...
npm start
pause
