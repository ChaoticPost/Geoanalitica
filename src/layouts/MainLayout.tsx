import { type ReactElement } from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = (): ReactElement => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-foreground">GeoAnalytica</div>
          {/* Здесь будет навигация */}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-muted mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Здесь будет футер */}
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 