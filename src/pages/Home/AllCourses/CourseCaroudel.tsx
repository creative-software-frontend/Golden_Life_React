import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, Star, User, Clock, BarChart } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useTranslation } from "react-i18next"
import Autoplay from "embla-carousel-autoplay" // 1. Import Autoplay

interface Lesson {
    id: string
    type: string
    number: string
    title: string
    thumbnail: string
    color: string
    badge: string
    image: string
    instructor: string
    rating: number
    studentsEnrolled: number
    duration: string
    level: string
    category: string
}

const CourseCarousel: React.FC<{
    courses: Lesson[],
    title: string,
    onSelect: (lesson: Lesson) => void,
    onAddToCart: (lesson: Lesson) => void
}> = ({ courses, title, onSelect, onAddToCart }) => {
    const [t] = useTranslation("global")

    // 2. Configure Autoplay Plugin
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    return (
        <section className="w-full py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                        {title}
                    </h3>
                </div>

                {/* Carousel Container */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]} // 3. Add Plugin
                    onMouseEnter={plugin.current.stop} // Pause on hover
                    onMouseLeave={plugin.current.reset} // Resume on leave
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 pb-4">
                        {courses.map((lesson, index) => (
                            <CarouselItem 
                                key={index} 
                                // 4. RESPONSIVE LOGIC:
                                // Mobile: 85% (1 card + peek)
                                // Tablet: 50% (2 cards)
                                // Desktop: 33% (3 cards)
                                className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="h-full">
                                    <Card className="h-full border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group flex flex-col bg-white">
                                        
                                        {/* Image Section */}
                                        <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(lesson)}>
                                            <div 
                                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${lesson.image})` }} 
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                            
                                            <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm border-0 font-semibold px-2.5">
                                                {lesson.badge}
                                            </Badge>

                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                                                <div className="bg-white/90 p-3 rounded-full shadow-lg text-green-600">
                                                    <Play className="h-6 w-6 fill-current ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <CardContent className="p-5 flex-1 flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${lesson.color}`} />
                                                    <span>{lesson.type}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span className="text-slate-700">{lesson.rating}</span>
                                                </div>
                                            </div>

                                            <h4 
                                                className="font-bold text-lg leading-snug text-slate-900 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors"
                                                onClick={() => onSelect(lesson)}
                                                title={lesson.title}
                                            >
                                                <span className="text-slate-400 font-normal mr-1">#{lesson.number}</span>
                                                {lesson.title}
                                            </h4>

                                            {/* Pushes footer to bottom */}
                                            <div className="mt-auto pt-2 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="line-clamp-1">{lesson.instructor}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {lesson.duration}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BarChart className="w-3.5 h-3.5" />
                                                        {lesson.level}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Actions Footer */}
                                        <CardFooter className="p-5 pt-0 grid grid-cols-6 gap-3">
                                            <Button 
                                                className="col-span-5 w-full bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all font-semibold" 
                                                onClick={() => onSelect(lesson)}
                                            >
                                                {t("buttons.show")}
                                            </Button>
                                            
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="col-span-1 w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onAddToCart(lesson);
                                                }}
                                                aria-label={t("buttons.addToCart")}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    
                    {/* 5. Navigation Buttons: HIDDEN on Mobile, Visible on Tablet/Desktop */}
                    <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 h-12 w-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-md transition-transform hover:scale-110" />
                    <CarouselNext className="hidden md:flex -right-4 lg:-right-12 h-12 w-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-md transition-transform hover:scale-110" />
                </Carousel>
            </div>
        </section>
    )
}

export default CourseCarousel
