import { Category } from '@contests/constants/category';

export function getCategoryIcon(categoryId: number) {
  return {
    [Category.CompetitiveProgramming]: 'square-brackets',
    [Category.Technologies]: 'technology-2',
    [Category.Math]: 'abstract-10',
    [Category.NonStandart]: 'scan-barcode',
    [Category.IQ]: 'artificial-intelligence',
    [Category.Mixed]: 'technology-4',
    [Category.Training]: 'code',
    [Category.Other]: 'setting',
  }[categoryId];
}
