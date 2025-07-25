# Активация виртуального окружения
.\venv\Scripts\Activate.ps1
 
# Запуск сервера
uvicorn asgi:application --reload --host 0.0.0.0 --port 8000 