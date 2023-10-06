import { Version } from '@renderer/models/version.model'
import fileIcon from '../assets/file-icon.png'
import playIcon from '../assets/play_icon.png'
import stopIcon from '../assets/stop_icon.png'
import { format } from 'date-fns'
import { useMemo } from 'react'

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-500"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M18 6l-12 12"></path>
      <path d="M6 6l12 12"></path>
    </svg>
  )
}

interface VersionResumeProps {
  isRunnig: boolean
  version: Version | null
  onCancel?: () => void
  onRun?: (version: Version) => void
  onStop?: () => void
}

export const VersionResume: React.FC<VersionResumeProps> = ({
  isRunnig,
  onCancel,
  onRun,
  onStop,
  version
}) => {
  if (!version) return null
  const createdAt = useMemo(() => format(new Date(version.createdAt), 'dd/MM/yy'), [version])
  return (
    <div className="bg-white rounded-lg relative overflow-hidden">
      <div className="flex gap-4 items-start p-5">
        {!isRunnig ? (
          <button onClick={onCancel} className="absolute right-4 top-4">
            <CloseIcon />
          </button>
        ) : null}
        <div>
          <img className="h-[90px]" src={fileIcon} alt="file icon" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-5 items-center mb-3">
            <h6 className="text-gray-800 font-bold text-2xl">Versión {version.version}</h6>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Fecha de creación:</span> {createdAt}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Autor:</span> {version.author}
          </p>
          <p className="text-sm text-gray-500 overflow-hidden text-ellipsis">
            <span className="font-semibold text-gray-700">Ubicación:</span> {version.location}
          </p>
        </div>
      </div>
      {version.notes ? (
        <div className="px-5">
          <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-md">{version.notes}</p>
        </div>
      ) : null}
      <div className="pt-5 flex gap-4">
        {isRunnig ? (
          <button
            onClick={() => onStop?.()}
            className="w-full bg-red-500 text-white h-12 flex items-center gap-2 justify-center transition-all hover:bg-red-700"
          >
            <span className="text-lime-50 font-semibold">Detener</span>
            <img className="h-4" src={stopIcon} alt="play icon" />
          </button>
        ) : (
          <button
            onClick={() => onRun?.(version)}
            className="w-full bg-emerald-900 text-white h-12 flex items-center gap-2 justify-center transition-all hover:bg-emerald-950"
          >
            <span className="text-lime-50 font-semibold">Abrir</span>
            <img className="h-4" src={playIcon} alt="play icon" />
          </button>
        )}
      </div>
    </div>
  )
}
