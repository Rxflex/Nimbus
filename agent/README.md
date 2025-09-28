# Nimbus Agent

Nimbus Agent - это компонент системы Nimbus, который обеспечивает GeoDNS и TCP/UDP трафик форвардинг.

## Упрощенная установка

### Linux/macOS

```bash
# Скачать и запустить скрипт установки
curl -fsSL https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.sh | sudo bash -s -- http://your-director-url/api/agent/YOUR_API_KEY [agent_name]
```

Или вручную:

```bash
# Сделать скрипт исполняемым
chmod +x install.sh

# Запустить установку
sudo ./install.sh http://your-director-url/api/agent/YOUR_API_KEY [agent_name]
```

### Windows

```cmd
# Скачать и запустить скрипт установки
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.bat' -OutFile 'install.bat'; .\install.bat http://your-director-url/api/agent/YOUR_API_KEY [agent_name]"
```

Или вручную:

```cmd
# Запустить от имени администратора
install.bat http://your-director-url/api/agent/YOUR_API_KEY [agent_name]
```

## Ручная установка

### 1. Скачать бинарный файл

Скачайте подходящий бинарный файл для вашей архитектуры:
- `nimbus-agent-amd64` - для x86_64
- `nimbus-agent-arm64` - для ARM64
- `nimbus-agent-arm` - для ARM

### 2. Запустить агент

```bash
# Linux/macOS
./nimbus-agent --director http://your-director-url --api-key YOUR_API_KEY --name your-agent-name

# Windows
nimbus-agent.exe --director http://your-director-url --api-key YOUR_API_KEY --name your-agent-name
```

## Автоматические возможности

Агент автоматически:

- **Определяет IP адрес** - использует первый доступный сетевой интерфейс
- **Устанавливает порт** - по умолчанию 8080
- **Включает все возможности** - HTTP, HTTPS, TCP, UDP, DNS
- **Регистрируется в системе** - создает systemd сервис (Linux) или Windows сервис

## Управление сервисом

### Linux (systemd)

```bash
# Проверить статус
systemctl status nimbus-agent

# Перезапустить
systemctl restart nimbus-agent

# Остановить
systemctl stop nimbus-agent

# Посмотреть логи
journalctl -u nimbus-agent -f
```

### Windows

```cmd
# Проверить статус
sc query nimbus-agent

# Перезапустить
sc stop nimbus-agent && sc start nimbus-agent

# Остановить
sc stop nimbus-agent

# Посмотреть логи в Event Viewer
```

## Конфигурация

Агент получает конфигурацию от директора через polling каждую минуту:

- **GeoDNS зоны** - для DNS запросов
- **Маршруты** - для TCP/UDP проксирования  
- **Правила** - для фильтрации трафика

## Мониторинг

Агент отправляет heartbeat директору каждые 30 секунд с информацией о:

- Статусе агента
- Нагрузке
- Активных маршрутах
- Метриках трафика

## Требования

- **Linux**: systemd (для автозапуска)
- **Windows**: права администратора (для создания сервиса)
- **Сеть**: доступ к директору по HTTP/HTTPS
- **Порты**: 53 (DNS), 8080 (по умолчанию для прокси)

## Устранение неполадок

### Агент не регистрируется

1. Проверьте доступность директора: `curl http://your-director-url/health`
2. Проверьте правильность API ключа
3. Проверьте логи агента

### DNS не работает

1. Убедитесь что порт 53 доступен
2. Проверьте что агент имеет права на привязку к порту 53
3. Проверьте конфигурацию GeoDNS в директоре

### Прокси не работает

1. Проверьте что порт 8080 доступен
2. Убедитесь что маршруты настроены в директоре
3. Проверьте capabilities агента
