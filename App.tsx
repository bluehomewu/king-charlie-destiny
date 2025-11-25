import React, { useState, useMemo, useEffect } from 'react';
import { MENU_ITEMS, SUGAR_LEVELS, ICE_LEVELS } from './constants';
import { Category, MenuItem, SpinResult, FavoriteConfig } from './types';
import Wheel from './components/Wheel';
import ResultModal from './components/ResultModal';
import { getDrinkFortune } from './services/aiService';

const App: React.FC = () => {
  // --- State ---
  // Selection Modes
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteConfigs, setFavoriteConfigs] = useState<Record<string, FavoriteConfig>>({});
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Price Filter State
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Toggles & Limits
  const [randomSugar, setRandomSugar] = useState(false);
  const [sugarLimit, setSugarLimit] = useState<string>(SUGAR_LEVELS[0]); // Default to 'Full Sugar' (Index 0)
  
  const [randomIce, setRandomIce] = useState(false);
  const [iceLimit, setIceLimit] = useState<string>(ICE_LEVELS[0]); // Default to 'More Ice' (Index 0)

  // Wheel & Result
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- Effects ---
  // Load favorites and configs from local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('kingCharlieFavs');
    const savedConfigs = localStorage.getItem('kingCharlieFavConfigs');
    
    if (savedFavs) {
      try {
        setFavoriteIds(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    
    if (savedConfigs) {
      try {
        setFavoriteConfigs(JSON.parse(savedConfigs));
      } catch (e) {
        console.error("Failed to parse favorite configs", e);
      }
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('kingCharlieFavs', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Save configs
  useEffect(() => {
    localStorage.setItem('kingCharlieFavConfigs', JSON.stringify(favoriteConfigs));
  }, [favoriteConfigs]);

  // --- Derived Data ---
  const activeItems = useMemo(() => {
    // 1. Filter by Category or Favorites
    let items = isFavoritesMode
      ? MENU_ITEMS.filter(item => favoriteIds.includes(item.id))
      : MENU_ITEMS.filter(item => selectedCategories.includes(item.category));

    // 2. Filter by Price
    // Logic: A drink is valid if ANY of its size prices (M or L) falls within the [min, max] range.
    if (minPrice !== '' || maxPrice !== '') {
        const min = minPrice === '' ? 0 : parseInt(minPrice, 10);
        const max = maxPrice === '' ? Infinity : parseInt(maxPrice, 10);

        items = items.filter(item => {
            const prices = [item.priceM, item.priceL].filter((p): p is number => p !== undefined);
            // Check if there is at least one price option that satisfies: min <= price <= max
            return prices.some(p => p >= min && p <= max);
        });
    }

    return items;
  }, [selectedCategories, isFavoritesMode, favoriteIds, minPrice, maxPrice]);

  // Helper to check if all categories are selected
  const isAllSelected = !isFavoritesMode && selectedCategories.length === Object.values(Category).length;
  const hasSelection = isFavoritesMode || selectedCategories.length > 0;

  // --- Handlers ---
  const toggleCategory = (cat: Category) => {
    if (isSpinning) return;
    setIsFavoritesMode(false); // Switch off favorites mode
    
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const selectAll = () => {
    if (isSpinning) return;
    setIsFavoritesMode(false);
    setSelectedCategories(Object.values(Category));
  };

  const selectFavoritesMode = () => {
    if (isSpinning) return;
    setIsFavoritesMode(true);
    setSelectedCategories([]); // Optional: clear categories visual, or keep them in bg
  };

  const resetSelection = () => {
    if (isSpinning) return;
    setIsFavoritesMode(false);
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation(); // Prevent opening details details
    setFavoriteIds(prev => {
      const isRemoving = prev.includes(itemId);
      if (isRemoving) {
        // Cleanup config if removing
        const newConfigs = { ...favoriteConfigs };
        delete newConfigs[itemId];
        setFavoriteConfigs(newConfigs);
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const updateFavoriteConfig = (itemId: string, type: 'sugar' | 'ice', value: string) => {
    setFavoriteConfigs(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: value === '' ? undefined : value
      }
    }));
  };

  const handleSpinEnd = async (item: MenuItem) => {
    let sugar: string | undefined;
    let ice: string | undefined;

    // Logic: 
    // 1. If in Favorites Mode AND item has config, use config.
    // 2. Else if Random toggles are ON, use random (respecting limits).
    // 3. Else undefined.
    
    const itemConfig = favoriteConfigs[item.id];
    
    // Determine Sugar
    if (isFavoritesMode && itemConfig?.sugar) {
        sugar = itemConfig.sugar;
    } else if (randomSugar) {
        // SUGAR_LEVELS are ordered from High to Low (Full -> None)
        // We find the index of the limit, and pick anything from that index onwards
        const limitIndex = SUGAR_LEVELS.indexOf(sugarLimit);
        const validOptions = limitIndex >= 0 ? SUGAR_LEVELS.slice(limitIndex) : SUGAR_LEVELS;
        sugar = validOptions[Math.floor(Math.random() * validOptions.length)];
    }

    // Determine Ice
    if (isFavoritesMode && itemConfig?.ice) {
        ice = itemConfig.ice;
    } else if (randomIce) {
        // ICE_LEVELS are ordered from High to Low (More -> Gone)
        const limitIndex = ICE_LEVELS.indexOf(iceLimit);
        const validOptions = limitIndex >= 0 ? ICE_LEVELS.slice(limitIndex) : ICE_LEVELS;
        ice = validOptions[Math.floor(Math.random() * validOptions.length)];
    }

    const resultObj: SpinResult = { item, sugar, ice };
    setSpinResult(resultObj);
    setShowModal(true);

    // Call AI
    const aiText = await getDrinkFortune(item);
    setSpinResult(prev => prev ? { ...prev, fortune: aiText } : null);
  };

  const handleReset = () => {
    setShowModal(false);
    // Optional: wait for modal animation to close
    setTimeout(() => setSpinResult(null), 300);
  };

  // Logic for filtering the display list (search)
  const displayItems = useMemo(() => {
    const baseList = isFavoritesMode ? activeItems : MENU_ITEMS;
    if (!searchQuery) return baseList;
    return baseList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [isFavoritesMode, activeItems, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans text-gray-800 pb-8">
      
      {/* Header */}
      <header className="bg-red-800 text-white py-4 px-4 shadow-xl sticky top-0 z-40 border-b-4 border-yellow-500">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white text-2xl w-10 h-10 rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-sm">
                   👑
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-wider text-yellow-100">查理國王</h1>
                    <p className="text-red-200 text-xs tracking-widest font-medium">選擇困難症救星</p>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">
        
        {/* Controls Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100 mb-6">
            
            {/* Top Row: Workflow Helpers */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 pb-4 border-b border-gray-100 gap-3">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 whitespace-nowrap mb-2 xl:mb-0">
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">STEP 1</span>
                    想喝什麼種類？
                </h3>
                
                <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                    {/* Favorites Button */}
                    <button 
                        onClick={selectFavoritesMode}
                        className={`flex-grow sm:flex-grow-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 border
                            ${isFavoritesMode
                                ? 'bg-pink-100 text-pink-600 border-pink-200 ring-2 ring-pink-200' 
                                : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-50'}`}
                    >
                        ❤️ 我的最愛 ({favoriteIds.length})
                    </button>

                    {/* All Items Button */}
                    <button 
                        onClick={selectAll}
                        disabled={isAllSelected}
                        className={`flex-grow sm:flex-grow-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1
                            ${isAllSelected 
                                ? 'bg-red-50 text-red-300 cursor-default' 
                                : 'bg-red-600 text-white hover:bg-red-700 shadow-md'}`}
                    >
                        🎲 全品項大亂鬥
                    </button>

                    {/* Reset Button */}
                    <button
                        onClick={resetSelection}
                        disabled={!hasSelection && minPrice === '' && maxPrice === '' && searchQuery === ''}
                        className={`flex-grow sm:flex-grow-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1
                           ${(!hasSelection && minPrice === '' && maxPrice === '' && searchQuery === '')
                              ? 'bg-gray-50 text-gray-300 border-gray-100' 
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-800'}`}
                    >
                       🔄 重設
                    </button>
                </div>
            </div>

            {/* Category Toggles */}
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.values(Category).map(cat => {
                    const isActive = !isFavoritesMode && selectedCategories.includes(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 border-2
                                ${isActive 
                                    ? 'bg-red-50 text-red-800 border-red-200 shadow-sm' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Price Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">💰</span>
                    <span className="text-sm font-bold text-gray-600">預算範圍：</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">$</span>
                        <input 
                            type="number" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="最低價" 
                            className="w-24 pl-6 pr-2 py-2 text-sm text-white bg-gray-700 font-medium border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 placeholder-gray-400"
                        />
                    </div>
                    <span className="text-gray-400 text-xs font-bold">~</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">$</span>
                        <input 
                            type="number" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="最高價" 
                            className="w-24 pl-6 pr-2 py-2 text-sm text-white bg-gray-700 font-medium border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 placeholder-gray-400"
                        />
                    </div>
                    {(minPrice !== '' || maxPrice !== '') && (
                        <button 
                            onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                            className="ml-1 text-xs text-gray-400 hover:text-red-500 underline whitespace-nowrap"
                        >
                            清除
                        </button>
                    )}
                </div>
            </div>

            {/* Step 2: Options (Sugar/Ice) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-gray-100">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">STEP 2</span>
                  <span className="text-sm font-bold text-gray-700">隨機加碼：</span>
               </div>
               
               {/* Sugar Toggle & Limit */}
               <div className="flex items-center gap-2">
                   <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative">
                         <input type="checkbox" checked={randomSugar} onChange={e => setRandomSugar(e.target.checked)} className="sr-only peer" />
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-400"></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">甜度</span>
                   </label>
                   {randomSugar && (
                       <select
                           value={sugarLimit}
                           onChange={(e) => setSugarLimit(e.target.value)}
                           className="text-xs border border-pink-200 rounded px-1 py-1 bg-pink-50/50 text-pink-700 focus:outline-none focus:border-pink-400 animate-fade-in"
                           title="限制最高甜度"
                       >
                           {SUGAR_LEVELS.map(level => (
                               <option key={level} value={level}>最高: {level}</option>
                           ))}
                       </select>
                   )}
               </div>

               {/* Ice Toggle & Limit */}
               <div className="flex items-center gap-2">
                   <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative">
                         <input type="checkbox" checked={randomIce} onChange={e => setRandomIce(e.target.checked)} className="sr-only peer" />
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-400"></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">冰塊</span>
                   </label>
                   {randomIce && (
                       <select
                           value={iceLimit}
                           onChange={(e) => setIceLimit(e.target.value)}
                           className="text-xs border border-blue-200 rounded px-1 py-1 bg-blue-50/50 text-blue-700 focus:outline-none focus:border-blue-400 animate-fade-in"
                           title="限制最高冰塊"
                       >
                           {ICE_LEVELS.map(level => (
                               <option key={level} value={level}>最高: {level}</option>
                           ))}
                       </select>
                   )}
               </div>
            </div>
            
            {/* Prompts */}
            {activeItems.length === 0 && (
                <div className="mt-4 text-center py-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200 animate-pulse">
                    {isFavoritesMode ? (
                        <span>💔 你的最愛清單是空的！請先在下方清單加入飲品。</span>
                    ) : (minPrice !== '' || maxPrice !== '') && hasSelection ? (
                        <span>💸 找不到符合預算 ${minPrice || '0'} ~ ${maxPrice || '∞'} 的飲品，請調整金額。</span>
                    ) : (
                        <span>👆 請至少選擇一個分類，或點擊「全品項大亂鬥」</span>
                    )}
                </div>
            )}
        </div>

        {/* The Wheel */}
        <div className={`transition-all duration-500 rounded-3xl shadow-xl p-1 border-4 relative overflow-hidden
             ${activeItems.length === 0 ? 'bg-gray-100 border-gray-300 grayscale opacity-80' : 'bg-white border-red-800'}`}>
            
            <div className="bg-[#FFFDF9] rounded-[20px] p-4 relative">
                {/* Decorative corners */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${activeItems.length === 0 ? 'border-gray-300' : 'border-red-200'}`}></div>
                <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${activeItems.length === 0 ? 'border-gray-300' : 'border-red-200'}`}></div>
                <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${activeItems.length === 0 ? 'border-gray-300' : 'border-red-200'}`}></div>
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${activeItems.length === 0 ? 'border-gray-300' : 'border-red-200'}`}></div>

                <Wheel 
                    items={activeItems} 
                    onSpinEnd={handleSpinEnd}
                    isSpinning={isSpinning}
                    setIsSpinning={setIsSpinning}
                />
                
                <div className="text-center mt-2 mb-2 min-h-[1.5rem]">
                    <p className={`font-bold ${activeItems.length === 0 ? 'text-gray-400' : 'text-red-900'}`}>
                        {isFavoritesMode 
                            ? `我的最愛選單 (${activeItems.length})` 
                            : (activeItems.length > 0 ? `本次輪盤共有 ${activeItems.length} 種選擇` : '等待選擇中...')}
                    </p>
                </div>
            </div>
        </div>

        {/* Info Card / List Preview */}
        <div className="mt-8 mb-10 text-center">
             <details className="group" open={isFavoritesMode}>
                <summary className="inline-flex items-center cursor-pointer text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium select-none bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <span>
                         {isFavoritesMode ? '編輯我的最愛' : '查看完整清單 / 加入最愛'}
                    </span>
                    <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                
                <div className="mt-4 bg-white rounded-xl shadow-inner border border-gray-100 p-4 text-left animate-fade-in max-h-[500px] overflow-y-auto">
                    
                    {/* Search Bar */}
                    <div className="sticky top-0 bg-white z-10 pb-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="搜尋飲品名稱..." 
                                className="w-full pl-10 pr-8 py-2.5 text-sm text-white bg-gray-700 font-medium border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 placeholder-gray-400"
                            />
                             {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtered List */}
                    {displayItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                             {/* Group by category if showing all, otherwise flat list */}
                             {displayItems.map(item => {
                                 const isFav = favoriteIds.includes(item.id);
                                 const config = favoriteConfigs[item.id] || {};
                                 
                                 return (
                                    <div key={item.id} className={`flex flex-col border p-2 rounded-lg transition-colors ${isFav ? 'bg-pink-50/30 border-pink-100' : 'bg-gray-50/50 border-gray-100 hover:bg-white'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => toggleFavorite(e, item.id)}
                                                    className="text-lg focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                                                >
                                                    {isFav ? '❤️' : '🤍'}
                                                </button>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${isFav ? 'text-pink-900' : 'text-gray-700'}`}>{item.name}</span>
                                                    {!isFavoritesMode && <span className="text-[10px] text-gray-400">{item.category}</span>}
                                                </div>
                                            </div>
                                            <span className="font-mono text-gray-400 text-[10px]">${item.priceL || item.priceM}</span>
                                        </div>

                                        {/* Sugar/Ice Config for Favorites */}
                                        {isFav && (
                                            <div className="ml-8 mt-1 flex gap-2 animate-fade-in">
                                                <select 
                                                    value={config.sugar || ''}
                                                    onChange={(e) => updateFavoriteConfig(item.id, 'sugar', e.target.value)}
                                                    className="bg-white border border-pink-200 text-gray-600 text-[10px] rounded px-1 py-0.5 focus:outline-none focus:border-pink-400 w-20"
                                                >
                                                    <option value="">甜度不限</option>
                                                    {SUGAR_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <select 
                                                    value={config.ice || ''}
                                                    onChange={(e) => updateFavoriteConfig(item.id, 'ice', e.target.value)}
                                                    className="bg-white border border-pink-200 text-gray-600 text-[10px] rounded px-1 py-0.5 focus:outline-none focus:border-pink-400 w-20"
                                                >
                                                    <option value="">冰塊不限</option>
                                                    {ICE_LEVELS.map(i => <option key={i} value={i}>{i}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                 );
                             })}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                             {searchQuery ? '找不到符合的飲品' : '這裡空空如也... 快去加入最愛吧！'}
                        </div>
                    )}
                </div>
             </details>
        </div>

      </main>

      {/* Footer / Store Info */}
      <footer className="mt-8 border-t border-red-100 bg-white py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
            
            {/* Store Info Section */}
            <div className="mb-6 p-6 bg-white rounded-2xl inline-block w-full sm:w-auto border-2 border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-red-50 rounded-full z-0 opacity-50"></div>
                
                <h3 className="relative z-10 text-red-800 font-black text-lg mb-3 flex items-center justify-center gap-2 uppercase tracking-wide">
                   <span>🥤</span> 店家資訊
                </h3>
                
                <p className="relative z-10 text-gray-900 font-black text-2xl mb-3 tracking-tight">查理國王中原新中北店</p>
                
                <div className="relative z-10 flex flex-col gap-2 mb-4 text-left mx-auto max-w-sm text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                        <span className="mt-1 flex-shrink-0">📍</span>
                        <span className="font-medium">320桃園市中壢區新中北路235號1F</span>
                    </div>
                     <div className="flex items-center gap-2 text-gray-600">
                        <span className="flex-shrink-0">📞</span>
                        <span className="font-medium tracking-wider">03 466 3235</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 mt-2 border-t border-dashed border-red-100 pt-2">
                        <span className="mt-0.5 flex-shrink-0">🕒</span>
                        <div className="font-medium text-xs leading-relaxed">
                            <p>週一至週日 11:00–00:00</p>
                        </div>
                    </div>
                </div>

                <a 
                    href="https://www.google.com/maps/search/?api=1&query=查理國王中原新中北店" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm font-bold"
                >
                    <span>🗺️</span> 
                    <span>開啟 Google Maps 導航</span>
                </a>
            </div>

            {/* Credits */}
            <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                <p>網頁製作：EdwardWu</p>
                <a 
                    href="https://github.com/bluehomewu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-gray-600 transition-colors flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"
                >
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-gray-500">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub: @bluehomewu
                </a>
            </div>
        </div>
      </footer>

      <ResultModal 
        spinResult={spinResult} 
        isOpen={showModal} 
        onClose={handleReset} 
      />

    </div>
  );
};

export default App;