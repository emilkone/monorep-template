#!/usr/bin/env node

/**
 * Скрипт для создания нового микрофронтенда из шаблона
 *
 * Использование:
 * npm run create-microfrontend <name> [description] [author]
 *
 * Примеры:
 * npm run create-microfrontend my-page "Моя страница" "Иван Иванов"
 * npm run create-microfrontend product-catalog "Каталог продуктов"
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MicrofrontendConfig {
  name: string;
  description: string;
  author: string;
  componentName: string;
  componentFileName: string;
  microfrontendName: string;
  microfrontendCategory: string;
  platform: 'desktop' | 'mobile' | 'common';
}

function printUsage() {
  console.log('');
  console.log('Использование:');
  console.log('  npm run create-microfrontend <name> [description] [author]');
  console.log('');
  console.log('Примеры:');
  console.log('  npm run create-microfrontend my-page "Моя страница" "Иван Иванов"');
  console.log('  npm run create-microfrontend product-catalog "Каталог продуктов"');
}

async function parseArguments(): Promise<MicrofrontendConfig> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Ошибка: Необходимо указать имя микрофронтенда');
    printUsage();
    process.exit(1);
  }

  const name = args[0];
  const description = args[1] || `Микрофронтенд ${name}`;
  const author = args[2] || 'unknown';

  if (!name) {
    console.error('❌ Ошибка: Необходимо указать имя микрофронтенда');
    process.exit(1);
  }

  // Интерактивный выбор платформы
  const platformResponse = await prompts({
    type: 'select',
    name: 'value',
    message: 'Для какой платформы создаётся микрофронтенд?',
    choices: [
      { title: 'Desktop', value: 'desktop' },
      { title: 'Mobile', value: 'mobile' },
      { title: 'Общая (для обеих)', value: 'common' },
    ],
    initial: 0,
  });

  if (!platformResponse.value) {
    console.error('❌ Выбор платформы отменён');
    process.exit(1);
  }

  const platform = platformResponse.value;

  const prefix = platform === 'common' ? 'independent' : platform;

  const nameWithPrefix = `${prefix}-${name}`;

  // Генерируем имена компонентов
  const componentName = `${nameWithPrefix
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')}`;

  const componentFileName = nameWithPrefix;
  const microfrontendName = nameWithPrefix;
  const microfrontendCategory = 'pages';

  return {
    name: nameWithPrefix,
    description,
    author,
    componentName,
    componentFileName,
    microfrontendName,
    microfrontendCategory,
    platform,
  };
}

async function replaceTemplateVariables(
  content: string,
  config: MicrofrontendConfig
): Promise<string> {
  return content
    .replace(/\{\{MICROFRONTEND_NAME\}\}/g, config.microfrontendName)
    .replace(/\{\{MICROFRONTEND_DESCRIPTION\}\}/g, config.description)
    .replace(/\{\{AUTHOR_NAME\}\}/g, config.author)
    .replace(/\{\{COMPONENT_NAME\}\}/g, config.componentName)
    .replace(/\{\{COMPONENT_FILE_NAME\}\}/g, config.componentFileName)
    .replace(/\{\{MICROFRONTEND_CATEGORY\}\}/g, config.microfrontendCategory);
}

async function copyTemplateFile(
  templatePath: string,
  targetPath: string,
  config: MicrofrontendConfig
): Promise<void> {
  try {
    const content = await fs.readFile(templatePath, 'utf-8');
    const processedContent = await replaceTemplateVariables(content, config);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, processedContent, 'utf-8');
  } catch (error) {
    console.error(`❌ Ошибка при копировании файла: ${templatePath}`);
    throw error;
  }
}

async function createMicrofrontend(config: MicrofrontendConfig): Promise<void> {
  const templateDir = path.join(__dirname, '..', 'src', 'microfrontends', '_template');
  const targetDir = path.join(__dirname, '..', 'src', 'microfrontends', config.name);

  console.log(`🚀 Создание микрофронтенда: ${config.name}`);
  console.log(`📁 Целевая директория: ${targetDir}`);
  console.log(`📱 Платформа: ${config.platform}`);

  // Проверка существования директории
  try {
    await fs.access(targetDir);
    console.error(`❌ Ошибка: Микрофронтенд с именем "${config.name}" уже существует`);
    process.exit(1);
  } catch {
    // Директория не существует, продолжаем
  }

  // Копируем файлы из шаблона
  const filesToCopy = [
    { template: '_package.json', target: 'package.json' },
    { template: 'src/index.template', target: 'src/index.ts' },
    { template: 'src/types.template', target: 'src/types.ts' },
    { template: 'src/styles.module.css', target: 'src/styles.module.css' },
    {
      template: 'src/__stories__/index.stories.tsx.template',
      target: 'src/__stories__/index.stories.tsx',
    },
  ];

  for (const file of filesToCopy) {
    const templatePath = path.join(templateDir, file.template);
    const targetPath = path.join(targetDir, file.target);

    await copyTemplateFile(templatePath, targetPath, config);
    console.log(`✅ Создан файл: ${file.target}`);
  }

  // Создаем основной компонент
  const componentTemplatePath = path.join(
    templateDir,
    'src',
    '{{COMPONENT_FILE_NAME}}.tsx.template'
  );
  const componentTargetPath = path.join(targetDir, 'src', `${config.componentFileName}.tsx`);

  await copyTemplateFile(componentTemplatePath, componentTargetPath, config);
  console.log(`✅ Создан компонент: ${config.componentFileName}.tsx`);

  console.log('');
  console.log('🎉 Микрофронтенд успешно создан!');
  console.log('');
  console.log('Следующие шаги:');
  console.log(`1. Перейдите в директорию: cd src/microfrontends/${config.name}`);
  console.log('2. Установите зависимости: yarn install');
  console.log('3. Реализуйте логику компонента');
  console.log('4. Добавьте тесты и истории');
  console.log('5. В корневой директории проекта запустите Storybook: yarn storybook');
}

async function main(): Promise<void> {
  try {
    const config = await parseArguments();
    await createMicrofrontend(config);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Ошибка при создании микрофронтенда:', error.message);
    } else {
      console.error('❌ Неизвестная ошибка:', error);
    }
    process.exit(1);
  }
}

main();
