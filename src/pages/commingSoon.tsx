import React from "react"
import { Clock } from "lucide-react"
import { useTranslation } from "react-i18next"

const CommingSoon: React.FC = () => {
    const [t] = useTranslation("global")

    return (
        <div className="w-full md:max-w-[1040px] mt-8 mb-4 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
            <div className="text-center">
                {/* <Clock className="w-16 h-16 text-primary-default mb-4" /> */}
                <h1 className="text-6xl font-bold text-gray-800">{t("comming.title1")}</h1>
                <p className="mt-4 text-lg text-gray-600">
                    {t("comming.title2")}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    {t("comming.title3")} <span className="font-medium text-primary-default">[Your Date Here]</span>
                </p>
            </div>
            <div className="mt-8">
                <form className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="email"
                        placeholder={t("comming.title5")}
                        className="w-full sm:w-auto px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-default text-white rounded-md hover:bg-primary-dark transition"
                    >
                        {t("comming.title6")}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    {t("comming.title7")}
                </p>
            </div>
        </div>
    )
}

export default CommingSoon
