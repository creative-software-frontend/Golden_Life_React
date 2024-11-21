import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function CourseDetails() {
    const faqItems = [
        {
            question: "'Complete English Grammar Course' টি যাদের জন্য",
            answer: "Course content details here..."
        },
        {
            question: "'Complete English Grammar Course' কোর্সটি ডিটেইলস সেকশন (আর্নিং এরিয়া):",
            answer: "Course section details here..."
        },
        {
            question: "'Complete English Grammar Course'-টি কতদিন ধরে আপনি কী কী করতে পারবেন?",
            answer: "Course duration and activities details here..."
        },
        {
            question: "কেন 'Complete English Grammar Course' কোর্সটি করবেন?",
            answer: "Course benefits details here..."
        },
        {
            question: "'Complete English Grammar Course'-এর উপযোগীতা সম্পর্কে বিস্তারিত:",
            answer: "Course utility details here..."
        },
        {
            question: "শেষ কথা:",
            answer: "Concluding remarks here..."
        }
    ]

    return (
        <div className="p-6 border rounded-lg h-[450px]">
            <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}