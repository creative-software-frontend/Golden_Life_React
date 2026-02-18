'use client'

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { ShoppingCart } from 'lucide-react'

interface Course {
    id: string
    title: string
    instructor: string
    price: string
    promoCode: string
    image: string
}

export default function FeaturedCourse() {
    const { t } = useTranslation('global')

    const courses: Course[] = [
        { id: '1', title: t("course.fb"), instructor: t("name.sakib"), price: '1,690', promoCode: 'SE1690', image: '/image/featiredcourse/f4.jpg' },
        { id: '2', title: t("course.yt"), instructor: t("name.ayman"), price: '3,850', promoCode: 'IELTS3850', image: '/image/featiredcourse/f3.jpg' },
        { id: '3', title: t("course.seo"), instructor: t("name.shahid"), price: '1,690', promoCode: 'EMKF1690', image: '/image/featiredcourse/f2.jpg' },
        { id: '4', title: t("course.smm"), instructor: t("name.ayman"), price: '890', promoCode: 'FBM890', image: '/image/featiredcourse/f1.jpg' },
    ]

    return (
        <section className="w-full py-12 bg-gray-50/50">
            {/* Width decreased to max-w-6xl to match consistent narrower design */}
            <div className="mx-auto px-4 max-w-4xl">
                
                {/* Header - Aligned and compact */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {t("course.h") || "Featured Courses"}
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
                        {t("course.p") || "Explore our top-rated courses designed for your career success."}
                    </p>
                </div>

                {/* Grid Layout - Responsive 1, 2, or 4 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 rounded-xl overflow-hidden group bg-white flex flex-col h-full hover:-translate-y-1">
    
    {/* Image Section */}
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    {/* Content Section */}
    {/* Reduced padding from p-4 to p-3 */}
    <CardContent className="p-3 flex-1 flex flex-col">
        {/* Shrunk title from text-base to text-sm */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors cursor-pointer mb-0.5">
            {course.title}
        </h3>
        {/* Shrunk instructor text from text-xs to text-[11px] */}
        <p className="text-gray-400 text-[11px] font-medium mb-3">
            by {course.instructor}
        </p>

        {/* Price & Promo - More compact */}
        <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
            <div>
                {/* Shrunk label to 8px */}
                <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Price</p>
                {/* Shrunk price from text-lg to text-[15px] */}
                <p className="text-[15px] font-black text-slate-900 leading-none">৳{course.price}</p>
            </div>
            <div className="text-right">
                {/* Shrunk label to 8px */}
                <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Promo</p>
                {/* Shrunk promo code font to 9px */}
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-100 leading-none">
                    {course.promoCode}
                </span>
            </div>
        </div>
    </CardContent>

    {/* Actions Footer */}
    {/* Reduced padding to match Content */}
    <CardFooter className="p-3 pt-0 grid grid-cols-5 gap-1.5">
        {/* Reduced button height to h-8, font to text-[11px], and rounding to rounded-lg */}
        <Button className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 rounded-lg shadow-sm transition-all active:scale-95 tracking-wide">
            {t("buttons.show") || "View Details"}
        </Button>
        <Button variant="outline" size="icon" className="col-span-1 border-emerald-100 text-emerald-600 hover:bg-emerald-50 h-8 rounded-lg shadow-sm">
            {/* Reduced icon size */}
            <ShoppingCart className="w-3.5 h-3.5" />
        </Button>
    </CardFooter>
</Card>
                    ))}
                </div>
            </div>
        </section>
    )
}