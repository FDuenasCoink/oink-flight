import { GoFileCode } from 'react-icons/go'
import { Link } from 'react-router-dom'

export const GenerateVersionButton: React.FC = () => {
  return (
    <div className="flex justify-end fixed bottom-6 right-6 z-10">
      <Link
        to="/generate"
        className="bg-lime-500 h-12 w-12 shadow-lg rounded-full flex justify-center items-center text-emerald-900 font-semibold transition-all hover:bg-lime-600 hover:scale-105"
      >
        <GoFileCode className="text-2xl" />
      </Link>
    </div>
  )
}
