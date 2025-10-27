# Конвенции разработки

Правила и стандарты для разработки микрофронтендов в аутсорс-репозитории.

## 🚀 Технологический стек

- **React 18+** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Storybook** - инструмент для разработки компонентов
- **Yarn** - менеджер пакетов (используется вместо npm)
- **tsx** - быстрый TypeScript/JSX runner (используется вместо ts-node)
- **CSS Modules** - изоляция стилей
- **ESLint** - линтер для JavaScript/TypeScript
- **Stylelint** - линтер для CSS

В проекте рекомендуется использовать `@tinkoff/utils` вместо `lodash` для работы с утилитарными функциями. Это связано с тем, что `@tinkoff/utils` предоставляет единый подход к утилитам в экосистеме Tinkoff

Установка:

```bash
yarn add @tinkoff/utils
```

## 🛠 Команды разработки

### Основные команды

```bash
# Установка зависимостей
yarn install

# Запуск Storybook для разработки
yarn dev
# или
yarn storybook

# Сборка Storybook
yarn storybook:build

# Создание нового микрофронтенда
yarn create-microfrontend <name> [description] [author]

# Подготовка к интеграции
yarn prepare-integration
```

### Проверка и форматирование кода

```bash
# Проверка TypeScript типов
yarn check:types

# Проверка JavaScript/TypeScript кода
yarn check:js

# Проверка CSS стилей
yarn check:css

# Все проверки
yarn check:all

# Форматирование JS/TS кода
yarn format:js

# Форматирование CSS
yarn format:css

# Форматирование всего кода
yarn format:all
```

## 📁 Структура файлов

### Именование

- **Микрофронтенды**: `kebab-case` (например, `user-profile`)
- **Компоненты**: `PascalCase` (например, `UserProfile`)
- **Файлы**: `kebab-case` (например, `user-profile.tsx`)
- **CSS классы**: `lowercase-hyphen-case` (например, `.user-profile`)

### Структура директорий

```
<microfrontend-name>/
├── package.json                    # Конфигурация пакета
├── src/
│   ├── index.ts                   # Точка входа
│   ├── <component>.tsx            # Основной компонент
│   ├── types.ts                   # TypeScript типы
│   ├── styles.module.css          # CSS модули
│   └── __stories__/
│       └── index.stories.tsx      # Storybook истории
```

## 🎨 CSS и стилизация

### CSS модули

Используйте CSS модули для изоляции стилей:

```css
/* styles.module.css */
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

### Применение в компонентах

```tsx
import s from './styles.module.css';

export const MyComponent = () => (
  <div className={s.root}>
    <h1 className={s.title}>Заголовок</h1>
  </div>
);
```

## ⚛️ React компоненты

### Структура компонента

```tsx
import { useState, useEffect } from 'react';
import s from './styles.module.css';
import type { ComponentNameProps } from './types';

export const ComponentName = ({ title, description }: ComponentNameProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
      {description && <p className={s.description}>{description}</p>}
    </div>
  );
};
```

### TypeScript типы

```ts
export type ComponentNameProps = {
  title: string;
  description?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};
```

### Хуки

```tsx
// Кастомный хук
const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  return { value, updateValue };
};
```

## 📚 Storybook истории

### Базовая структура

```tsx
import type { StoryFn } from '@storybook/react';
import MyComponent, { type MyComponentProps } from '../index';

const Block: StoryFn<typeof MyComponent> = (props: MyComponentProps) => <MyComponent {...props} />;

export const Default = {
  render: Block,
  args: {
    title: 'Заголовок',
    description: 'Описание',
  },
  name: 'default',
};

export default {
  title: 'microfrontends/pages/my-component/default',
};
```

### Множественные истории

```tsx
export const WithDescription = {
  render: Block,
  args: {
    title: 'Заголовок с описанием',
    description: 'Подробное описание компонента',
  },
  name: 'with-description',
};

export const WithoutDescription = {
  render: Block,
  args: {
    title: 'Заголовок без описания',
  },
  name: 'without-description',
};
```

## 🔧 TypeScript

### Конфигурация

Проект использует **tsx** вместо ts-node для выполнения TypeScript файлов. Это обеспечивает:

- **Быструю компиляцию** благодаря esbuild
- **Лучшую поддержку** современных возможностей TypeScript
- **Меньше конфигурации** и зависимостей

### Строгие правила

- Используйте строгую типизацию
- Избегайте `any` - используйте конкретные типы
- Экспортируйте все публичные типы
- Используйте `interface` для объектов, `type` для примитивов

### Примеры типов

```ts
// Интерфейс для пропсов
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Тип для состояния
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Утилитарные типы
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

## 🧰 Библиотеки утилит

### @tinkoff/utils

В проекте рекомендуется использовать `@tinkoff/utils` вместо `lodash` для работы с утилитарными функциями. Это связано с тем, что:

- `@tinkoff/utils` предоставляет более современный API
- Лучшая оптимизация для tree-shaking
- Поддержка TypeScript "из коробки"
- Единый подход к утилитам в экосистеме Tinkoff

Установка:

```bash
yarn add @tinkoff/utils
```

Пример использования:

```ts
import { map, filter, compose } from '@tinkoff/utils/lib/array';
import { prop, pick } from '@tinkoff/utils/lib/object';

const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
];

// Получить имена активных пользователей старше 25 лет
const getActiveUserNames = compose(
  map(prop('name')),
  filter((user) => user.active && user.age > 25)
);

const result = getActiveUserNames(users); // ['Charlie']
```
