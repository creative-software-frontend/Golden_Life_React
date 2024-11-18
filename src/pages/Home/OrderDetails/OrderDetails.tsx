import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const OrderDetails: React.FC = () => {
    // Function to handle printing
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 bg-gray-100 relative">
            {/* Print Button and Image */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <img
                    src="../../../../.../../../public/image/logo/logo.jpg" // replace with the actual path to your image
                    alt="Logo"
                    className="w-100 mx-2 h-8 object-cover rounded-full"
                />
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Print order details"
                >
                    <FontAwesomeIcon icon={faPrint} className="w-5 h-5" />
                    <span className="sr-only">Print</span>
                </button>
            </div>

            <h2 className="text-lg font-medium text-start">Order Details</h2>

            {/* Order Header */}
            <div className="flex justify-between items-start p-4 bg-white rounded-md">
                <div className="flex gap-4 item-center">
                    <div className="text-sm text-muted-foreground">
                        Order #18769
                    </div>
                    <div>
                        Placed on 31 Dec 2024 20:16:02
                    </div>
                </div>
                <div className="text-right flex gap-4 item-center">
                    <div className="text-sm text-muted-foreground">Total:</div>
                    <div className="font-medium">৳ 779.00</div>
                </div>
            </div>

            {/* Order Progress */}
            <div className="relative bg-white p-4 rounded-md">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-[55%] transform -translate-y-1/2 w-full h-[2px] bg-muted -z-10"></div>
                    {["order placed", "order confirmed", "ready for shipment", "ship to courier", "order on the way", "order delivered"].map((step, index, array) => (
                        <div key={index} className="flex-1 flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center text-primary-foreground`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div className="text-xs mt-2 text-center">{step}</div>
                            {index === 0 && <div className="text-[10px] text-muted-foreground">31/10/2024</div>}
                            {index < array.length - 1 && (
                                <div className={`absolute top-1/2 right-0 transform translate-x-1/2 h-[2px] ${index < 1 ? 'bg-primary' : 'bg-muted'}`} style={{ width: '100%' }}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4 bg-white p-4 rounded-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Package 1</span>
                    </div>
                    <Link to='/orderdetails' className="text-sm text-blue-600 hover:underline">
                        Visit Shop
                    </Link>
                </div>
                <div className="text-sm text-muted-foreground">sold by PICKY MALL</div>
                <div className="flex gap-4 border rounded-lg p-4">
                    <img
                        src="../../../../.../../../public/image/bread.jpg"
                        alt="Product"
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h3 className="font-medium">Ignite Breast Bigger for girls women and Lady</h3>
                        <p className="text-sm text-muted-foreground">Size: n/a , Color: n/a</p>
                    </div>
                    <div className="text-right">
                        <div className="font-medium">৳ 720</div>
                        <div className="text-sm text-muted-foreground">Qty: 1</div>
                    </div>
                </div>
            </div>

            {/* Shipping and Summary */}
            <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-md">
                <div className="space-y-2 text-left">
                    <h3 className="font-medium">Shipping Address</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>Dilouar Hossain</p>
                        <p>Mirpur 10, Mirpur, Dhaka, Dhaka</p>
                        <p>+8801717468814</p>
                    </div>
                </div>
                <div className="space-y-4 text-right">
                    <h3 className="font-medium">Total Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Sub Total</span>
                            <span>৳ 720</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>৳ 59</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>৳ 779.00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Paid by</span>
                            <span>cash</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm font-semibold text-muted-foreground">Creative Software</span>
                <img
                    src="../../../../.../../../public/image/logo/logo.jpg" // replace with the actual path to your logo
                    alt="Logo"
                    className="w-100 h-8 mx-2 object-cover"
                />
            </div>
        </div>
    );
};

export default OrderDetails;
