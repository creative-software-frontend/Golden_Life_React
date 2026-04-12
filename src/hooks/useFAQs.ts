import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface FAQ {
    id: number;
    category_id: string;
    question: string;
    answer: string;
    status: string;
    created_at: string;
    updated_at: string;
    category: string | null;
}

interface FAQResponse {
    status: string;
    message: string;
    count: number;
    data: FAQ[];
}

const fetchFAQs = async (search?: string): Promise<FAQ[]> => {
    const url = `https://api.goldenlife.my/api/get-faqs${search ? `?search=${encodeURIComponent(search)}` : ''}`;
    const response = await axios.get<FAQResponse>(url);
    return response.data.data;
};

export const useFAQs = (search?: string) => {
    return useQuery({
        queryKey: ['faqs', search],
        queryFn: () => fetchFAQs(search),
        enabled: true, // Always fetch if search changes or on mount
    });
};
