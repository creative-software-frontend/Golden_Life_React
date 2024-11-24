'use client'

import { useState } from 'react'
import { Calendar, Truck, ChevronRight, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AdminHeader from '@/pages/Dashboard/UserPanelHeader/UserPanelHeader'

export default function AdminLayout() {
  const [dateRange, setDateRange] = useState<string>("This week")

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
  }

  return (
    <>
      <AdminHeader />
      <main className="w-full min-h-screen mx-auto px-6 sm:px-6 lg:px-1 py-8 bg-slate-100">
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
              <div className="shadow rounded-lg p-6 w-full max-w-3xl bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Date Range Buttons */}
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <Button
                      variant="outline"
                      className={`rounded-r-none ${dateRange === "This Week" ? "bg-primary-default text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                      onClick={() => handleDateRangeChange("This Week")}
                    >
                      This Week
                    </Button>
                    <Button
                      variant="outline"
                      className={`rounded-none border-x-0 ${dateRange === "This Month" ? "bg-primary-default text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                      onClick={() => handleDateRangeChange("This Month")}
                    >
                      This Month
                    </Button>
                    <Button
                      variant="outline"
                      className={`rounded-l-none ${dateRange === "This Year" ? "bg-primary-default text-primary-foreground" : " hover:text-accent-foreground"}`}
                      onClick={() => handleDateRangeChange("This Year")}
                    >
                      This Year
                    </Button>
                  </div>

                  {/* Date Range Display */}
                  <Button className="flex items-center bg-primary-default text-primary-foreground">
                    {/* <Calendar className="mr-2 h-4 w-4" /> */}
                    {dateRange}
                  </Button>
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
                    <Button className="mr-4 bg-primary-default">
                      Details
                    </Button>
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
            <div className="bg-gradient-to-r from-primary-default to-primary-light text-white rounded-lg p-6">
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-2">Deliver Products</h2>
                <p className="mb-4">Hello, PROMISEDELIVERY MERCHANT</p>
                <p className="mb-4">
                  Our team of professionals is here to deliver your products
                  nationwide.
                </p>
                <Button className="w-1/2 bg-primary-default text-white font-bold">
                  Create Order
                </Button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-start">Quick Links</h2>
              </div>
              <div className="space-y-4 mt-4">
                <Button variant="outline" className="w-full justify-between px-4 py-6 hover:bg-gray-100">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                    <span className="font-bold text-lg">Create Bulk Delivery</span>
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4 text-primary-default" />
                </Button>
                <Button variant="outline" className="w-full justify-between px-4 py-6 hover:bg-gray-100">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                    <span className="font-bold text-lg">Create Single Delivery</span>
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4 text-primary-default" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
