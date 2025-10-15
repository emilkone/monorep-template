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

interface MicrofrontendConfig {
  name: string;
  description: string;
  author: string;
  componentName: string;
  componentFileName: string;
  microfrontendName: string;
  microfrontendCategory: string;
}

function parseArguments(): MicrofrontendConfig {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Ошибка: Необходимо указать имя микрофронтенда');
    console.log('');
    console.log('Использование:');
    console.log('  npm run create-microfrontend <name> [description] [author]');
    console.log('');
    console.log('Примеры:');
    console.log('  npm run create-microfrontend my-page "Моя страница" "Иван Иванов"');
    console.log('  npm run create-microfrontend product-catalog "Каталог продуктов"');
    process.exit(1);
  }

  const name = args[0];
  const description = args[1] || `Микрофронтенд ${name}`;
  const author = args[2] || 'unknown';

  // Генерируем имена компонентов
  const componentName = name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const componentFileName = name.replace(/-/g, '-');
  const microfrontendName = name;
  const microfrontendCategory = 'pages'; // можно сделать настраиваемым

  return {
    name,
    description,
    author,
    componentName,
    componentFileName,
    microfrontendName,
    microfrontendCategory,
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
  const content = await fs.readFile(templatePath, 'utf-8');
  const processedContent = await replaceTemplateVariables(content, config);

  // Создаем директорию если не существует
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  await fs.writeFile(targetPath, processedContent, 'utf-8');
}

async function createMicrofrontend(config: MicrofrontendConfig): Promise<void> {
  const templateDir = path.join(__dirname, '..', 'src', 'microfrontends', '_template');
  const targetDir = path.join(__dirname, '..', 'src', 'microfrontends', config.name);

  console.log(`🚀 Созд��ние микрофронтенда: ${config.name}`);
  console.log(`📁 Целевая директория: ${targetDir}`);

  // Проверяем, что директория не существует
  try {
    await fs.access(targetDir);
    console.error(`❌ Ошибка: Микрофронтенд с именем "${config.name}" уже существует`);
    process.exit(1);
  } catch {
    // Директория не существует, продолжаем
  }

  // Копируем файлы из шаблона
  const filesToCopy = [
    { template: 'package.json', target: 'package.json' },
    { template: 'src/index.ts', target: 'src/index.ts' },
    { template: 'src/types.ts', target: 'src/types.ts' },
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
  const componentTemplatePath = path.join(templateDir, 'src', '{{COMPONENT_FILE_NAME}}.tsx');
  const componentTargetPath = path.join(targetDir, 'src', `${config.componentFileName}.tsx`);

  await copyTemplateFile(componentTemplatePath, componentTargetPath, config);
  console.log(`✅ Создан компонент: ${config.componentFileName}.tsx`);

  console.log('');
  console.log('🎉 Микрофронтенд успешно создан!');
  console.log('');
  console.log('Следующие шаги:');
  console.log(`1. Перейдите в директорию: cd src/microfrontends/${config.name}`);
  console.log('2. Установите зависимости: npm install');
  console.log('3. Реализуйте логику компонента');
  console.log('4. Добавьте тесты и истории');
  console.log('5. Запустите Storybook: npm run storybook');
}

async function main(): Promise<void> {
  try {
    const config = parseArguments();
    await createMicrofrontend(config);
  } catch (error) {
    console.error('❌ Ошибка при создании микрофронтенда:', error);
    process.exit(1);
  }
}

main();
