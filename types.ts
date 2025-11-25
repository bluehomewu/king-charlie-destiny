
export enum Category {
  KingMilkTea = '國王奶茶',
  QueenTea = '皇后品茶',
  PrincessFruit = '公主水果茶',
  FreshTea = '現萃茶',
  CastleMilk = '城堡鮮奶',
  KnightCap = '騎士奶蓋',
  HotDrinks = '熱飲'
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  priceM?: number;
  priceL?: number;
}

export interface SpinResult {
  item: MenuItem;
  fortune?: string;
  sugar?: string;
  ice?: string;
}

export interface FavoriteConfig {
  sugar?: string;
  ice?: string;
}
