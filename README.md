## Что это такое?
Это микросервис для выполнения автотестов в из коллекций Postman, агрегации их результатов и отправки этого дела в Telegram.

## Как это работает?
 В основе этого микросервиса лежит утилита newman - cli для Postman. Общий принцип работы такой:
 1. Мы посылаем запрос на выполнение каких-то коллекций из Postman
2. Для каждой коллекции выполняются тесты
3. Если конфиг для TargetProcess заполнен - создаём там баг (или добавляем коммент о прогоне в существующий)
4. Отправляем результат в Telegram

## Эндпоинты
### POST /api/trigger - запустить тесты
body: application/json
```
{
    "collections": ["name". "..."] // массив с названиями коллекций
    "parameters": { //необязательно
        "Любой ключ": "Любое значение" // любой набор пар "ключ-значение" для вывода в сообщении телеги     
    }
}
```
headers:
```
X-POSTMAN-KEY: КЛЮЧ ПОСТМАНА ДЛЯ ДОСТУПА К КОЛЛЕКЦИИ
```

> Тесты выполняются асинхронно - это значит, что запрос создаёт некоторую задачу на выполнение тестов и возвращает результат; сами же тесты будут выполняться в фоновом режиме, и по их завершению отправится сообщение в тг
### POST /api/settings - установить настройки
body: application/json
```
{
    "userStory": 1234 //ID стори для прикрепления бага
}
```
### GET /api/settings - получить теукщие настройки

//не бейте пж это MVP с костылями
