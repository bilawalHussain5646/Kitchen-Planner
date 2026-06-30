import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src/data');

const productNameMap = {
  'LG InstaView Oven 76 Liters A++ Air Fry & Steam Sous-Vide': 'فرن LG InstaView 76 لتر A++ قلي بالهواء وبخار Sous-Vide',
  'LG InstaView Oven with Steam & Sous-Vide': 'فرن LG InstaView مع بخار وSous-Vide',
  'LG InstaView Oven 76 Liters A++': 'فرن LG InstaView 76 لتر A++',
  'Silver Built-in Oven': 'فرن مدمج فضي',
  'LG 90cm Built-in Gas Hob': 'موقد غاز LG مدمج 90 سم',
  'LG 75cm Built-in Gas Hob with Triple Burner': 'موقد غاز LG مدمج 75 سم بثلاث شعلات',
  'LG 60cm Built-in Gas Hob': 'موقد غاز LG مدمج 60 سم',
  'LG Chimney Hood 90cm': 'شفاط مدخنة LG 90 سم',
  'LG Chimney Hood 60cm': 'شفاط مدخنة LG 60 سم',
  'LG Induction Hob 4 Zones': 'موقد حث LG 4 مناطق',
  'LG Ceramic Hob 4 Zones': 'موقد سيراميك LG 4 مناطق',
  'LG Built-in Microwave 25L': 'ميكروويف LG مدمج 25 لتر',
  'LG Built-in Microwave 20L': 'ميكروويف LG مدمج 20 لتر',
  'LG Built-in Dishwasher 14 Place Settings': 'غسالة صحون LG مدمجة 14 مكاناً',
  'LG Built-in Dishwasher 12 Place Settings': 'غسالة صحون LG مدمجة 12 مكاناً',
  'LG Hood 60 cm with Touch Control': 'شفاط LG 60 سم بلمسة تحكم',
  'B700 Series 60 cm Induction Hob': 'موقد حث B700 سيريز 60 سم',
  'B500 Series 60 cm Gas Hob': 'موقد غاز B500 سيريز 60 سم',
  'LG InstaView Oven 76 Liters A++': 'فرن LG InstaView 76 لتر A++',
  'B500 Series 60 cm Induction Hob': 'موقد حث B500 سيريز 60 سم',
  'LG InstaView Oven 60 Liters A+': 'فرن LG InstaView 60 لتر A+',
};

function translateProductNames(obj) {
  if (Array.isArray(obj)) return obj.map(translateProductNames);
  if (obj && typeof obj === 'object') {
    const next = { ...obj };
    if (typeof next.name === 'string' && productNameMap[next.name]) {
      next.name = productNameMap[next.name];
    }
    for (const key of Object.keys(next)) {
      next[key] = translateProductNames(next[key]);
    }
    return next;
  }
  return obj;
}

const layoutReplacements = [
  ['Single Wall', 'جدار واحد'],
  ['L-Shaped', 'شكل L'],
  ['Island', 'جزيرة'],
  ['U-Shaped', 'شكل U'],
  ['Optimize Your Single Wall Kitchen', 'حسّن مطبخ الجدار الواحد'],
  ['Perfect Your L-Shaped Kitchen', 'أتقن مطبخ شكل L'],
  ['Transform Your Island Kitchen', 'حوّل مطبخ الجزيرة'],
  ['Elevate Your U-Shaped Kitchen', 'ارتقِ بمطبخ شكل U'],
  ["LG's Sleek Built-In Oven", 'فرن LG المدمج الأنيق'],
  ["LG's Advanced Built-In Oven", 'فرن LG المدمج المتقدم'],
  ["LG's Stylish Built-In Oven", 'فرن LG المدمج الأنيق'],
  ["LG's Innovative Built-In Oven", 'فرن LG المدمج المبتكر'],
  ['Built-In Gas Hob', 'موقد الغاز المدمج'],
  ['Built-In Dishwasher', 'غسالة الصحون المدمجة'],
  ['Chimney Hood', 'الشفاط المدخنة'],
  ['Enjoy quiet, powerful cleanup', 'استمتع بتنظيف هادئ وقوي'],
  ['Bring convenience and style', 'أضف الراحة والأناقة'],
  ['Maximize corner efficiency', 'عزّز كفاءة الزاوية'],
  ['Make your island the culinary center', 'اجعل الجزيرة مركز الطهي'],
  ['Clean large loads easily', 'نظّف الأحمال الكبيرة بسهولة'],
];

function translateKitchenLayouts(en) {
  let text = JSON.stringify(en);
  for (const [from, to] of layoutReplacements) {
    text = text.split(from).join(to);
  }
  return JSON.parse(text);
}

const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
fs.writeFileSync(
  path.join(root, 'products.ar.json'),
  JSON.stringify(translateProductNames(products), null, 2)
);

const rec = JSON.parse(fs.readFileSync(path.join(root, 'recProducts.json'), 'utf8'));
fs.writeFileSync(
  path.join(root, 'recProducts.ar.json'),
  JSON.stringify(translateProductNames(rec), null, 2)
);

const layouts = JSON.parse(fs.readFileSync(path.join(root, 'kitchenLayouts.json'), 'utf8'));
const layoutsAr = translateKitchenLayouts(layouts);
layoutsAr.layoutSuffix = 'تصميم';
fs.writeFileSync(path.join(root, 'kitchenLayouts.ar.json'), JSON.stringify(layoutsAr, null, 2));

console.log('Translated products.ar.json, recProducts.ar.json, kitchenLayouts.ar.json');
