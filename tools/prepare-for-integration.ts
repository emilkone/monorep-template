#!/usr/bin/env node

/**
 * Скрипт для подготовки микрофронтенда к интеграции в основной проект
 *
 * Использование:
 * npm run prepare-integration <microfrontend-name>
 *
 * Примеры:
 * npm run prepare-integration my-page
 * npm run prepare-integration product-catalog
 */

import { promises as fs } from 'fs';
import path from 'path';

interface IntegrationConfig {
  microfrontendName: string;
  sourceDir: string;
  outputDir: string;
}

function parseArguments(): IntegrationConfig {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Ошибка: Необходимо указать имя микрофронтенда');
    console.log('');
    console.log('Использование:');
    console.log('  npm run prepare-integration <microfrontend-name>');
    console.log('');
    console.log('Примеры:');
    console.log('  npm run prepare-integration my-page');
    console.log('  npm run prepare-integration product-catalog');
    process.exit(1);
  }

  const microfrontendName = args[0]!;
  const sourceDir = path.join(__dirname, '..', 'src', 'microfrontends', microfrontendName);
  const outputDir = path.join(__dirname, '..', 'integration-ready', microfrontendName);

  return {
    microfrontendName,
    sourceDir,
    outputDir,
  };
}

async function checkMicrofrontendExists(sourceDir: string): Promise<void> {
  try {
    await fs.access(sourceDir);
  } catch {
    console.error(`❌ Ошибка: Микрофронтенд "${path.basename(sourceDir)}" не найден`);
    console.log(`Проверьте, что директория существует: ${sourceDir}`);
    process.exit(1);
  }
}

async function readPackageJson(sourceDir: string): Promise<any> {
  const packageJsonPath = path.join(sourceDir, 'package.json');
  const content = await fs.readFile(packageJsonPath, 'utf-8');
  return JSON.parse(content);
}

async function updatePackageJsonForIntegration(
  packageJson: any,
  microfrontendName: string
): Promise<any> {
  // Обновляем имя пакета для интеграции в основной проект
  const updatedPackageJson = {
    ...packageJson,
    name: `@growth-blocks/${microfrontendName}`,
    version: '0.0.0-stub',
    description: packageJson.description || `Микрофронтенд ${microfrontendName}`,
    repository: {
      type: 'git',
      url: 'https://gitlab.tcsbank.ru/ded-pwa-forms/growth-blocks',
    },
    boxyConfig: {
      schema: {
        version: '1.0',
      },
    },
    author: packageJson.author || 'unknown',
    released: true,
  };

  // Добавляем внутренние зависимости Т-Банка как peerDependencies
  updatedPackageJson.peerDependencies = {
    ...updatedPackageJson.peerDependencies,
    '@growth-blocks/mocks': '^0.0.0-stub',
    classnames: '^0.0.0-stub',
  };

  // Удаляем зависимости, которые будут добавлены в основном проекте
  delete updatedPackageJson.dependencies;

  return updatedPackageJson;
}

async function copyDirectory(source: string, destination: string): Promise<void> {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function createIntegrationChecklist(
  microfrontendName: string,
  outputDir: string
): Promise<void> {
  const checklistContent = `# Чеклист интеграции микрофронтенда "${microfrontendName}"

## Перед интеграцией в основной проект:

### 1. Проверка package.json
- [ ] Имя пакета изменено на \`@growth-blocks/${microfrontendName}\`
- [ ] Версия установлена в \`0.0.0-stub\`
- [ ] Добавлен \`boxyConfig\`
- [ ] Установлен \`released: true\`
- [ ] Внутренние зависимости добавлены в \`peerDependencies\`

### 2. Проверка зависимостей
- [ ] Удалены все \`dependencies\` (будут добавлены в основном проекте)
- [ ] Оставлены только \`peerDependencies\`
- [ ] Проверены импорты в коде (нет прямых зависимостей от внутренних библиотек)

### 3. Проверка кода
- [ ] TypeScript компилируется без ошибок
- [ ] Все типы корректно экспортированы
- [ ] CSS модули работают корректно
- [ ] Storybook истории обновлены

### 4. Интеграция в основной проект
- [ ] Скопировать директорию в \`src/microfrontends/${microfrontendName}/\`
- [ ] Добавить в \`package.json\` основного проекта в \`workspaces\`
- [ ] Запустить \`yarn install\` в корне основного проекта
- [ ] Проверить работу в Storybook основного проекта
- [ ] Добавить специфичные зависимости при необходимости

### 5. Финальная проверка
- [ ] Микрофронтенд отображается в Storybook
- [ ] Все истории работают корректно
- [ ] TypeScript типы корректны
- [ ] Стили применяются правильно
- [ ] Нет ошибок в консоли

## Полезные команды:

\`\`\`bash
# В основном проекте
cd src/microfrontends/${microfrontendName}
yarn install

# Проверка типов
yarn check:types

# Запуск Storybook
yarn storybook
\`\`\`

## Контакты:
При возникновении проблем обратитесь к команде разработки основного проекта.
`;

  const checklistPath = path.join(outputDir, 'INTEGRATION_CHECKLIST.md');
  await fs.writeFile(checklistPath, checklistContent, 'utf-8');
}

async function prepareForIntegration(config: IntegrationConfig): Promise<void> {
  console.log(`🚀 Подготовка микрофронтенда "${config.microfrontendName}" к интеграции`);
  console.log(`📁 Исходная директория: ${config.sourceDir}`);
  console.log(`📁 Выходная директория: ${config.outputDir}`);

  // Проверяем существование микрофронтенда
  await checkMicrofrontendExists(config.sourceDir);

  // Читаем package.json
  const packageJson = await readPackageJson(config.sourceDir);
  console.log('✅ Прочитан package.json');

  // Обновляем package.json для интеграции
  const updatedPackageJson = await updatePackageJsonForIntegration(
    packageJson,
    config.microfrontendName
  );
  console.log('✅ Обновлен package.json для интеграции');

  // Копируем все файлы
  await copyDirectory(config.sourceDir, config.outputDir);
  console.log('✅ Скопированы файлы микрофронтенда');

  // Записываем обновленный package.json
  const packageJsonPath = path.join(config.outputDir, 'package.json');
  await fs.writeFile(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2), 'utf-8');
  console.log('✅ Записан обновленный package.json');

  // Создаем чеклист интеграции
  await createIntegrationChecklist(config.microfrontendName, config.outputDir);
  console.log('✅ Создан чеклист интеграции');

  console.log('');
  console.log('🎉 Микрофронтенд готов к интеграции!');
  console.log('');
  console.log('Следующие шаги:');
  console.log(`1. Проверьте файлы в директории: ${config.outputDir}`);
  console.log('2. Изучите чеклист интеграции: INTEGRATION_CHECKLIST.md');
  console.log('3. Скопируйте директорию в основной проект');
  console.log('4. Следуйте инструкциям из чеклиста');
}

async function main(): Promise<void> {
  try {
    const config = parseArguments();
    await prepareForIntegration(config);
  } catch (error) {
    console.error('❌ Ошибка при подготовке к интеграции:', error);
    process.exit(1);
  }
}

main();
