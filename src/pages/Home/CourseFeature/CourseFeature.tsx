import { Check } from 'lucide-react'

export default function CourseFeature() {
    const features = [
        "সাধারণত ইংরেজি শিখতে প্রয়োজনীয় প্রাথমিক সকল বিষয় ও ধারণা",
        "প্রতিটি গ্রামারের নিয়ম নিয়ে শেষে মূল্যায়ন প্রশ্নের মাধ্যমে করার সুযোগ",
        "বিভিন্ন পরীক্ষাগুলোর কথা বলে ইংরেজি গ্রামার দিয়ে রাখা উদ্যোগ",
        "একই গ্রামারের বিভিন্ন কথা বলার উদাহরণ ও ধারণা",
        "স্কুল-কলেজ ও ইউনিভার্সিটির সিলেবাস অনুযায়ী প্রাথমিক English Grammar-এর নিয়ম ও উদাহরণ",
        "চলতি ভাষায় English Grammar-এর সহজ থেকে কঠিন বিষয়গুলো আত্মস্থ ও প্রয়োগ করা"
    ]

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Course Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <div className="mt-1">
                            <Check className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-sm">{feature}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
