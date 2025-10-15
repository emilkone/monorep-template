# Конвенции разработки

Правила и стандарты для разработки микрофронтендов в аутсорс-репозитории.

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
