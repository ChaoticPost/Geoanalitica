import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <header className="bg-gray-800 text-white p-4">
                <nav>
                    {/* Add navigation here */}
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white p-4 mt-auto">
                <div className="container mx-auto">
                    {/* Add footer content here */}
                </div>
            </footer>
        </div>
    )
}

export default MainLayout 