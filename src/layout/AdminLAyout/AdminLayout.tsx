'use client'

import { useState } from 'react'
// import { useTranslation } from 'next-i18next'
import { Truck, ChevronRight, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AdminHeader from '@/pages/Dashboard/UserPanelHeader/UserPanelHeader'
import { useTranslation } from 'react-i18next'
import Products from '@/pages/Home/products/Products'
import IconsSection from '@/pages/Home/IconSection/IconSection'
import DCatagories from '@/pages/DCatagories/DCatagories'
import DCourse from '@/pages/DCourse/DCourse'
import WalletAmount from '@/pages/WalletAmount/WalletAmount'
// import AdminHeader from '@/components/AdminHeader'


export default function AdminDashboard() {
  const { t } = useTranslation('global')
  const [dateRange, setDateRange] = useState<string>(t('today'))

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
  }

  return (
    <>
      <AdminHeader />

      <div className='flex justify-between'>
        <IconsSection />
        <WalletAmount />

      </div>
      {/* <div className='flex w-full justify-between'>
        <IconsSection />
        <Products />
      </div> */}

      <main className="w-full min-h-screen mx-auto px-6 sm:px-6 lg:px-1 py-8 bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              {/* First Div - 1/3 of Width */}
              <div className="shadow rounded-lg w-full lg:w-1/3 bg-white flex items-center justify-center py-8">
                <h2 className="text-lg font-medium text-center">{t('brief_stats')}</h2>
              </div>

              {/* Second Div - 2/3 of Width */}
              <div className="shadow rounded-lg p-6 w-full lg:w-2/3 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Date Range Buttons */}
                  <div
                    className="flex flex-col sm:flex-row rounded-md shadow-sm space-y-2 sm:space-y-0 sm:space-x-2"
                    role="group"
                  >
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-r-none ${dateRange === t('today')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('today'))}
                    >
                      {t('today')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-r-none ${dateRange === t('this_week')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_week'))}
                    >
                      {t('this_week')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-none border-x-0 ${dateRange === t('this_month')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_month'))}
                    >
                      {t('this_month')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-l-none ${dateRange === t('this_year')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_year'))}
                    >
                      {t('this_year')}
                    </Button>
                  </div>

                  {/* Date Range Display */}
                  {/* <Button className="flex items-center bg-primary-default text-primary-foreground">
                    {dateRange}
                  </Button> */}
                </div>
              </div>
            </div>

            {/* Other content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="pb-4">
                  <h2 className="text-lg font-medium text-start">
                    {t('total_delivered')}
                  </h2>
                </div>
                <div className="text-4xl font-bold text-start">0</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-gray-400">
                      {t('pending_delivery')}
                    </span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-gray-400">
                      {t('total_returned')}
                    </span>
                    <span>0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                  <h2 className="text-lg font-medium text-start">
                    {t('payment_invoiced')}
                  </h2>
                  <div className="flex items-center justify-center ">
                    <Button className="mr-4 bg-primary-default">
                      {t('details')}
                    </Button>
                  </div>
                </div>
                <div className="text-4xl font-bold text-start"> ৳ 0</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <a href="#" className="flex items-center text-gray-400">
                      {t('payment_due')}
                      <div className="flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full ml-2">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                    </a>
                    <span>৳ 0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <a href="#" className="flex items-center text-gray-400">
                      {t('parcel_in_process')}
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
                    {t('out_for_delivery')}
                  </h2>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="pb-4 px-4 py-4">
                  <h2 className=" font-medium text-start text-2xl">
                    {t('pick_up_pending')}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              {/* <div className="pt-6">
                <h2 className="text-2xl font-bold mb-2">{t('deliver_products')}</h2>
                <p className="mb-4">{t('hello_merchant', { name: 'PROMISEDELIVERY MERCHANT' })}</p>
                <p className="mb-4">
                  {t('delivery_team_message')}
                </p>
                <Button className="w-1/2 bg-primary-default text-white font-bold">
                  {t('create_order')}
                </Button>
              </div> */}
              <Products />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="pb-4">
                <h2 className="text-lg font-medium text-start">{t('quick_links')}</h2>
              </div>
              <div className="space-y-4 mt-4">
                <Button variant="outline" className="w-full justify-between px-4 py-6 hover:bg-gray-100">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                    <span className="font-bold text-lg">{t('create_bulk_delivery')}</span>
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4 text-primary-default" />
                </Button>
                <Button variant="outline" className="w-full justify-between px-4 py-6 hover:bg-gray-100">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-10 w-10 border-2 rounded-full bg-[#f6e9f5] p-2" />
                    <span className="font-bold text-lg">{t('create_single_delivery')}</span>
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4 text-primary-default" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-4 w-full' >
          <div className='bg-white rounded-lg w-[50%] p-2 mt-2 '>
            <DCatagories />
          </div>
          <div className='bg-white rounded-lg mt-2 p-2 w-[50%]'>
            <DCourse />
          </div>
        </div>
      </main>


    </>
  )
}

