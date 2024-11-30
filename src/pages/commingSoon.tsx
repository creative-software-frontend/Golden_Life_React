import React from "react"
import { Clock } from "lucide-react"

const CommingSoon: React.FC = () => {
    return (
        <div className="w-full md:max-w-[1040px] mt-8 mb-4 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
            <div className="text-center">
                {/* <Clock className="w-16 h-16 text-primary-default mb-4" /> */}
                <h1 className="text-6xl font-bold text-gray-800">Coming Soon</h1>
                <p className="mt-4 text-lg text-gray-600">
                    We're working on something exciting! Stay tuned for updates.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Expected launch: <span className="font-medium text-primary-default">[Your Date Here]</span>
                </p>
            </div>
            <div className="mt-8">
                <form className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full sm:w-auto px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-default text-white rounded-md hover:bg-primary-dark transition"
                    >
                        Notify Me
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    Subscribe to receive updates and announcements.
                </p>
            </div>
        </div>
    )
}

export default CommingSoon
