'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface Course {
    id: string
    title: string
    instructor: string
    price: string
    promoCode: string
    image: string
}

const courses: Course[] = [
    {
        id: '1',
        title: 'স্পোকেন ইংলিশ',
        instructor: 'Sarah Rahman',
        price: '১,৬৯০',
        promoCode: 'SE1690',
        image: '/placeholder.svg?height=400&width=300',
    },
    {
        id: '2',
        title: 'IELTS',
        instructor: 'Munzereen Shahid',
        price: '৩,৮৫০',
        promoCode: 'IELTS3850',
        image: '/placeholder.svg?height=400&width=300',
    },
    {
        id: '3',
        title: 'ইমেইল মার্কেটিং',
        instructor: 'Faria Ahmed',
        price: '১,৬৯০',
        promoCode: 'EMKF1690',
        image: '/placeholder.svg?height=400&width=300',
    },
    {
        id: '4',
        title: 'ফেসবুক মার্কেটিং',
        instructor: 'Ayman Sadiq & Sadman Sadiq',
        price: '৮৯০',
        promoCode: 'FBM890',
        image: '/placeholder.svg?height=400&width=300',
    },
    {
        id: '5',
        title: 'গ্রাফিক ডিজাইন',
        instructor: 'Rafiq Islam',
        price: '১,৯৫০',
        promoCode: 'GDF1950',
        image: '/placeholder.svg?height=400&width=300',
    },
    {
        id: '6',
        title: 'ইউটিউব মার্কেটিং',
        instructor: 'Karim Hassan',
        price: '১,৯৫০',
        promoCode: 'YT1950',
        image: '/placeholder.svg?height=400&width=300',
    },
]

export default function Component() {
    return (
        <div className="w-full bg-black min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-white mb-4">
                    স্কিল ডেভেলপমেন্টের নির্দিষ্ট কোর্সে দারুণ ছাড়!
                </h1>
                <p className="text-gray-300 mb-8">
                    পুরো মাস জুড়ে চেন মিনিট স্কুলের নির্দিষ্ট কোর্সসমূহ পেয়ে যান বিশেষ মূল্যে। এবার শেখার শুরু হোক চেন মিনিট স্কুলের সাথে!
                </p>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {courses.map((course) => (
                            <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <Card className="bg-gradient-to-br from-gray-900 to-black border-0">
                                    <CardContent className="p-0 relative">
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover rounded-t-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                                                <p className="text-gray-300 text-sm">{course.instructor}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="text-white">
                                                    <span className="text-sm">মূল্য</span>
                                                    <div className="text-2xl font-bold">৳{course.price}</div>
                                                </div>
                                                <div className="bg-white/10 rounded px-3 py-1">
                                                    <span className="text-white text-sm">PROMO CODE</span>
                                                    <div className="text-green-400 font-mono font-bold">{course.promoCode}</div>
                                                </div>
                                            </div>
                                            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                                                কোর্সে ভর্তি হন
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-0" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-0" />
                </Carousel>
            </div>
        </div>
    )
}