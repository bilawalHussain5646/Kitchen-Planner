import fs from 'fs';

let s = fs.readFileSync('src/components/InteractiveKitchenLayouts.jsx', 'utf8');
const start = s.indexOf('const layoutData = ');
const end = s.indexOf('const layoutImages');
s = s.slice(0, start) + s.slice(end);

s = s.replace(
  'export default function InteractiveKitchenLayouts()',
  'export default function InteractiveKitchenLayouts({ data, copy })'
);

const fnBody = 'export default function InteractiveKitchenLayouts({ data, copy }) {';
const insert = `
  const { layoutData, layoutSuffix, categories: categoryLabels } = data;
  const iconMap = {
    oven: OvenIcon,
    gas: GasHobIcon,
    hood: HoodIcon,
    electric: ElectricHobIcon,
    microwave: MicrowaveIcon,
    dishwasher: DishwasherIcon,
  };
`;
s = s.replace(fnBody, fnBody + insert);

s = s.replace(
  /  const categories = \[[\s\S]*?  \];/,
  `  const categories = categoryLabels.map((cat) => ({
    ...cat,
    IconComponent: iconMap[cat.id],
  }));`
);

s = s.replace('{item.type} Layout', '{item.type} {layoutSuffix}');

fs.writeFileSync('src/components/InteractiveKitchenLayouts.jsx', s);
console.log('patched');
