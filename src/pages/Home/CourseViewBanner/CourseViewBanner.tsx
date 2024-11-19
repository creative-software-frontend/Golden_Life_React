import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ensure the correct path to Badge
import { Star, Clock, Users, PlayCircle } from 'lucide-react';

interface CourseBannerProps {
    title: string;
    instructor: string;
    rating: number;
    studentsEnrolled: number;
    duration: string;
    level: string;
    category: string;
    backgroundImage?: string;
}

export default function CourseViewBanner({
    title = "Advanced Machine Learning and AI",
    instructor = "Dr. Jane Smith",
    rating = 4.8,
    studentsEnrolled = 15000,
    duration = "10 weeks",
    level = "Advanced",
    category = "Computer Science",
    backgroundImage = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
}: CourseBannerProps) {
    return (
        <div className="relative w-full h-[600px] bg-cover bg-center text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 h-full max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {title}
                        </h1>
                        <p className="text-xl">
                            Taught by <span className="font-semibold">{instructor}</span>
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="ml-1 font-medium">{rating}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-5 h-5" />
                                <span className="ml-1">{studentsEnrolled.toLocaleString()} students</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Badge variant="secondary" className="text-sm py-1 px-2 bg-white/20 text-white">
                                <Clock className="w-4 h-4 mr-1" />
                                {duration}
                            </Badge>
                            <Badge variant="secondary" className="text-sm py-1 px-2 bg-white/20 text-white">
                                {level}
                            </Badge>
                            <Badge variant="secondary" className="text-sm py-1 px-2 bg-white/20 text-white">
                                {category}
                            </Badge>
                        </div>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Start Learning Now
                        </Button>
                    </div>
                    <div className="hidden lg:block">
                        <div className="aspect-video rounded-lg bg-black/50 shadow-xl flex items-center justify-center border-2 border-white/20">
                            <PlayCircle className="w-24 h-24 text-white opacity-75" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
