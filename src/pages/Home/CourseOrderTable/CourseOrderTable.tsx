import React from 'react';

interface CourseOrder {
    id: number;
    courseName: string;
    instructor: string;
    date: string;
    price: number;
    status: 'Completed' | 'In Progress' | 'Not Started';
}

const dummyCourseOrders: CourseOrder[] = [
    { id: 1, courseName: 'Introduction to React', instructor: 'John Doe', date: '2023-05-15', price: 49.99, status: 'Completed' },
    { id: 2, courseName: 'Advanced JavaScript', instructor: 'Jane Smith', date: '2023-05-20', price: 79.99, status: 'In Progress' },
    { id: 3, courseName: 'Python for Beginners', instructor: 'Mike Johnson', date: '2023-05-25', price: 39.99, status: 'Not Started' },
    { id: 4, courseName: 'Data Science Fundamentals', instructor: 'Emily Brown', date: '2023-05-30', price: 89.99, status: 'In Progress' },
    { id: 5, courseName: 'Web Design Basics', instructor: 'Chris Wilson', date: '2023-06-05', price: 59.99, status: 'Completed' },
];

const CourseOrderTable: React.FC = () => {
    const getStatusColor = (status: CourseOrder['status']) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Not Started':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4">Course Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>

                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>

                            <th className="py-2 px-4 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="py-2 px-4 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyCourseOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm">{order.courseName}</td>
                                <td className="py-2 px-4 border-b text-sm">{order.instructor}</td>
                                <td className="py-2 px-4 border-b text-sm">{order.date}</td>
                                <td className="py-2 px-4 border-b text-right text-sm">${order.price.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseOrderTable;

