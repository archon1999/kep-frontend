import { Categories } from '@problems/models/problems.models';

export function getCategoryIcon(category: Categories) {
  return {
    [Categories.CompetitiveProgramming]: 'square-brackets',
    [Categories.WebProgramming]: 'message-programming',
    [Categories.Python]: 'python',
    [Categories.IndustrialProgramming]: 'technology-4',
    [Categories.OS]: 'underlining',
    [Categories.BasicProgramming]: 'code',
    [Categories.Math]: 'abstract-10',
    [Categories.Database]: 'data',
    [Categories.KEP]: 'setting-2',
    [Categories.CTF]: 'lock',
    [Categories.NonStandart]: 'scan-barcode',
    [Categories.WebScraping]: 'technology-2',
  }[category];
}

export function getCategoryIdByCode(code: string): Categories {
  switch (code) {
    case 'competitive-programming': return 1;
    case 'python': return 2;
    case 'basic-programming': return 3;
    case 'web-programming': return 4;
    case 'web-scraping': return 5;
    case 'os': return 6;
    case 'math': return 7;
    case 'database': return 8;
    case 'industrial-programming': return 9;
    case 'kep': return 10;
    case 'non-standart': return 11;
    case 'ctf': return 12;
  }
}
