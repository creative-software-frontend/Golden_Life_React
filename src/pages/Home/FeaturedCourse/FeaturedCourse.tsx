'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useTranslation } from "react-i18next"

interface Course {
    id: string
    title: string
    instructor: string
    price: string
    promoCode: string
    image: string
}

export default function FeaturedCourse() {
    const { t } = useTranslation('global') // Moved this to the top

    const courses: Course[] = [
        {
            id: '1',
            title: t("course.fb"), // Now t is available here
            instructor: t("name.sakib"),
            price: '1,690',
            promoCode: 'SE1690',
            image: '../../../../public/image/featiredcourse/f4.jpg',
        },
        {
            id: '2',
            title: t("course.yt"), // Now t is available here
            instructor: t("name.ayman"),
            price: '3,850',
            promoCode: 'IELTS3850',
            image: '../../../../public/image/featiredcourse/f3.jpg',
        },
        {
            id: '3',
            title: t("course.seo"), // Now t is available here
            instructor: t("name.shahid"),
            price: '1,690',
            promoCode: 'EMKF1690',
            image: '../../../../public/image/featiredcourse/f2.jpg',
        },
        {
            id: '4',
            title: t("course.smm"), // Now t is available here
            instructor: t("name.ayman"),
            price: '890',
            promoCode: 'FBM890',
            image: '../../../../public/image/featiredcourse/f1.jpg',
        },
    ]

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <div className="md:max-w-[1040px] w-[370px] sm:w-full min-h-[400px] py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-black mb-4">
                    {t("course.h")}
                </h1>
                <p className="text-black mb-8">
                    {t("course.p")}
                </p>

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {courses.map((course) => (
                                <div key={course.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
                                    <Card className="border-0 shadow mb-4">
                                        <CardContent className="p-0 relative">
                                            <div className="relative pb-[30%]">
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-[500px] h-[170px] object-cover rounded-t-lg" />
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-xl font-bold text-black mb-2">{course.title}</h3>
                                                    <p className="text-gray-600 text-sm">{course.instructor}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-black">
                                                        <span className="text-sm">{t("sections.price")}</span>
                                                        <div className="text-2xl font-bold">৳{course.price}</div>
                                                    </div>
                                                    <div className="rounded px-3 py-1">
                                                        <span className="text-white text-sm">PROMO CODE</span>
                                                        <div className="text-green-400 font-mono font-bold">{course.promoCode}</div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                                                        {t("buttons.show")}
                                                    </Button>
                                                    <Button className="w-full bg-gray-400 hover:bg-green-600 text-white">
                                                        {t("buttons.enroll")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={scrollPrev}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white hover:bg-white/20 text-white border-0"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6 text-black" />
                    </Button>
                    <Button
                        onClick={scrollNext}
                        className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white hover:bg-white/20 text-white border-0"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6 text-black" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
