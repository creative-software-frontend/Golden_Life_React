'use client'; // Ensure this is at the top if you're using React Server Components

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllCourses() {
  const lessons = {
    hsc: [
      {
        type: "HSC উচ্চতর গণিত ১ম পত্র",
        number: "2.1",
        title: "ভেক্টরের পরিচয় ও প্রকারভেদ",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-purple-500",
        badge: "HSC",
      },
      {
        type: "HSC জীববিজ্ঞান ২য় পত্র",
        number: "2.8",
        title: "ঘাস ফড়িং এর মুখোপাঙ্গ, বক্ষ...",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-emerald-500",
        badge: "HSC",
      },
    ],
    ssc: [
      {
        type: "SSC পদার্থবিজ্ঞান",
        number: "8.1",
        title: "আলোর প্রকৃতি",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-blue-500",
        badge: "SSC",
      },
      {
        type: "SSC রসায়ন",
        number: "1.1",
        title: "জীবাশ্ম জ্বালানি",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-sky-500",
        badge: "SSC",
      },
    ],
  };

  const allCourses = [...lessons.hsc, ...lessons.ssc];

  return (
    <div className="w-full md:max-w-[1040px] mt-8 mb-4 bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      {/* Tabs Integration */}
      <Tabs defaultValue="all">
        <TabsList className="flex justify-center gap-4 mb-4">
          <TabsTrigger value="all">All Courses</TabsTrigger> {/* New "All Courses" Tab */}
          <TabsTrigger value="hsc">HSC Courses</TabsTrigger>
          <TabsTrigger value="ssc">SSC Courses</TabsTrigger>
          
        </TabsList>

        {/* HSC Courses */}
        <TabsContent value="hsc">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {lessons.hsc.map((lesson, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/1] bg-teal-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" className="h-16 w-16 rounded-full bg-white/90 hover:bg-white shadow-lg">
                            <Play className="h-8 w-8 text-slate-600 ml-1" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white rounded-md px-2 py-1 text-xs">
                          {lesson.badge}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${lesson.color}`} />
                          <span className="text-sm text-slate-600">{lesson.type}</span>
                        </div>
                        <h3 className="font-medium text-start text-slate-900">{lesson.number} - {lesson.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
          </Carousel>
        </TabsContent>

        {/* SSC Courses */}
        <TabsContent value="ssc">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {lessons.ssc.map((lesson, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/1] bg-teal-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" className="h-16 w-16 rounded-full bg-white/90 hover:bg-white shadow-lg">
                            <Play className="h-8 w-8 text-slate-600 ml-1" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white rounded-md px-2 py-1 text-xs">
                          {lesson.badge}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${lesson.color}`} />
                          <span className="text-sm text-slate-600">{lesson.type}</span>
                        </div>
                        <h3 className="font-medium text-start text-slate-900">{lesson.number} - {lesson.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
          </Carousel>
        </TabsContent>

        {/* All Courses */}
        <TabsContent value="all">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {allCourses.map((lesson, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/1] bg-teal-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" className="h-16 w-16 rounded-full bg-white/90 hover:bg-white shadow-lg">
                            <Play className="h-8 w-8 text-slate-600 ml-1" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white rounded-md px-2 py-1 text-xs">
                          {lesson.badge}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${lesson.color}`} />
                          <span className="text-sm text-slate-600">{lesson.type}</span>
                        </div>
                        <h3 className="font-medium text-start text-slate-900">{lesson.number} - {lesson.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
          </Carousel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
