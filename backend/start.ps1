# Активация виртуального окружения
.\venv\Scripts\Activate.ps1
 
# Запуск сервера
uvicorn asgi:application --reload --host 127.0.0.1 --port 8000 