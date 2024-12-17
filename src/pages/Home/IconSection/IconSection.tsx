import { Facebook, Send, Video, MessageCircle, DollarSign } from 'lucide-react'

export default function IconSectio() {
    return (
        <div className="flex justify-center gap-8 p-2">
            {/* Facebook Button */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#E7F3FF] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Facebook className="w-8 h-8 text-white" />
                    </div>
                </div>
                <span className="mt-2 text-sm text-nowrap">গ্রুপে যুক্ত হোন</span>
            </div>

            {/* Telegram Button */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#E5F7FF] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Send className="w-8 h-8 text-white" />
                    </div>
                </div>
                <span className="mt-2 text-sm text-nowrap">গ্রুপে যুক্ত হোন</span>
            </div>

            {/* Video Button */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#FFEDED] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                </div>
                <span className="mt-2 text-sm text-nowrap">ভিডিও দেখুন</span>
            </div>

            {/* Chat Button */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#FFF5E5] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FF9500] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                </div>
                <span className="mt-2 text-sm text-nowrap">প্রশ্ন এবং উত্তর</span>
            </div>

            {/* Payment Button */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#FFF8E5] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                </div>
                <span className="mt-2 text-sm text-nowrap">ইনকাম করুন</span>
            </div>
        </div>
    )
}

