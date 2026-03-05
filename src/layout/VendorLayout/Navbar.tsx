import React, { useState } from 'react';
// Added 'Store' to the imports here!
import { Search, Bell, MapPin, User, ChevronDown, ArrowLeft, Store } from 'lucide-react';

// --- CUSTOM ICONS ---
const MenuFoldLeftIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="9 7 4 12 9 17" />
    </svg>
);

const MenuFoldRightIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="15 7 20 12 15 17" />
    </svg>
);

const Navbar: React.FC<{ toggleSidebar: () => void; isOpen: boolean }> = ({ toggleSidebar, isOpen }) => {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="h-16 sm:h-20 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-300 relative">
            
            {/* --- TABLET/MOBILE SEARCH OVERLAY --- */}
            {isMobileSearchOpen && (
                <div className={`absolute inset-0 bg-background z-50 flex items-center px-4 ${isOpen ? 'xl:hidden' : 'lg:hidden'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                    <button 
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="p-2 mr-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors"
                        aria-label="Close search"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
                        <Search size={20} className="text-muted-foreground flex-shrink-0" />
                        <input 
                            type="text" 
                            autoFocus 
                            placeholder="Search parcels, orders..." 
                            className="bg-transparent border-none focus:ring-0 text-sm md:text-base text-foreground ml-3 w-full placeholder:text-muted-foreground outline-none"
                        />
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                
                {/* --- DYNAMIC MENU TOGGLE --- */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSidebar();
                    }} 
                    aria-label="Toggle Sidebar"
                    className="relative z-40 p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    {isOpen ? <MenuFoldLeftIcon size={24} /> : <MenuFoldRightIcon size={24} />}
                </button>
                
                {/* --- BRAND TITLE & ICON --- */}
                <div className="hidden sm:flex items-center gap-2.5">
                    {/* The Icon Container */}
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary shadow-sm">
                        <Store size={18} strokeWidth={2.5} />
                    </div>
                    {/* The Text */}
                    <h1 className="text-lg md:text-xl font-bold text-foreground truncate tracking-tight">
                        Golden Life
                    </h1>
                </div>
                
                {/* --- DESKTOP INLINE SEARCH BAR --- */}
                <div className={`ml-4 xl:ml-8 hidden ${isOpen ? 'xl:flex' : 'lg:flex'} flex-1 items-center bg-muted/50 border border-border rounded-lg px-4 py-2 w-full max-w-2xl focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm`}>
                    <Search size={20} className="text-muted-foreground flex-shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search parcels, orders, customers..." 
                        className="bg-transparent border-none focus:ring-0 text-base text-foreground ml-3 w-full placeholder:text-muted-foreground outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-1 xl:gap-6 ml-4 flex-shrink-0">
                
                {/* --- CLICKABLE SEARCH ICON --- */}
                <button 
                    onClick={() => setIsMobileSearchOpen(true)}
                    className={`${isOpen ? 'xl:hidden' : 'lg:hidden'} p-2  text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors`}
                >
                    <Search size={20} />
                </button>

                {/* Location */}
                <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground text-sm xl:text-base cursor-pointer hover:text-foreground transition-colors">
                    <MapPin size={18} />
                    <span>Dhaka</span>
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors flex-shrink-0">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-destructive rounded-full border-2 border-background"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-5 border-l border-border cursor-pointer group flex-shrink-0">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm xl:text-base font-bold text-foreground leading-none">Farhana Jaman</p>
                        <p className="text-xs xl:text-sm text-secondary font-medium mt-1 sm:mt-1.5">Available</p>
                    </div>
                    <div className="bg-primary/10 p-2 sm:p-2.5 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                        <User className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <ChevronDown size={16} className="sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors hidden xs:block" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;