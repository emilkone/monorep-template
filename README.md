# Growth Blocks - Outsource Repository

Репозиторий для изолированной разработки микрофронтендов внешними командами без доступа к внутренним библиотекам Т-Банка.

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

### Правила разработки

1. **Используйте только публичные зависимости:**
   - `react`, `react-dom`
   - `classnames`
   - Другие публичные npm-пакеты

2. **НЕ используйте внутренние библиотеки Т-Банка:**
   - `@tinkoff-*`
   - `@platform-ui/*`
   - `@hubert/*`
   - `@tinkoff-fb/*`
   - `@pfp-debit/*`

3. **Следуйте конвенциям:**
   - Имена файлов: `kebab-case`
   - Компоненты: `PascalCase`
   - CSS классы: `lowercase-hyphen-case`
   - Используйте CSS модули для стилизации

### Пример компонента

```tsx
import { useState, useEffect } from 'react'
import s from './styles.module.css'
import type { MyComponentProps } from './types'

export const MyComponent = ({
  title,
  description,
}: MyComponentProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
      {description && (
        <p className={s.description}>{description}</p>
      )}
    </div>
  )
}
```

### CSS модули

```css
.root {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.title {
  font-family: 'dsHeading', 'dsHeading Fallback', sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
}
```

## 🔄 Интеграция в основной проект

### Подготовка к интеграции

Когда микрофронтенд готов:

```bash
npm run prepare-integration <microfrontend-name>
```

Этот скрипт:
- Обновит `package.json` для интеграции
- Изменит scope на `@growth-blocks/`
- Добавит необходимые поля для Т-Банка
- Создаст чеклист интеграции

### Результат подготовки

Скрипт создаст директорию `integration-ready/<microfrontend-name>/` с:
- Готовыми файлами микрофронтенда
- Обновленным `package.json`
- Чеклистом интеграции `INTEGRATION_CHECKLIST.md`

### Интеграция в основной проект

1. Скопируйте директорию из `integration-ready/` в `src/microfrontends/` основного проекта
2. Добавьте микрофронтенд в `workspaces` основного `package.json`
3. Запустите `yarn install` в корне основного проекта
4. Следуйте инструкциям из чеклиста интеграции

## 🧪 Тестирование

### Проверка типов

```bash
npm run check:types
```

### Линтинг

```bash
# Проверка JavaScript/TypeScript
npm run check:js

# Проверка CSS
npm run check:css

# Проверка всего
npm run check:all
```

### Форматирование

```bash
# Форматирование JavaScript/TypeScript
npm run format:js

# Форматирование CSS
npm run format:css

# Форматирование всего
npm run format:all
```

## 📚 Доступные стили

В проекте доступны шрифты Т-Банка:

- `dsHeading` - для заголовков
- `dsText` - для основного текста

Используйте их в CSS:

```css
.title {
  font-family: 'dsHeading', 'dsHeading Fallback', sans-serif;
  font-weight: 600;
}

.text {
  font-family: 'dsText', 'dsText Fallback', sans-serif;
  font-weight: 400;
}
```

## ⚠️ Ограничения

1. **Нет доступа к внутренним API** - используйте моки или заглушки
2. **Ограниченный набор UI-компонентов** - создавайте собственные или используйте публичные библиотеки
3. **Нет доступа к внутренним утилитам** - реализуйте необходимую логику самостоятельно

## 🆘 Поддержка

При возникновении вопросов:

1. Изучите документацию в `docs/`
2. Проверьте примеры в `src/microfrontends/_template/`
3. Обратитесь к команде разработки основного проекта

## 📖 Дополнительная документация

- [Руководство по интеграции](./docs/integration-guide.md)
- [Конвенции разработки](./docs/development-conventions.md)
- [FAQ](./docs/faq.md)
