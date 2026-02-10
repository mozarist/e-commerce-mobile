import { TailwindColors } from '@/constants/tailwindColors';

export function useTailwindColor(
  color: keyof typeof TailwindColors
) {
  return TailwindColors[color];
}
