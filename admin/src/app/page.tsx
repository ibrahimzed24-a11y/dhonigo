import React from 'react';

export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Bookings" value="1,280" change="+12.5%" />
                <StatCard title="Total Revenue" value="MVR 67,200" change="+8.2%" />
                <StatCard title="Active Operators" value="48" change="+3" />
                <StatCard title="Pending Verifications" value="12" highlight />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-6">Recent Bookings to Verify</h3>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm border-bottom">
                            <th className="pb-4">User</th>
                            <th className="pb-4">Route</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Ref Code</th>
                            <th className="pb-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <BookingRow user="Ahmed Ibrahim" route="Male - Maafushi" amount="MVR 52.50" refCode="DBG-152325" />
                        <BookingRow user="Fathimath Ali" route="Male - Himmafushi" amount="MVR 52.50" refCode="DBG-992102" />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, highlight }: any) {
    return (
        <div className={`p-6 rounded-xl border ${highlight ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {change && <p className="text-sm text-green-600 mt-2 font-semibold">{change} from last month</p>}
        </div>
    );
}

function BookingRow({ user, route, amount, refCode }: any) {
    return (
        <tr className="border-t border-gray-50">
            <td className="py-4 font-medium">{user}</td>
            <td className="py-4 text-gray-600">{route}</td>
            <td className="py-4 font-bold">{amount}</td>
            <td className="py-4 font-mono text-cyan-600">{refCode}</td>
            <td className="py-4">
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition">
                    Verify Proof
                </button>
            </td>
        </tr>
    );
}
