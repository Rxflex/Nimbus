# Архитектура Nimbus Control Panel

## Обзор системы

Nimbus Control Panel - это современная веб-панель управления для системы Nimbus, которая обеспечивает управление агентами, правилами маршрутизации, маршрутами и GeoDNS конфигурациями.

## Компоненты системы

### 1. Frontend (Next.js Panel)
- **Технологии**: Next.js 15, React 19, Tailwind CSS
- **Порт**: 3001
- **Функции**:
  - Аутентификация пользователей
  - Управление агентами
  - Настройка правил маршрутизации
  - Конфигурация маршрутов
  - GeoDNS управление
  - Администрирование пользователей

### 2. Backend API (NestJS Director)
- **Технологии**: NestJS, MongoDB, JWT
- **Порт**: 3000
- **Функции**:
  - REST API для всех операций CRUD
  - Аутентификация и авторизация
  - WebSocket для real-time обновлений
  - Swagger документация

### 3. Agents (Go)
- **Технологии**: Go
- **Функции**:
  - Выполнение правил маршрутизации
  - DNS прокси
  - HTTP/HTTPS прокси
  - TCP/UDP прокси

## Архитектурные принципы

### 1. Разделение ответственности
- **Frontend**: Презентационный слой, пользовательский интерфейс
- **Backend**: Бизнес-логика, API, аутентификация
- **Agents**: Выполнение сетевых операций

### 2. Безопасность
- JWT токены для аутентификации
- Роли пользователей (admin/user)
- Валидация данных на клиенте и сервере
- CORS настройки

### 3. Масштабируемость
- Модульная архитектура компонентов
- RESTful API
- Stateless аутентификация
- Горизонтальное масштабирование агентов

## Поток данных

```
Пользователь → Frontend → API → Database
     ↓              ↓        ↓
   UI Actions → HTTP Requests → MongoDB
     ↓              ↓        ↓
   State Update ← JSON Response ← Data
```

## Структура данных

### Agent
```javascript
{
  name: string,
  ip: string,
  port: number,
  capabilities: {
    http: boolean,
    https: boolean,
    tcp: boolean,
    udp: boolean,
    dns: boolean
  },
  status: 'connected' | 'disconnected',
  lastHeartbeat: Date,
  owner: ObjectId
}
```

### Rule
```javascript
{
  name: string,
  type: 'http' | 'https' | 'tcp' | 'udp' | 'dns',
  match: string,
  action: 'proxy' | 'redirect' | 'block',
  target: string,
  agent: ObjectId,
  owner: ObjectId
}
```

### Route
```javascript
{
  name: string,
  source: string,
  destination: string,
  protocol: 'http' | 'https' | 'tcp' | 'udp',
  agents: ObjectId[],
  rules: ObjectId[],
  owner: ObjectId
}
```

### GeoDNS
```javascript
{
  domain: string,
  recordType: 'A' | 'CNAME' | 'MX',
  target: string,
  location: {
    country: string,
    region: string,
    city: string
  },
  anycast: boolean,
  routes: ObjectId[],
  agents: ObjectId[],
  owner: ObjectId
}
```

## API Endpoints

### Аутентификация
- `POST /auth/login` - Вход в систему
- `GET /auth/users` - Список пользователей
- `POST /auth/users` - Создание пользователя
- `PUT /auth/users/:id` - Обновление пользователя
- `DELETE /auth/users/:id` - Удаление пользователя

### Агенты
- `GET /admin/agents` - Список агентов
- `POST /admin/agents` - Создание агента
- `PUT /admin/agents/:id` - Обновление агента
- `DELETE /admin/agents/:id` - Удаление агента

### Правила
- `GET /admin/rules` - Список правил
- `POST /admin/rules` - Создание правила
- `PUT /admin/rules/:id` - Обновление правила
- `DELETE /admin/rules/:id` - Удаление правила

### Маршруты
- `GET /admin/routes` - Список маршрутов
- `POST /admin/routes` - Создание маршрута
- `PUT /admin/routes/:id` - Обновление маршрута
- `DELETE /admin/routes/:id` - Удаление маршрута

### GeoDNS
- `GET /admin/geodns` - Список GeoDNS конфигураций
- `POST /admin/geodns` - Создание GeoDNS конфигурации
- `PUT /admin/geodns/:id` - Обновление GeoDNS конфигурации
- `DELETE /admin/geodns/:id` - Удаление GeoDNS конфигурации

## Компоненты UI

### 1. Layout Components
- `Header` - Заголовок с навигацией и профилем пользователя
- `Sidebar` - Боковая панель навигации
- `Dashboard` - Главный контейнер для вкладок

### 2. Tab Components
- `DashboardOverview` - Обзор системы и статистика
- `AgentsTab` - Управление агентами
- `RulesTab` - Управление правилами
- `RoutesTab` - Управление маршрутами
- `GeoDnsTab` - Управление GeoDNS
- `UsersTab` - Управление пользователями

### 3. Common Components
- `LoginForm` - Форма входа в систему
- Модальные окна для создания/редактирования
- Таблицы с данными
- Формы с валидацией

## Состояние приложения

### Локальное состояние
- Аутентификация пользователя
- Активная вкладка
- Данные форм
- Состояние модальных окон

### Серверное состояние
- Список агентов
- Список правил
- Список маршрутов
- Список GeoDNS конфигураций
- Список пользователей

## Безопасность

### Frontend
- Валидация форм на клиенте
- Санитизация пользовательского ввода
- Защита от XSS атак
- HTTPS в продакшене

### Backend
- JWT аутентификация
- Роли и разрешения
- Валидация данных
- CORS настройки
- Rate limiting

## Развертывание

### Development
```bash
# API сервер
cd director && npm run dev

# Frontend
cd panel && npm run dev
```

### Production
```bash
# API сервер
cd director && npm run build && npm start

# Frontend
cd panel && npm run build && npm start
```

### Docker
```bash
docker-compose up -d
```

## Мониторинг

- Логи приложения
- Метрики производительности
- Мониторинг состояния агентов
- Алерты при ошибках

## Будущие улучшения

1. **Real-time обновления** - WebSocket интеграция
2. **Уведомления** - Система уведомлений
3. **Аналитика** - Графики и метрики
4. **Экспорт данных** - CSV/JSON экспорт
5. **Темная тема** - Переключение темы
6. **Мобильное приложение** - React Native версия
