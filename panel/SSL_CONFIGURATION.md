# SSL/TLS Configuration Guide

## Обзор

Nimbus Control Panel поддерживает полную настройку SSL/TLS сертификатов для безопасного HTTP проксирования. Это позволяет настроить HTTPS соединения между агентами и целевыми серверами.

## SSL Конфигурация для Агентов

### Основные поля

#### **Enable SSL/TLS**
- **Тип**: Boolean checkbox
- **Описание**: Включает/выключает SSL/TLS поддержку для агента
- **По умолчанию**: false

#### **SSL Certificate**
- **Тип**: Textarea (многострочное поле)
- **Описание**: PEM-формат SSL сертификата
- **Формат**: 
  ```
  -----BEGIN CERTIFICATE-----
  MIIDXTCCAkWgAwIBAgIJAKoK/Ov...
  -----END CERTIFICATE-----
  ```

#### **Private Key**
- **Тип**: Textarea (многострочное поле)
- **Описание**: Приватный ключ для SSL сертификата
- **Формат**:
  ```
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
  -----END PRIVATE KEY-----
  ```

#### **CA Certificate (Optional)**
- **Тип**: Textarea (многострочное поле)
- **Описание**: Сертификат центра сертификации (опционально)
- **Использование**: Для проверки цепочки сертификатов

### Пример конфигурации агента с SSL

```json
{
  "name": "SecureAgent",
  "ip": "192.168.1.100",
  "port": 8443,
  "capabilities": {
    "http": true,
    "https": true,
    "tcp": false,
    "udp": false,
    "dns": false
  },
  "sslConfig": {
    "enabled": true,
    "certificate": "-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKoK/Ov...\n-----END CERTIFICATE-----",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----",
    "caCertificate": "-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKoK/Ov...\n-----END CERTIFICATE-----"
  }
}
```

## SSL Конфигурация для Правил

### Основные поля

#### **Enable SSL/TLS for this rule**
- **Тип**: Boolean checkbox
- **Описание**: Включает SSL/TLS для конкретного правила
- **Доступно**: Только для HTTP/HTTPS правил
- **По умолчанию**: false

#### **Verify SSL certificate**
- **Тип**: Boolean checkbox
- **Описание**: Проверять валидность SSL сертификата
- **По умолчанию**: true
- **Рекомендация**: Всегда включать в продакшене

#### **Allow self-signed certificates**
- **Тип**: Boolean checkbox
- **Описание**: Разрешить самоподписанные сертификаты
- **По умолчанию**: false
- **Использование**: Только для тестовых сред

### Пример конфигурации правила с SSL

```json
{
  "name": "SecureProxyRule",
  "type": "https",
  "match": "*.secure-domain.com",
  "action": "proxy",
  "target": "192.168.1.200:443",
  "agent": "agent_id_here",
  "sslConfig": {
    "enabled": true,
    "verifyCertificate": true,
    "allowSelfSigned": false
  }
}
```

## Безопасность

### Рекомендации по безопасности

1. **Используйте валидные сертификаты**
   - Избегайте самоподписанных сертификатов в продакшене
   - Используйте сертификаты от доверенных CA

2. **Защита приватных ключей**
   - Приватные ключи должны быть защищены
   - Используйте сильные пароли для ключей
   - Регулярно ротируйте сертификаты

3. **Проверка сертификатов**
   - Всегда включайте `verifyCertificate` в продакшене
   - Отключайте `allowSelfSigned` в продакшене

4. **Мониторинг**
   - Отслеживайте срок действия сертификатов
   - Настройте уведомления об истечении сертификатов

### Типы сертификатов

#### **Wildcard сертификаты**
```
*.example.com - покрывает все поддомены
```

#### **Multi-domain сертификаты (SAN)**
```
example.com, www.example.com, api.example.com
```

#### **Self-signed сертификаты**
- Только для тестирования
- Не доверяются браузерами по умолчанию
- Требуют добавления в trust store

## Генерация сертификатов

### Self-signed сертификат (для тестирования)

```bash
# Генерация приватного ключа
openssl genrsa -out private.key 2048

# Генерация самоподписанного сертификата
openssl req -new -x509 -key private.key -out certificate.crt -days 365

# Просмотр сертификата
openssl x509 -in certificate.crt -text -noout
```

### CSR (Certificate Signing Request)

```bash
# Генерация CSR
openssl req -new -key private.key -out request.csr

# Просмотр CSR
openssl req -in request.csr -text -noout
```

## Troubleshooting

### Частые проблемы

#### **"SSL certificate verify failed"**
- Проверьте валидность сертификата
- Убедитесь, что CA сертификат добавлен
- Проверьте цепочку сертификатов

#### **"Self-signed certificate"**
- Включите `allowSelfSigned` для тестирования
- Или используйте валидный сертификат

#### **"Certificate expired"**
- Обновите сертификат
- Проверьте системное время

#### **"Private key mismatch"**
- Убедитесь, что приватный ключ соответствует сертификату
- Проверьте формат ключа (PEM)

### Проверка конфигурации

#### **Проверка сертификата**
```bash
openssl x509 -in certificate.crt -text -noout
```

#### **Проверка приватного ключа**
```bash
openssl rsa -in private.key -check
```

#### **Проверка соответствия ключа и сертификата**
```bash
openssl x509 -noout -modulus -in certificate.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
```

## API Endpoints

### Агенты с SSL
- `POST /admin/agents` - Создание агента с SSL конфигурацией
- `PUT /admin/agents/:id` - Обновление SSL конфигурации агента
- `GET /admin/agents/:id` - Получение агента с SSL данными

### Правила с SSL
- `POST /admin/rules` - Создание правила с SSL конфигурацией
- `PUT /admin/rules/:id` - Обновление SSL конфигурации правила
- `GET /admin/rules/:id` - Получение правила с SSL данными

## Мониторинг SSL

### Метрики для отслеживания

1. **Статус SSL соединений**
   - Количество успешных SSL handshake
   - Количество ошибок SSL
   - Время установления SSL соединения

2. **Срок действия сертификатов**
   - Дни до истечения сертификата
   - Уведомления об истечении

3. **Производительность SSL**
   - CPU использование для SSL операций
   - Пропускная способность с SSL

### Логирование

```javascript
// Пример логирования SSL событий
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "SSL connection established",
  "agent": "SecureAgent",
  "rule": "SecureProxyRule",
  "target": "192.168.1.200:443",
  "certificate": {
    "subject": "CN=example.com",
    "issuer": "CN=Let's Encrypt Authority X3",
    "expires": "2024-04-15T10:30:00Z"
  }
}
```

## Лучшие практики

### Разработка
1. Используйте самоподписанные сертификаты для локальной разработки
2. Настройте автоматическую генерацию сертификатов для тестовых сред
3. Используйте mkcert для локальных сертификатов

### Продакшен
1. Используйте сертификаты от доверенных CA
2. Настройте автоматическое обновление сертификатов (Let's Encrypt)
3. Мониторьте срок действия сертификатов
4. Используйте HSTS для принудительного HTTPS

### Тестирование
1. Создайте тестовые сертификаты для всех доменов
2. Проверьте работу с различными типами сертификатов
3. Тестируйте обработку ошибок SSL
4. Проверьте производительность с SSL

## Интеграция с Let's Encrypt

### Автоматическое получение сертификатов

```bash
# Установка certbot
sudo apt-get install certbot

# Получение сертификата
sudo certbot certonly --standalone -d example.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Использование в Nimbus

```json
{
  "sslConfig": {
    "enabled": true,
    "certificate": "/etc/letsencrypt/live/example.com/fullchain.pem",
    "privateKey": "/etc/letsencrypt/live/example.com/privkey.pem",
    "autoRenew": true
  }
}
```
