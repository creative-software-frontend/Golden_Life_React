'use client'

import { useState } from 'react'
import { ChevronLeft, Search, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Contact {
    id: string
    name: string
    phoneNumber: string
}

const mockContacts: Contact[] = [
    { id: '1', name: 'John Doe', phoneNumber: '+1234567890' },
    { id: '2', name: 'Jane Smith', phoneNumber: '+1987654321' },
    { id: '3', name: 'Alice Johnson', phoneNumber: '+1122334455' },
    { id: '4', name: 'Bob Williams', phoneNumber: '+1555666777' },
    { id: '5', name: 'Charlie Brown', phoneNumber: '+1999888777' },
]

export default function SendMoney() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        const filtered = mockContacts.filter(contact =>
            contact.name.toLowerCase().includes(value.toLowerCase()) ||
            contact.phoneNumber.includes(value)
        )
        setFilteredContacts(filtered)
    }

    return (
        <div className="w-[40%] mx-auto bg-gray-50 min-h-screen p-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button className="text-blue-500">
                    {/* <ChevronLeft size={24} /> */}
                </button>
                <h1 className="text-xl font-semibold">Send Money</h1>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                />
            </div>

            {/* Contact List */}
            <div className="space-y-3">
                {filteredContacts.map(contact => (
                    <Card key={contact.id} className="p-4">
                        <button className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <User className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Select
                            </Button>
                        </button>
                    </Card>
                ))}
            </div>

            {searchTerm && filteredContacts.length === 0 && (
                <p className="text-center text-gray-500 mt-6">No contacts found</p>
            )}
        </div>
    )
}

