import { createContext, useContext, useState } from 'react'
import { Version } from './models/version.model'

const VersionContext = createContext<{
  versions: Version[]
  setVersions: (versions: Version[]) => void
}>({
  versions: [],
  setVersions: () => {}
})

interface VersionProviderProps {
  children: React.ReactNode
}

export const VersionProvider: React.FC<VersionProviderProps> = ({ children }) => {
  const [versions, setVersions] = useState<Version[]>([])

  const setVersionsList = (versions: Version[]) => {
    setVersions(versions)
  }

  return (
    <VersionContext.Provider value={{ versions, setVersions: setVersionsList }}>
      {children}
    </VersionContext.Provider>
  )
}

export const useVersions = () => useContext(VersionContext)
