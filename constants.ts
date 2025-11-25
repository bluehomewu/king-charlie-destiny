import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // King Milk Tea
  { id: 'k1', name: '錫蘭奶茶', category: Category.KingMilkTea, priceL: 50 },
  { id: 'k2', name: '皇家珍奶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k3', name: '仙草奶凍', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k4', name: '布丁奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k5', name: '黑糖/焦糖奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k6', name: '陽光豆漿紅', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k7', name: '巧克力奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k8', name: '鴛鴦奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k9', name: '古義奧特奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k10', name: '紅豆奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k11', name: '靜岡日式奶茶', category: Category.KingMilkTea, priceL: 55 },
  { id: 'k12', name: '鮮芋QQ奶茶', category: Category.KingMilkTea, priceL: 65 },

  // Queen Tea
  { id: 'q1', name: '錫蘭紅茶', category: Category.QueenTea, priceL: 30 },
  { id: 'q2', name: '茉香綠茶', category: Category.QueenTea, priceL: 30 },
  { id: 'q3', name: '四季春', category: Category.QueenTea, priceL: 30 },
  { id: 'q4', name: '鐵觀音', category: Category.QueenTea, priceL: 30 },
  { id: 'q5', name: '古早味紅茶', category: Category.QueenTea, priceL: 30 },
  { id: 'q6', name: '蜂蜜綠茶', category: Category.QueenTea, priceL: 50 },
  { id: 'q7', name: '古義奧特綠茶', category: Category.QueenTea, priceL: 50 },
  { id: 'q8', name: '綠茶多多', category: Category.QueenTea, priceL: 50 },
  { id: 'q9', name: '蔗香紅茶', category: Category.QueenTea, priceL: 50 },
  { id: 'q10', name: '蔗香烏龍', category: Category.QueenTea, priceL: 50 },
  { id: 'q11', name: '冰淇淋紅茶', category: Category.QueenTea, priceL: 55 },
  { id: 'q12', name: '脆梅果綠', category: Category.QueenTea, priceL: 55 },

  // Princess Fruit
  { id: 'p1', name: '港檸茶', category: Category.PrincessFruit, priceL: 55 },
  { id: 'p2', name: '冬瓜檸檬', category: Category.PrincessFruit, priceL: 55 },
  { id: 'p3', name: '蜂蜜檸檬', category: Category.PrincessFruit, priceL: 55 },
  { id: 'p4', name: '百香鮮果QQ', category: Category.PrincessFruit, priceL: 55 },
  { id: 'p5', name: '檸檬蘆薈', category: Category.PrincessFruit, priceL: 60 },
  { id: 'p6', name: '蔓越莓蘆薈', category: Category.PrincessFruit, priceL: 60 },
  { id: 'p7', name: '檸檬多多', category: Category.PrincessFruit, priceL: 60 },
  { id: 'p8', name: '金桔檸檬', category: Category.PrincessFruit, priceL: 60 },
  { id: 'p9', name: '爆打檸檬茶', category: Category.PrincessFruit, priceL: 65 },
  { id: 'p10', name: '爆打檸檬琥珀紅', category: Category.PrincessFruit, priceL: 65 },
  { id: 'p11', name: '葡萄柚春茶', category: Category.PrincessFruit, priceL: 65 },
  { id: 'p12', name: '繽紛水果茶', category: Category.PrincessFruit, priceL: 70 },
  { id: 'p13', name: '紅龍果知春', category: Category.PrincessFruit, priceL: 70 },

  // Fresh Tea
  { id: 'f1', name: '桂花金萱烏龍', category: Category.FreshTea, priceL: 55 },
  { id: 'f2', name: '凍頂烏龍茶', category: Category.FreshTea, priceL: 55 },
  { id: 'f3', name: '茉莉花綠茶', category: Category.FreshTea, priceL: 55 },
  { id: 'f4', name: '葉薄荷綠茶', category: Category.FreshTea, priceL: 55 },
  { id: 'f5', name: '蜜桃烏龍', category: Category.FreshTea, priceL: 55 },
  { id: 'f6', name: '黑森林野莓果粒茶', category: Category.FreshTea, priceL: 55 },
  { id: 'f7', name: '蟬涎蜜香', category: Category.FreshTea, priceL: 55 },
  { id: 'f8', name: '金絲猴紅茶', category: Category.FreshTea, priceL: 60 },

  // Castle Milk
  { id: 'c1', name: '鮮奶茶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c2', name: '古早味紅茶鮮奶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c3', name: '冬瓜鮮奶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c4', name: '甘蔗鮮奶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c5', name: '杏仁鮮奶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c6', name: '黑糖鮮奶', category: Category.CastleMilk, priceM: 55, priceL: 70 },
  { id: 'c7', name: '靜岡煎茶佐鮮奶', category: Category.CastleMilk, priceL: 80 }, // Assuming 65/80 based on pattern, image slightly blurry on priceM
  { id: 'c8', name: '可可歐蕾', category: Category.CastleMilk, priceL: 80 },

  // Knight Cap
  { id: 'n1', name: '四季春奶蓋', category: Category.KnightCap, priceL: 60 },
  { id: 'n2', name: '紅龍果奶蓋', category: Category.KnightCap, priceL: 85 },
  { id: 'n3', name: '芒果奶蓋', category: Category.KnightCap, priceL: 95 },

  // Hot
  { id: 'h1', name: '桂圓茶', category: Category.HotDrinks, priceM: 45, priceL: 60 },
  { id: 'h2', name: '杏仁茶', category: Category.HotDrinks, priceM: 45, priceL: 60 },
  { id: 'h3', name: '黑糖老薑茶', category: Category.HotDrinks, priceM: 45, priceL: 60 },
  { id: 'h4', name: '可可亞', category: Category.HotDrinks, priceM: 50, priceL: 65 },
  { id: 'h5', name: '極品咖啡', category: Category.HotDrinks, priceM: 50, priceL: 65 },
  { id: 'h6', name: '黑糖老薑鮮奶', category: Category.HotDrinks, priceL: 70 }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.KingMilkTea]: '#FCA5A5', // red-300
  [Category.QueenTea]: '#FDBA74', // orange-300
  [Category.PrincessFruit]: '#F9A8D4', // pink-300
  [Category.FreshTea]: '#86EFAC', // green-300
  [Category.CastleMilk]: '#E5E7EB', // gray-200
  [Category.KnightCap]: '#DDD6FE', // violet-200
  [Category.HotDrinks]: '#FECACA'  // red-200
};

export const SUGAR_LEVELS = [
  '全糖', 
  '八分糖', 
  '半糖', 
  '少糖', 
  '微糖', 
  '微微糖', 
  '無糖'
];

export const ICE_LEVELS = [
  '多冰', 
  '正常冰', 
  '少冰', 
  '微冰', 
  '去冰'
];