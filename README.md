# 🌩️ Nimbus

## 🇷🇺 Описание

**Nimbus** — это распределённая система, которая легко масштабируется и предоставляет простое подключение агентов.  
Она позволяет перенаправлять трафик с агентов на целевые серверы по протоколам **TCP** и **UDP** (отдельно или вместе), а также содержит встроенный **GeoDNS**-сервер, который направляет пользователей на ближайший к ним агент.

Репозиторий является **монорепозиторием** и включает:
- **Director** — центральный API-сервер, который управляет всеми агентами.
- **Agent** — клиент, который подключается к Director и обрабатывает трафик.

### Возможности
- Простое масштабирование сети агентов.
- Перенаправление TCP/UDP трафика.
- GeoDNS для маршрутизации по географической близости.
- **Упрощённое подключение агентов** — одна команда для установки.
- Автоматическое определение IP, портов и возможностей агента.
- Открытый код — любой может присоединиться к разработке.

### Быстрый запуск с Docker

```bash
# Клонировать репозиторий
git clone https://github.com/Rxflex/Nimbus.git
cd Nimbus

# Настроить переменные окружения
cp env.example .env
# Отредактировать .env под ваши нужды

# Запустить директор и админ-панель
docker-compose up -d
```

### Быстрая установка агента

```bash
# Linux/macOS - одна команда для установки
curl -fsSL https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.sh | sudo bash -s -- http://your-director-url/api/agent/YOUR_API_KEY

# Windows - запустить от имени администратора
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.bat' -OutFile 'install.bat'; .\install.bat http://your-director-url/api/agent/YOUR_API_KEY"
```

Агент автоматически:
- Определит свой IP адрес
- Настроит все возможности (HTTP, HTTPS, TCP, UDP, DNS)
- Установится как системный сервис
- Начнёт получать конфигурацию от директора

### Лицензия
Проект **запрещено** использовать в коммерческих целях.  
Разрешены:
- Поддержка проекта.
- Доработка и развитие.
- Использование в личных или исследовательских целях.

---

## 🇬🇧 Description

**Nimbus** is a distributed system designed for easy scalability and seamless agent integration.  
It allows traffic redirection from agents to target servers via **TCP** and **UDP** protocols (individually or both), and includes a built-in **GeoDNS** server that routes users to the nearest agent.

The repository is a **monorepo** containing:
- **Director** — the central API server that manages all agents.
- **Agent** — a client that connects to the Director and processes traffic.

### Features
- Easy scaling of the agent network.
- TCP/UDP traffic redirection.
- GeoDNS for routing based on geographic proximity.
- **Simplified agent onboarding** — one command installation.
- Automatic IP, port, and capabilities detection.
- Open-source — anyone can contribute to development.

### Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/Rxflex/Nimbus.git
cd Nimbus

# Configure environment variables
cp env.example .env
# Edit .env according to your needs

# Start director and admin panel
docker-compose up -d
```

### Quick Agent Installation

```bash
# Linux/macOS - one command installation
curl -fsSL https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.sh | sudo bash -s -- http://your-director-url/api/agent/YOUR_API_KEY

# Windows - run as administrator
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/Rxflex/Nimbus/main/agent/install.bat' -OutFile 'install.bat'; .\install.bat http://your-director-url/api/agent/YOUR_API_KEY"
```

Agent automatically:
- Detects its IP address
- Configures all capabilities (HTTP, HTTPS, TCP, UDP, DNS)
- Installs as system service
- Starts receiving configuration from director

### License
Commercial use of the project is **prohibited**.  
Allowed:
- Project maintenance.
- Development and improvements.
- Use for personal or research purposes.
