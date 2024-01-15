import { Category } from '@contests/constants/category';

export function getCategoryIcon(categoryId: number) {
  return {
    [Category.CompetitiveProgramming]: 'code',
    [Category.Technologies]: 'code',
    [Category.Math]: 'code',
    [Category.NonStandart]: 'code',
    [Category.IQ]: 'code',
    [Category.Mixed]: 'code',
    [Category.Training]: 'code',
    [Category.Other]: 'code',
  }[categoryId];
}
