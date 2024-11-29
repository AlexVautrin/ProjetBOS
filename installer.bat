@echo off
REM Installer FastAPI, Pydantic, Pymongo et Pandas avec pip
echo Installing FastAPI, Pydantic, Pymongo, and Pandas...

REM Installer FastAPI
pip install "fastapi[standard]"

REM Installer Pydantic
pip install pydantic

REM Installer Pymongo
pip install pymongo

REM Installer Pandas
pip install pandas

REM Installer les dépendances supplémentaires via npm
echo Installing additional npm dependencies...

npm install --verbose @eslint/js@^9.9.1
npm install --verbose @types/react@^18.3.5
npm install --verbose @types/react-dom@^18.3.0
npm install --verbose @vitejs/plugin-react@^4.3.1
npm install --verbose eslint@^9.9.1
npm install --verbose eslint-plugin-react@^7.35.0
npm install --verbose eslint-plugin-react-hooks@^5.1.0-rc.0
npm install --verbose eslint-plugin-react-refresh@^0.4.11
npm install --verbose globals@^15.9.0
npm install --verbose vite@^5.4.10

npm install --verbose @tremor/react@^3.14.1
npm install --verbose autoprefixer@^10.4.17
npm install --verbose chart.js@^4.4.6
npm install --verbose postcss@^8.4.35
npm install --verbose react@^18.3.1
npm install --verbose react-calendar@^5.1.0
npm install --verbose react-chartjs-2@^5.2.0
npm install --verbose react-dom@^18.3.1
npm install --verbose react-icons@^5.0.1
npm install --verbose recharts@^2.13.3
npm install --verbose tailwindcss@^3.4.1
npm install --verbose vite-react-starter@file:


REM Attendre que l'utilisateur appuie sur "q" pour fermer l'installateur
echo Appuyez sur "q" pour fermer l'installateur...

:attente
set /p dummy="Entrez 'q' pour quitter... "

REM Vérifier si l'utilisateur a appuyé sur "q"
if "%dummy%"=="q" exit

REM Si une autre touche est pressée, recommence l'attente
goto attente