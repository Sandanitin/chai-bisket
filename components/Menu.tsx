import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Clock as ClockIcon } from 'lucide-react';

// Menu items with categories and time availability
const menuItems = [
  {
    id: 1,
    name: 'Masala Chai',
    price: 3.49,
    description: 'Slow-brewed, aromatic, soul-warming.',
    image: '/images/iran chaai.png',
    category: 'Beverages',
    availableTime: ['breakfast', 'lunch', 'dinner']
  },
  {
    id: 2,
    name: 'Osmania Biscuits',
    price: 4.99,
    description: 'Crisp, buttery, perfect with chai.',
    image: '/images/osimania biskets.png',
    category: 'Snacks',
    availableTime: ['breakfast', 'tea']
  },
  {
    id: 3,
    name: 'Hyderabadi Biryani',
    price: 14.99,
    description: 'Long-grain basmati, rich masala, royal aroma.',
    image: '/images/Hyderabadi Biryani.jpg',
    category: 'Main Course',
    availableTime: ['lunch', 'dinner']
  },
  {
    id: 4,
    name: 'Bun Maska',
    price: 5.99,
    description: 'Pillow-soft bun, lashings of butter.',
    image: '/images/Bun Maska.jpg',
    category: 'Snacks',
    availableTime: ['breakfast', 'tea']
  },
  {
    id: 5,
    name: 'Vada Pav',
    price: 6.99,
    description: 'Mumbai\'s favorite — fiery & fun.',
    image: '/images/Vada Pav.jpg',
    category: 'Street Food',
    availableTime: ['lunch', 'dinner']
  },
  {
    id: 6,
    name: 'Chicken 65',
    price: 12.99,
    description: 'Crispy, tangy, dangerously addictive.',
    image: '/images/Chicken 65.jpg',
    category: 'Appetizers',
    availableTime: ['lunch', 'dinner']
  }
];

// Menu timings
const menuTimings = [
  {
    id: 'breakfast',
    name: 'BREAKFAST MENU',
    time: '8:00 AM - 11:30 AM',
    active: false
  },
  {
    id: 'lunch',
    name: 'LUNCH MENU',
    time: '11:00 AM - 4:00 PM',
    active: false
  },
  {
    id: 'tea',
    name: 'TEA TIME',
    time: '3:00 PM - 6:30 PM',
    active: false
  },
  {
    id: 'dinner',
    name: 'DINNER MENU',
    time: '6:30 PM - 10:30 PM',
    active: false
  }
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMenu, setActiveMenu] = useState('breakfast');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set up client-side only code
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Determine current menu based on time
  useEffect(() => {
    if (!currentTime) return;
    
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Define menu time ranges in minutes since midnight
    const menuRanges = [
      { id: 'breakfast', start: 8 * 60, end: 11.5 * 60 },
      { id: 'lunch', start: 11 * 60, end: 16 * 60 },
      { id: 'tea', start: 15 * 60, end: 18.5 * 60 },
      { id: 'dinner', start: 18.5 * 60, end: 22.5 * 60 }
    ];

    const currentMenu = menuRanges.find(
      menu => totalMinutes >= menu.start && totalMinutes < menu.end
    );

    if (currentMenu) {
      setActiveMenu(currentMenu.id);
    }
  }, [currentTime]);

  // Get unique categories for the active menu
  const categories = ['All', ...new Set(
    menuItems
      .filter(item => item.availableTime.includes(activeMenu))
      .map(item => item.category)
  )];

  if (!isClient) {
    return (
      <section id="menu" className="py-16 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
              <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
              <div className="h-1 w-20 bg-gray-200 rounded mx-auto mb-12"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter items by active category and menu time
  const filteredItems = (activeCategory === 'All' 
    ? menuItems.filter(item => item.availableTime.includes(activeMenu))
    : menuItems.filter(item => 
        item.category === activeCategory && 
        item.availableTime.includes(activeMenu)
      )
  );

  const addToCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: itemId, quantity: 1 }];
    });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [start, end] = timeString.split(' - ');
    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="font-medium">{start}</span> - {end}
      </div>
    );
  };

  return (
    <section id="menu" className="py-16 bg-white/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-rose-600 text-sm font-semibold tracking-wider uppercase mb-2">
            <ClockIcon className="h-4 w-4 mr-1" />
            {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Menu</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-amber-500 mx-auto mb-8"></div>
          
          {/* Menu Time Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {menuTimings.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  activeMenu === menu.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-100'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="font-medium text-sm">{menu.name}</div>
                <div className="text-xs mt-1">
                  {menu.time.split(' - ')[0]} - {menu.time.split(' - ')[1]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-100'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-rose-50 flex flex-col md:flex-row h-48"
              >
                <div className="relative w-full md:w-2/5 h-48 md:h-auto">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-rose-600 whitespace-nowrap ml-4">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.availableTime.map(time => (
                      <span 
                        key={time} 
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          time === activeMenu 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                  </div>
                  <Button 
                    onClick={() => addToCart(item.id)}
                    className="mt-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No items available in this category for the selected time.</p>
            <Button 
              onClick={() => setActiveCategory('All')}
              variant="ghost"
              className="mt-4 text-rose-600 hover:bg-rose-50"
            >
              View all items
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <Button
            variant="outline"
            className="group border-2 border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-8 py-5 text-base font-medium rounded-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5 group-hover:animate-bounce" />
            View Cart & Checkout
            {getCartCount() > 0 && (
              <span className="ml-2 bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
              </span>
            )}
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Menu items availability may vary by time of day.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
