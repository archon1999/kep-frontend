export const examples = [
  { id: 'sum', code: 'son a = al();\nson b = al();\nchiqar(a + b);\n', input: '3 5\n' },
  {
    id: 'gcd',
    code: 'shundat ekub(son a, son b) -> son {\n    toki b != 0 {\n        son r = a % b;\n        a = b;\n        b = r;\n    }\n    qaytar a;\n}\n\nson a = al();\nson b = al();\nchiqar(ekub(a, b));\n',
    input: '48 18\n',
  },
  {
    id: 'array',
    code: 'son n = al();\nson[] a = [];\naylan i = 0 .. n {\n    qosh(a, al());\n}\nsarala(a);\nchiqar(a);\n',
    input: '5\n9 2 7 1 4\n',
  },
  {
    id: 'map',
    code: 'son n = al();\nlugat<matn, son> sanoq = lugat();\naylan i = 0 .. n {\n    matn soz = al_soz();\n    sanoq[soz] = qiymat(sanoq, soz, 0) + 1;\n}\nchiqar(qiymat(sanoq, "xorazm", 0));\nchiqar(uzunligi(sanoq));\n',
    input: '5\nxorazm kep xorazm salom xorazm\n',
  },
  {
    id: 'set',
    code: 'son n = al();\ntoplam<son> sonlar = toplam();\naylan i = 0 .. n {\n    qosh(sonlar, al());\n}\nchiqar(uzunligi(sonlar));\nchiqar(bomi(sonlar, 7));\nuchir(sonlar, 7);\nchiqar(bomi(sonlar, 7));\n',
    input: '6\n1 7 2 7 1 3\n',
  },
] as const;
