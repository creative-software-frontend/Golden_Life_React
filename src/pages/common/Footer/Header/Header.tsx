import React, { useState } from 'react';

const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string>('home');
    const [language, setLanguage] = useState<string>('English');

    const menus = [
        { id: 'home', label: 'Home', round: true },
        { id: 'grocery', label: 'Grocery', round: true },
        { id: 'pharmacy', label: 'Pharmacy' },
        { id: 'fashion', label: 'Fashion' },
        { id: 'electronics', label: 'Electronics' },
        { id: 'beauty', label: 'Beauty' },
    ];

    return (

        <div className=''>
            <header className=" mx-4 max-w-screen-2xl -mt-7 flex items-center justify-between bg-gray-100 p-2  -ms-28 " >
                {/* Left Side - Menu Buttons */}
                <div className="flex items-center gap-2">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            className={`px-2 py-2 border border-primary-default ${menu.round ? 'rounded-full' : 'rounded' // Apply rounded-full for round buttons
                                } ${activeMenu === menu.id
                                    ? 'bg-primary-default text-white border-primary-default' // Active menu style
                                    : 'bg-white text-gray-500'
                                }`}
                            onClick={() => setActiveMenu(menu.id)}
                        >
                            {menu.label}
                        </button>
                    ))}
                </div>

                {/* Center - Hotline */}
                <div className="flex items-center text-base font-semibold text-red-400">
                    Hotline: +1-800-555-1234
                </div>

                {/* Right Side - Login and Language Buttons */}
                <div className="flex items-center gap-2 mx-2">
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 border border-gray-400 rounded">
                        Login
                    </button>

                    {/* Language Selector */}
                    <select
                        className="bg-gray-200 text-gray-700 px-2 py-1 border border-gray-400 rounded"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="English">English</option>
                        <option value="Bangla">Bangla</option>
                    </select>
                </div>
            </header>
        </div>
    );
};

export default Header;
