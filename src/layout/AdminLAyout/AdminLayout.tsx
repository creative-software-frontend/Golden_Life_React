import { Calendar, Truck, ChevronRight, Info } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import the date picker styles
// import axios from 'axios'
// import { Link } from 'react-router-dom'

export default function AdminLayout() {
  const [selectedDate, setSelectedDate] = useState(null)
  // const [ setMerchants] = useState([])

  // const jwt = localStorage.getItem('token')

  // const fetchMerchantData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:1337/api/merchants', {
  //       headers: {
  //         Authorization: `Bearer ${jwt}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     const merchantsData = response.data.data // Strapi usually wraps data under 'data' object
  //     setMerchants(merchantsData) // Set the fetched merchants in state
  //     console.log('Merchant data:', merchantsData)
  //   } catch (error) {
  //     console.error('Error fetching merchant data:', error)
  //   }
  // }

  // Use useEffect to fetch data when the component mounts
  // useEffect(() => {
  //   fetchMerchantData()
  // }, [])

  return (
    <div className="w-full min-h-screen mx-auto px-6 sm:px-6 lg:px-1 py-8 bg-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex space-x-4">
            {/* First Div - 1/3 of Width */}
            <div className="shadow rounded-lg w-1/3 pt-8 ps-5 bg-white">
              <h2 className="text-lg font-medium text-start item-center">
                Brief Stats
              </h2>
            </div>

            {/* Second Div - 2/3 of Width */}
            <div className="shadow rounded-lg p-6 w-2/3 bg-white">
              <div className="mt-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)} // Set the selected date
                  customInput={
                    <button className="  flex justify-end items-center w-full px-5 py-2 border-gray-300 rounded-md text-sm text-gray-700 bg-gray-100">
                      <span className="mr-auto">
                        {selectedDate
                          ? selectedDate.toLocaleDateString()
                          : 'Select Date'}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </button>
                  }
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>
          </div>

          {/* Other content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-start">
                  Total Delivered
                </h2>
              </div>
              <div className="text-4xl font-bold text-start">0</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-gray-400">
                    Pending Delivery
                  </span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-gray-400">
                    Total Returned
                  </span>
                  <span>0</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-row items-center justify-between pb-4">
                <h2 className="text-lg font-medium text-start">
                  Payment Invoiced
                </h2>
                <div className="flex items-center justify-center ">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 flex items-left">
                    Details
                  </button>
                </div>
              </div>
              <div className="text-4xl font-bold text-start"> ৳ 0</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <a href="#" className="flex items-center text-gray-400">
                    Payment Due
                    <div className="flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full ml-2">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <span>৳ 0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <a href="#" className="flex items-center text-gray-400">
                    Parcel In Process
                    <div className="flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full ml-2">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <span> ৳ 0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-start">
                  Out for Delivery
                </h2>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="pb-4 px-4 py-4">
                <h2 className=" font-medium text-start text-2xl">
                  Pick up Pending
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6">
            <div className="pt-6">
              <h2 className="text-2xl font-bold mb-2">Deliver Products</h2>
              <p className="mb-4">Hello, PROMISEDELIVERY MERCHANT</p>
              <p className="mb-4">
                Our team of professionals is here to deliver your products
                nationwide.
              </p>
              <div className="flex items-center justify-center px-2 py-2 w-1/2 bg-white text-red-600 font-bold rounded-md cursor-pointer hover:bg-gray-100">
                Create Order
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="pb-4">
              <h2 className="text-lg font-medium text-start">Quick Links</h2>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                <a href="#" className="flex items-center py-4">
                  <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                  <span className="font-bold text-lg">
                    Create Bulk Delivery
                  </span>
                  <ChevronRight className="ml-2 h-4 w-4 text-red-500" />
                </a>
              </div>
              <div className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                <a href="#" className="flex items-center py-4">
                  <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                  <span className="font-bold text-lg">
                    Create Single Delivery
                  </span>
                  <ChevronRight className="ml-2 h-4 w-4 text-red-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
