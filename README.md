## 🚀 Быстрый старт

### Установка зависимостей

```bash
yarn install
```

### Создание нового микрофронтенда

```bash
yarn create-microfrontend <name> [description] [author]
```

**Примеры:**

```bash
# Базовое создание
yarn create-microfrontend my-page

# С описанием
yarn create-microfrontend product-catalog "Каталог продуктов"

# С описанием и автором
yarn create-microfrontend user-profile "Профиль пользователя" "Иван Иванов"
```

### Запуск Storybook

```bash
yarn storybook
```

Storybook будет доступен по адресу: http://localhost:3040

## 🛠 Доступные скрипты

```bash
# Разработка
yarn dev                    # Запуск Storybook
yarn storybook             # Запуск Storybook
yarn storybook:build       # Сборка Storybook

# Создание микрофронтендов
yarn create-microfrontend  # Создать новый микрофронтенд
yarn prepare-integration   # Подготовить к интеграции

# Проверка кода
yarn check:types           # Проверка TypeScript типов
yarn check:js              # Проверка JavaScript/TypeScript кода
yarn check:css             # Проверка CSS стилей
yarn check:all             # Все проверки

# Форматирование
yarn format:js             # Форматирование JS/TS кода
yarn format:css            # Форматирование CSS
yarn format:all            # Форматирование всего кода
```

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

## 🚀 Технологии

- **React 18+** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Storybook** - инструмент для разработки компонентов
- **Yarn** - менеджер пакетов
- **tsx** - быстрый TypeScript/JSX runner
- **CSS Modules** - изоляция стилей
- **ESLint** - линтер для JavaScript/TypeScript
- **Stylelint** - линтер для CSS

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
