# FAQ - Часто задаваемые вопросы

## 🚀 Начало работы

### Как создать новый микрофронтенд?

```bash
npm run create-microfrontend my-page "Моя страница" "Иван Иванов"
```

### Как запустить Storybook?

```bash
npm run storybook
```

Storybook будет доступен по адресу: http://localhost:3040

### Как проверить код на ошибки?

```bash
# Проверка типов
npm run check:types

# Проверка линтеров
npm run check:all

# Форматирование кода
npm run format:all
```

## 🎨 Стилизация

### Как использовать CSS модули?

```tsx
import s from './styles.module.css'

export const MyComponent = () => (
  <div className={s.root}>
    <h1 className={s.title}>Заголовок</h1>
  </div>
)
```

### Какие шрифты доступны?

- `dsHeading` - для заголовков
- `dsText` - для основного текста

```css
.title {
  font-family: 'dsHeading', 'dsHeading Fallback', sans-serif;
  font-weight: 600;
}
```

### Как добавить адаптивность?

```css
.title {
  font-size: 32px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
}
```

## ⚛️ React

### Как создать компонент с состоянием?

```tsx
import { useState } from 'react'

export const MyComponent = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Увеличить
      </button>
    </div>
  )
}
```

### Как обработать события?

```tsx
export const MyComponent = ({ onSubmit }: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Как использовать useEffect?

```tsx
import { useEffect, useState } from 'react'

export const MyComponent = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Загрузка данных при монтировании
    fetchData().then(setData)
  }, [])
  
  return <div>{data ? data.title : 'Загрузка...'}</div>
}
```

## 📚 Storybook

### Как создать историю?

```tsx
import type { StoryFn } from '@storybook/react'
import MyComponent, { type MyComponentProps } from '../index'

const Block: StoryFn<typeof MyComponent> = (props: MyComponentProps) => (
  <MyComponent {...props} />
)

export const Default = {
  render: Block,
  args: {
    title: 'Заголовок',
    description: 'Описание',
  },
  name: 'default',
}

export default {
  title: 'microfrontends/pages/my-component/default',
}
```

### Как добавить несколько историй?

```tsx
export const WithDescription = {
  render: Block,
  args: {
    title: 'Заголовок с описанием',
    description: 'Подробное описание',
  },
  name: 'with-description',
}

export const WithoutDescription = {
  render: Block,
  args: {
    title: 'Заголовок без описания',
  },
  name: 'without-description',
}
```

## 🔧 TypeScript

### Как типизировать пропсы?

```tsx
interface MyComponentProps {
  title: string
  description?: string
  onClick?: () => void
}

export const MyComponent = ({ title, description, onClick }: MyComponentProps) => {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  )
}
```

### Как типизировать события?

```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  // обработка клика
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  // обработка изменения
}
```

### Как создать утилитарный тип?

```ts
// Делает все свойства опциональными
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Делает определённые свойства обязательными
type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P]
}
```

## 📦 Зависимости

### Какие зависимости можно использовать?

✅ **Разрешённые:**
- `react`, `react-dom`
- `classnames`
- `lodash`, `date-fns`, `axios`
- Другие публичные npm-пакеты

❌ **Запрещённые:**
- `@tinkoff-*`
- `@platform-ui/*`
- `@hubert/*`
- `@tinkoff-fb/*`
- `@pfp-debit/*`

### Как добавить зависимость?

```bash
# В корне проекта
npm install lodash
npm install @types/lodash --save-dev
```

### Что делать, если нужна функциональность внутренней библиотеки?

Реализуйте собственную версию или используйте публичную альтернативу:

```tsx
// Вместо @tinkoff/utils
import { debounce } from 'lodash'

// Вместо @platform-ui/button
const Button = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} className={s.button}>
    {children}
  </button>
)
```

## 🔄 Интеграция

### Как подготовить микрофронтенд к интеграции?

```bash
npm run prepare-integration my-page
```

### Что происходит при подготовке?

1. Обновляется `package.json` для интеграции
2. Изменяется scope на `@growth-blocks/`
3. Добавляются необходимые поля для Т-Банка
4. Создаётся чеклист интеграции

### Как интегрировать в основной проект?

1. Скопируйте директорию из `integration-ready/`
2. Добавьте в `workspaces` основного `package.json`
3. Запустите `yarn install`
4. Следуйте инструкциям из чеклиста

## 🚨 Проблемы и решения

### Ошибка "Module not found"

**Проблема:** TypeScript не может найти модуль

**Решение:**
1. Проверьте правильность импорта
2. Убедитесь, что файл существует
3. Проверьте экспорты в файле

### Ошибка "Cannot find name"

**Проблема:** TypeScript не может найти тип или переменную

**Решение:**
1. Добавьте импорт типа
2. Проверьте правильность имени
3. Убедитесь, что тип экспортирован

### Стили не применяются

**Проблема:** CSS модули не работают

**Решение:**
1. Проверьте импорт CSS модуля
2. Убедитесь, что классы существуют
3. Проверьте правильность применения классов

### Storybook не находит истории

**Проблема:** Истории не отображаются в Storybook

**Решение:**
1. Проверьте, что файл `*.stories.tsx` существует
2. Убедитесь, что путь в `title` корректный
3. Проверьте экспорты в файле историй

## 📞 Поддержка

### Где получить помощь?

1. Изучите документацию в `docs/`
2. Проверьте примеры в `src/microfrontends/_template/`
3. Обратитесь к команде разработки основного проекта

### Как сообщить о проблеме?

1. Опишите проблему подробно
2. Приложите код, который вызывает ошибку
3. Укажите шаги для воспроизведения
4. Приложите скриншоты если необходимо

### Полезные команды для диагностики

```bash
# Проверка версий
node --version
npm --version

# Очистка кэша
npm cache clean --force

# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install

# Проверка конфигурации
npm run check:all
```
