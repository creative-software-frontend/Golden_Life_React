import React, { useState } from "react";

const WalletButtons: React.FC = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(10);

    const handleButtonClick = (amount: number) => {
        setSelectedAmount(amount);
    };

    return (
        <div className="flex gap-4 justify-center mt-4 mx-4">
            {[10, 20, 50].map((amount) => (
                <button
                    key={amount}
                    onClick={() => handleButtonClick(amount)}
                    className={`w-24 h-10 flex items-center justify-center text-lg font-bold rounded-md border-2 transition-all duration-300 ${selectedAmount === amount
                        ? "bg-primary-default text-white border-primary-default shadow-md scale-105"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                        }`}
                >
                    ${amount}
                </button>
            ))}
        </div>
    );
};

export default WalletButtons;
