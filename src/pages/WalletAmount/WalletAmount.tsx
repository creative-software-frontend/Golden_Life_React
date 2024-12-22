import React, { useState } from "react";
import { Wallet } from 'lucide-react';

const WalletAmount: React.FC = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(10);

    const handleButtonClick = (amount: number) => {
        setSelectedAmount(amount);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-2 justify-center">
                {[10, 20, 50].map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleButtonClick(amount)}
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 transition-all duration-300 ${selectedAmount === amount
                            ? "bg-primary text-white border-primary shadow-md scale-95"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                            }`}
                    >
                        <Wallet className="w-6 h-6 mb-1" />
                        <span className="text-sm font-bold">${amount}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WalletAmount;
