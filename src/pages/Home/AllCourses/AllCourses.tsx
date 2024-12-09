'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, X, Play, ShoppingCart } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Coursecatagory2 from "../Coursecatagory2/Coursecatagory2"
import CourseInstructor from "../Courseinstructor/CourseInstructor"
import CoursePlan from "../CoursePlan/CoursePlan"
import CourseDetails from "../CourseDetails/CourseDetails"
import CourseFeatures from "../CourseFeature/CourseFeature"
import useModalStore from "@/store/Store"
import { useTranslation } from "react-i18next"

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
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {courses.map((lesson, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
              <Card className="border-0 shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
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
                  <div className="p-4 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${lesson.color}`} />
                      <span className="text-sm text-slate-600">{lesson.type}</span>
                    </div>
                    <h4 className="font-medium text-start text-slate-900">{lesson.number} - {lesson.title}</h4>
                    <div className="flex justify-between gap-4">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => onSelect(lesson)}>
                        Show
                      </Button>
                      <Button 
                      // onClick={() => {


                      //   addToCart(product);
                      //   toggleClicked()
                      // }} 
                      className="w-full bg-gray-400 hover:bg-green-600 text-white" onClick={() => onAddToCart(lesson)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
        <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
      </Carousel>
    </div>
  )
}


export default function AllCourses() {

  // const { changeCheckoutModal, toggleClicked } = useModalStore();
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"instructor" | "structure" | "details" | "feature">("instructor")
  const [cart, setCart] = React.useState<Lesson[]>([])
  const [isCartModalOpen, setIsCartModalOpen] = React.useState(false)
  const [t] = useTranslation("global");
  const lessons: Lesson[] = [
    {
      id: "1",
      type: t("type.1"),
      number: "2.1",
      title: t("title.2"),
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-purple-500",
      badge: t("badge.HSC"),
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Dr. Rahim Khan",
      rating: 4.8,
      studentsEnrolled: 1500,
      duration: "8 weeks",
      level: "Intermediate",
      category: "Mathematics",
    },
    {
      id: "2",
      type: t("type.2"),
      number: "8.1",
      title: t("title.3"),
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.JSC"),
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    {
      id: "3",
      type: t("type.5"),
      number: "8.1",
      title: t("title.1"),
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.SSC"),
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    {
      id: "4",
      type: t("type.4"),
      number: "8.1",
      title: t("title.2"),
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.PSC"),
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    // Add more lessons here...
  ];

  // const addToCart = (product: Product) => {
  //   const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  //   const updatedCart = [...existingCart, {
  //     ...product,
  //     quantity: 1
  //   }];
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  // };
  const handleCourseSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLesson(null)
  }

  const addToCart = (lesson: Lesson) => {
    setCart((prevCart) => [...prevCart, lesson])
    setIsCartModalOpen(true)
  }

  const closeCartModal = () => {
    setIsCartModalOpen(false)
  }

  return (
    <>
      <Coursecatagory2 />
      <div className="sm:w-full md:max-w-[1040px] w-[385px] mt-8 mb-4">
        <div className="space-y-12">
          <CourseCarousel
            courses={lessons.slice(0, 4)}
            title="Popular Courses"
            onSelect={handleCourseSelect}
            onAddToCart={addToCart}
          />
          <CourseCarousel
            courses={lessons}
            title="All Courses"
            onSelect={handleCourseSelect}
            onAddToCart={addToCart}
          />
        </div>

        {isModalOpen && selectedLesson && (
          <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedLesson.title}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[80vh]">
                <div
                  className="relative w-full bg-cover bg-center text-white"
                  style={{ backgroundImage: `url(${selectedLesson.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-60"></div>
                  <div className="relative z-10 h-full max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="space-y-6 text-start">
                      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {selectedLesson.title}
                      </h1>
                      <p className="text-xl">
                        Taught by <span className="font-semibold">{selectedLesson.instructor}</span>
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="ml-1 font-medium">{selectedLesson.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-5 h-5" />
                          <span className="ml-1">
                            {selectedLesson.studentsEnrolled.toLocaleString()} students
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedLesson.duration}
                        </Badge>
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                          {selectedLesson.level}
                        </Badge>
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                          {selectedLesson.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-4 bg-gray-200 p-1 rounded-md shadow">
                      {["instructor", "structure", "details", "feature"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab as any)}
                          aria-selected={selectedTab === tab}
                          className={`px-2 py-1 rounded-md transition-all duration-300 ${selectedTab === tab
                            ? "bg-primary-default text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    {selectedTab === "instructor" && <CourseInstructor />}
                    {selectedTab === "structure" && <CoursePlan />}
                    {selectedTab === "details" && <CourseDetails />}
                    {selectedTab === "feature" && <CourseFeatures />}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
{/* 
        <Dialog open={isCartModalOpen} onOpenChange={closeCartModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{item.title}</span>
                  <Badge>{item.badge}</Badge>
                </div>
              ))}
            </div>
            <Button onClick={closeCartModal} className="mt-4">Close</Button>
          </DialogContent>
        </Dialog> */}
      </div>
    </>
  )
}

