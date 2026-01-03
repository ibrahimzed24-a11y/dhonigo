import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 min-h-screen">
                <div className="flex">
                    <aside className="w-64 bg-white h-screen border-r">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-cyan-600">DhoniGo Admin</h1>
                        </div>
                        <nav className="mt-6">
                            <a href="#" className="block py-3 px-6 bg-cyan-50 text-cyan-700 border-r-4 border-cyan-600 font-semibold">Dashboard</a>
                            <a href="#" className="block py-3 px-6 text-gray-600 hover:bg-gray-50">Bookings</a>
                            <a href="#" className="block py-3 px-6 text-gray-600 hover:bg-gray-50">Operators</a>
                            <a href="#" className="block py-3 px-6 text-gray-600 hover:bg-gray-50">Users</a>
                            <a href="#" className="block py-3 px-6 text-gray-600 hover:bg-gray-50">Settings</a>
                        </nav>
                    </aside>
                    <main className="flex-1 p-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
