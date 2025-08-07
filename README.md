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
- Лёгкое подключение новых агентов с помощью скрипта.
- Открытый код — любой может присоединиться к разработке.

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
- Simple onboarding of new agents via script.
- Open-source — anyone can contribute to development.

### License
Commercial use of the project is **prohibited**.  
Allowed:
- Project maintenance.
- Development and improvements.
- Use for personal or research purposes.
