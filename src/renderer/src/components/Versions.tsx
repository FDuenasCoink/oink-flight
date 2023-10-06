import { Version } from '@renderer/models/version.model'
import { format } from 'date-fns'
import React, { useMemo } from 'react'
import { GoTrash } from 'react-icons/go'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface ItemProps {
  onClick?: (version: Version) => void
  onRemove?: (version: Version) => void
  version: Version
}

const Item: React.FC<ItemProps> = ({ onClick, onRemove, version }) => {
  const handleClick = () => {
    onClick?.(version)
  }

  const handleRemove: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    onRemove?.(version)
  }

  const createdAt = useMemo(() => format(new Date(version.createdAt), 'dd/MM/yy'), [version])
  return (
    <li>
      <div
        onClick={handleClick}
        className="py-4 cursor-pointer px-6 gap-3 w-full text-left flex items-center hover:bg-gray-200"
      >
        <div className="flex-1">
          <p className="text-gray-800 font-semibold text-base">Versión {version.version}</p>
          <span className="text-sm text-gray-500 font-light block">{createdAt}</span>
          <span className="text-sm text-gray-500 font-light block">{version.author}</span>
        </div>
        <div>
          <button
            className="p-2 text-red-500 transition-all rounded-md hover:text-white hover:bg-red-500"
            onClick={handleRemove}
          >
            <GoTrash className="text-xl" />
          </button>
        </div>
      </div>
    </li>
  )
}

interface VersionsSubcomponents {
  Item: typeof Item
}

interface VersionProps {
  children?: React.ReactNode
}

const Versions: React.FC<VersionProps> & VersionsSubcomponents = ({ children }) => {
  const [parent] = useAutoAnimate()

  const count = React.Children.count(children)

  return (
    <ul ref={parent} className="bg-white rounded-lg overflow-hidden divide-y">
      {count ? (
        children
      ) : (
        <div className="bg-white rounded-lg h-48 px-28 flex justify-center items-center">
          <p className="text-gray-500 text-center">No hay versiones recientes disponibles</p>
        </div>
      )}
    </ul>
  )
}

Versions.Item = Item
export default Versions
