import type { ICauldronValues, IReaction, IIngredient } from '@/types';

const hasIngredients = (ingredients: IIngredient[], ...ids: string[]): boolean =>
  ids.every((id) => ingredients.some((item) => item.id === id));

const sumOf = (ingredients: IIngredient[], key: keyof ICauldronValues): number => {
  let sum = 0;

  for (const ingredient of ingredients) {
    sum += ingredient[key];
  }

  return sum;
};

export const REACTIONS: IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    difficulty: 'medium',
    isActive: (ingredients) => hasIngredients(ingredients, 'fairy-dust', 'caustic-acid'),
    apply: (values) => ({ ...values, magicPower: values.magicPower * 1.5 }),
    timePenalty: 10,
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    difficulty: 'medium',
    isActive: (ingredients) => hasIngredients(ingredients, 'dragon-tears', 'frost-lotus'),
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 1.2 }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    difficulty: 'hard',
    isActive: (ingredients) =>
      hasIngredients(ingredients, 'phoenix-feather', 'essence-of-the-void'),
    apply: (values) => values,
    lifePenalty: 1,
    clearsCauldron: true,
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    difficulty: 'hard',
    isActive: (ingredients) =>
      ingredients.some((ingredient) => ingredient.temperature > 15) &&
      ingredients.some((ingredient) => ingredient.temperature < -15),
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 2 }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    difficulty: 'hard',
    isActive: (ingredients) =>
      hasIngredients(ingredients, 'dragon-tears', 'caustic-acid') &&
      sumOf(ingredients, 'temperature') >= 35,
    apply: (values) => ({ ...values, temperature: values.temperature + 10 }),
    timePenalty: 5,
  },
];
