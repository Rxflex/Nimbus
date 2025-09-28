# Docker Deployment Guide

Этот документ описывает, как развернуть Nimbus используя готовые Docker образы из GitHub Container Registry.

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/Rxflex/Nimbus.git
cd Nimbus
```

### 2. Настройка переменных окружения

```bash
# Скопируйте пример файла переменных окружения
cp env.example .env

# Отредактируйте .env файл под ваши нужды
nano .env
```

### 3. Запуск системы

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка системы
docker-compose down
```

## Переменные окружения

### Основные настройки

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `REGISTRY` | Docker registry | `ghcr.io` |
| `IMAGE_PREFIX` | Префикс образов | `rxflex/nimbus` |
| `TAG` | Тег образов | `latest` |

### База данных

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `MONGO_ROOT_USERNAME` | Имя пользователя MongoDB | `admin` |
| `MONGO_ROOT_PASSWORD` | Пароль MongoDB | `pass` |
| `MONGO_DATABASE` | Имя базы данных | `nimbus` |

### Director

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DIRECTOR_PORT` | Порт директора | `3000` |
| `JWT_SECRET` | Секретный ключ JWT | `your_jwt_secret` |

### Admin Panel

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `ADMIN_PANEL_PORT` | Порт админ-панели | `5173` |
| `API_URL` | URL API директора | `http://localhost:3000` |

### Agent

Агент не запускается в Docker, а устанавливается в systemd на хосте. Для установки агента используйте скрипты из папки `agent/`:

```bash
# Linux/macOS
./agent/install.sh http://your-director-url/api/agent/YOUR_API_KEY

# Windows
agent/install.bat http://your-director-url/api/agent/YOUR_API_KEY
```

## Использование конкретных версий

### Использование стабильной версии

```bash
# Установить переменную окружения для конкретной версии
export TAG=v1.0.0

# Запустить с этой версией
docker-compose up -d
```

### Использование ветки разработки

```bash
# Использовать образы из ветки develop
export TAG=develop

# Запустить
docker-compose up -d
```

## Архитектуры

Образы собираются для следующих архитектур:
- `linux/amd64` - Intel/AMD 64-bit
- `linux/arm64` - ARM 64-bit

Docker автоматически выберет подходящий образ для вашей платформы.

## Мониторинг

### Health Checks

Все сервисы имеют встроенные health checks:

```bash
# Проверить статус всех сервисов
docker-compose ps

# Проверить health check конкретного сервиса
docker inspect nimbus-director --format='{{.State.Health.Status}}'
```

### Логи

```bash
# Все логи
docker-compose logs

# Логи конкретного сервиса
docker-compose logs director
docker-compose logs admin-panel
docker-compose logs agent

# Следить за логами в реальном времени
docker-compose logs -f director
```

## Масштабирование

### Запуск только директора и админ-панели

```bash
# Запустить только основные сервисы
docker-compose up -d mongo director admin-panel
```

### Установка агентов на разных серверах

Агенты устанавливаются на отдельных серверах через systemd:

```bash
# На каждом сервере где нужен агент
curl -fsSL https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.sh | sudo bash -s -- http://your-director-url/api/agent/YOUR_API_KEY
```

## Обновление

### Обновление до последней версии

```bash
# Остановить сервисы
docker-compose down

# Скачать новые образы
docker-compose pull

# Запустить с новыми образами
docker-compose up -d
```

### Обновление конкретной версии

```bash
# Установить новую версию
export TAG=v1.1.0

# Остановить и пересоздать контейнеры
docker-compose down
docker-compose up -d
```

## Устранение неполадок

### Проблемы с подключением к базе данных

```bash
# Проверить статус MongoDB
docker-compose logs mongo

# Проверить подключение директора к базе
docker-compose logs director | grep -i mongo
```

### Проблемы с агентом

```bash
# Проверить статус агента в systemd
systemctl status nimbus-agent

# Проверить логи агента
journalctl -u nimbus-agent -f

# Проверить регистрацию агента
journalctl -u nimbus-agent | grep -i register

# Проверить подключение к директору
journalctl -u nimbus-agent | grep -i director
```

### Очистка

```bash
# Остановить и удалить контейнеры
docker-compose down

# Удалить образы
docker-compose down --rmi all

# Удалить volumes (ВНИМАНИЕ: удалит данные!)
docker-compose down -v

# Остановить агент на хосте (если установлен)
sudo systemctl stop nimbus-agent
sudo systemctl disable nimbus-agent
sudo rm /etc/systemd/system/nimbus-agent.service
sudo systemctl daemon-reload
```

## Безопасность

### Рекомендации для продакшена

1. **Измените пароли по умолчанию**:
   ```bash
   export MONGO_ROOT_PASSWORD=your_secure_password
   export JWT_SECRET=your_secure_jwt_secret
   ```

2. **Используйте HTTPS**:
   - Настройте reverse proxy (nginx/traefik)
   - Используйте Let's Encrypt для SSL сертификатов

3. **Ограничьте доступ к портам**:
   - Не открывайте порты MongoDB наружу
   - Используйте firewall для ограничения доступа

4. **Регулярно обновляйте**:
   - Следите за обновлениями образов
   - Используйте конкретные версии вместо `latest`

## Примеры конфигураций

### Минимальная конфигурация

```bash
# .env
TAG=latest
JWT_SECRET=my-secret-key
```

### Продакшен конфигурация

```bash
# .env
TAG=v1.0.0
MONGO_ROOT_PASSWORD=very-secure-password
JWT_SECRET=very-secure-jwt-secret
DIRECTOR_PORT=80
ADMIN_PANEL_PORT=443
```
