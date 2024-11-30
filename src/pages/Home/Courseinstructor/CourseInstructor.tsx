import React from 'react';

// Instructor Component
const CourseInstructor: React.FC = () => (
    <div className="p-6 border rounded-lg h-auto">
        <div className="flex items-start gap-4">
            <img
                src="../../../../public/image/courses/instructor.jpeg"
                alt="Instructor profile picture"
                width={64}
                height={64}
                className="rounded-full"
            />
            <div className="space-y-1">
                <h2 className="font-semibold text-lg">Munzereen Shahid</h2>
                <div className="space-y-0.5 text-sm text-muted-foreground">
                    <p>MSc (English), University of Oxford (UK);</p>
                    <p>BA, MA (English), University of Dhaka;</p>
                    <p>IELTS: 8.5</p>
                </div>
            </div>
        </div>
    </div>
);

export default CourseInstructor;
