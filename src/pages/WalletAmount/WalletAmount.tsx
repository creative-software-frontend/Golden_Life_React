// 'use client'

// import React, { useState } from "react";
// import { Wallet, CreditCard, Banknote } from 'lucide-react';

// const WalletAmount: React.FC = () => {
//     const [selectedOption, setSelectedOption] = useState<string | null>("E-Wallet");

//     const options = [
//         { name: "Boucher", amount: 103040, icon: Wallet },
//         { name: "Earning", amount: 203454, icon: CreditCard },
//         { name: "Recharge", amount: 502356, icon: Banknote },
//     ];

//     const handleButtonClick = (name: string) => {
//         setSelectedOption(name);
//     };

//     return (
//         <div className="flex flex-col items-center">
//             <div className="flex gap-4 justify-center">
//                 {options.map(({ name, amount, icon: Icon }) => (
//                     <button
//                         key={name}
//                         onClick={() => handleButtonClick(name)}
//                         className={`flex flex-col items-center justify-center w-52 h-24 rounded-lg border-2 transition-all duration-300 ${selectedOption === name
//                             ? "bg-primary text-white border-primary shadow-md scale-95"
//                             : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
//                             }`}
//                     >
//                         {/* <Icon className="w-6 h-6 mb-1" /> */}
//                         <span className="text-lg">{name}</span>
//                         <span className="text-xl font-bold">${amount.toLocaleString()}</span>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default WalletAmount;

