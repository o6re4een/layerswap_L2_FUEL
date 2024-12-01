// НАСТРОЙКИ ЗАПУСКА

export const sleepFrom = 90; // Задержка между активностями и кошельками ОТ
export const sleepTo = 150; // Задержка между активностями и кошельками ДО

export const shuffleWallets = true; // true - перемешиваем кошельки; false - не перемешиваем
export const sourceChain = "ARBITRUM";

export const amountETH = {
  // Диапазон в ЕФИРЕ
  min: 0.001,
  max: 0.002,
};

export const amountPercent = {
  // Диапазон в ПРОЦЕНТАХ
  min: 70,
  max: 90,
};

export const rpcs = [
  "https://arbitrum-one.public.blastapi.io",
  "https://arbitrum.meowrpc.com",
];

export const usePercent = true; // true - используем ПРОЦЕНТЫ, false - используем диапазон ЕФИРА

// ШИФРОВКА КОШЕЛЬКОВ DEGENSOFT

export const decryptAccounts = false; // true - рассшифровка, false - без шифровки

export const decryptPass = ""; // ПАРОЛЬ от кошельков

// API ключ от LAYERSWAP
export const LAYERSWAP_API = "APIKEY";
