import { GoArrowLeft } from 'react-icons/go'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export const Root: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    navigate(-1)
  }

  const canGoBack = location.key !== 'default'

  return (
    <div className="bg-gray-100 min-h-screen px-10 py-10 pb-24">
      <header className="mb-12">
        {canGoBack ? (
          <button
            className="p-2 bg-gray-200 h-12 w-12 rounded-full hover:bg-gray-300 transition-all"
            onClick={handleBack}
          >
            <GoArrowLeft className="text-3xl" />
          </button>
        ) : (
          <div className="h-12"></div>
        )}
        <div className="text-5xl font-extrabold">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r p-1 from-lime-500 to-lime-600 text-center">
            OinkFlight
          </h1>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
