# Настройка софта в папке const/config.const.ts

Внимание на layerswap api ключ, без него скрипт не будет работать

# Рекомендации

## Не использовать зашифрованные приватники

## Кошельки хранятся в корне проекта в файле wallets.txt

## Аддресса fuel в файле destinations.txt

# Запуск

Должнен быть установлен node.js
Первый Запуск командой

```
npm run startup
```

В остальных случаях можно

```
npm run start
```

# Структура проекта

    .
    ├── build               # Compiled files (alternatively `dist`)
    ├── src                 # Source files (alternatively `lib` or `app`)
    ├── index.ts
    ├── wallets.txt         # PrivateKeys
    ├── destinations.txt
    └── readme.md
