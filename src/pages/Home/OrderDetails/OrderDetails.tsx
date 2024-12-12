import React from 'react';
import { Package } from 'lucide-react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const OrderDetails: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };
    const { t } = useTranslation("global");

    const orderProgressSteps = [
        "step1", "step2", "step3", "step4", "step5", "step6"
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 bg-gray-100 relative">
            <img
                src="/public/image/logo/logo.jpg"
                alt={t("orderDetails.logoAlt")}
                className="w-200 h-12 object-cover mx-auto items-center"
            />
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="text-right mr-2">
                    <p className="text-sm font-semibold">{t("orderDetails.companyName")}</p>
                    <p className="text-xs">{t("orderDetails.companyAddress")}</p>
                    <p className="text-xs">{t("orderDetails.companyPhone")}</p>
                </div>

                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t("orderDetails.printButtonLabel")}
                >
                    <FontAwesomeIcon icon={faPrint} className="w-5 h-5" />
                    <span className="sr-only">{t("orderDetails.print")}</span>
                </button>
            </div>

            <h2 className="text-lg font-medium text-start">{t("orderDetails.title")}</h2>

            <div className="flex justify-between items-start p-4 bg-white rounded-md">
                <div className="gap-4 item-center text-start">
                    <div className="text-sm text-muted-foreground">
                        {t("orderDetails.orderNumber", { number: "18769" })}
                    </div>
                    <div>
                        {t("orderDetails.orderPlacedOn", { date: "31 Dec 2024 20:16:02" })}
                    </div>
                </div>
                <div className="text-right flex gap-4 item-center">
                    <div className="text-sm text-muted-foreground">{t("orderDetails.totalLabel")}</div>
                    <div className="font-medium">{t("orderDetails.totalAmount", { amount: "779.00" })}</div>
                </div>
            </div>

            <div className="relative bg-white p-4 rounded-md">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-[55%] transform -translate-y-1/2 w-full h-[2px] bg-muted -z-10"></div>
                    {orderProgressSteps.map((step, index, array) => (
                        <div key={index} className="flex-1 flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center text-primary-foreground`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div className="text-xs mt-2 text-center">{t(`orderDetails.orderProgress.${step}`)}</div>
                            {index === 0 && <div className="text-[10px] text-muted-foreground">31/10/2024</div>}
                            {index < array.length - 1 && (
                                <div className={`absolute top-1/2 right-0 transform translate-x-1/2 h-[2px] ${index < 1 ? 'bg-primary' : 'bg-muted'}`} style={{ width: '100%' }}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 bg-white p-4 rounded-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">{t("orderDetails.packageLabel", { number: 1 })}</span>
                    </div>
                    <Link to='/orderdetails' className="text-sm text-blue-600 hover:underline">
                        {t("orderDetails.visitShop")}
                    </Link>
                </div>
                <div className="text-sm text-muted-foreground">{t("orderDetails.soldBy", { seller: "PICKY MALL" })}</div>
                <div className="flex gap-4 border rounded-lg p-4">
                    <img
                        src="/public/image/bread.jpg"
                        alt={t("orderDetails.productImageAlt")}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h3 className="font-medium">{t("orderDetails.productName")}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t("orderDetails.sizeLabel")} n/a, {t("orderDetails.colorLabel")} n/a
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="font-medium">{t("orderDetails.productPrice", { price: "720" })}</div>
                        <div className="text-sm text-muted-foreground">{t("orderDetails.quantityLabel")} 1</div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-md">
                <div className="space-y-2 text-left">
                    <h3 className="font-medium">{t("orderDetails.shippingAddress")}</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>Dilouar Hossain</p>
                        <p>Mirpur 10, Mirpur, Dhaka, Dhaka</p>
                        <p>+8801717468814</p>
                    </div>
                </div>
                <div className="space-y-4 text-right">
                    <h3 className="font-medium">{t("orderDetails.totalSummary")}</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>{t("orderDetails.subTotal")}</span>
                            {/* <span>{t("orderDetails.currency", { amount: "720" })}</span> */}
                            <span>৳ 720</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("orderDetails.deliveryFee")}</span>
                            {/* <span>{t("orderDetails.currency", { amount: "59" })}</span> */}
                            <span>৳ 59</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>{t("orderDetails.total")}</span>
                            {/* <span>{t("orderDetails.currency", { amount: "779.00" })}</span> */}
                            <span>৳ 779.00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t("orderDetails.paidBy")}</span>
                            <span>{t("orderDetails.paymentMethod")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">{t("orderDetails.companyName")}</span>
                    <p className="text-xs text-muted-foreground">{t("orderDetails.companyAddress")}</p>
                    <p className="text-xs text-muted-foreground">{t("orderDetails.companyPhone")}</p>
                </div>
                <img
                    src="/public/image/logo/logo.jpg"
                    alt={t("orderDetails.logoAlt")}
                    className="w-100 h-8 mx-2 object-cover"
                />
            </div>
        </div>
    );
};

export default OrderDetails;

