## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Создание нового микрофронтенда

```bash
npm run create-microfrontend <name> [description] [author]
```

**Примеры:**

```bash
# Базовое создание
npm run create-microfrontend my-page

# С описанием
npm run create-microfrontend product-catalog "Каталог продуктов"

# С описанием и автором
npm run create-microfrontend user-profile "Профиль пользователя" "Иван Иванов"
```

### Запуск Storybook

```bash
npm run storybook
```

Storybook будет доступен по адресу: http://localhost:3040

## 📁 Структура проекта

```
src/
├── microfrontends/
│   ├── _template/           # Шаблон для новых МФ
│   └── <your-mf>/          # Ваши микрофронтенды
├── atoms/                   # Упрощённые атомы (опционально)
└── styles/
    └── globals.css         # Глобальные стили
```

## 🛠 Разработка микрофронтендов

### Структура микрофронтенда

Каждый микрофронтенд содержит:

```
<microfrontend-name>/
├── package.json            # Конфигурация пакета
├── src/
│   ├── index.ts           # Точка входа
│   ├── <component>.tsx    # Основной компонент
│   ├── types.ts           # TypeScript типы
│   ├── styles.module.css  # CSS модули
│   └── __stories__/
│       └── index.stories.tsx  # Storybook истории
```
