import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  GenerateVersionButton,
  Loader,
  VersionResume,
  VersionUpload,
  Versions
} from '@renderer/components'
import { useVersions } from '@renderer/context'
import { Version } from '@renderer/models/version.model'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const RunVersion: React.FC = () => {
  const [version, setVersion] = useState<Version | null>()
  const { versions, setVersions } = useVersions()
  const [loading, setLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [parent] = useAutoAnimate()

  const handleUpload = async (path: string) => {
    try {
      const version = await window.api.getAppInfo(path)
      setVersion(version)
    } catch {
      const error = new Error('Este archivo no es valido para cargar')
      handleError(error)
    }
  }

  const handleSelect = (version: Version) => {
    if (isRunning) return
    setVersion(version)
  }

  const handleRemoveVersion = async (removeVersion: Version) => {
    try {
      if (removeVersion.version === version?.version) {
        setVersion(null)
      }
      await window.api.removeVersion(removeVersion)
      await getVersionList()
    } catch (error) {
      handleError(error)
    }
  }

  const handleCancelVersion = () => {
    setVersion(null)
  }

  const handleRun = async (version: Version) => {
    try {
      setLoading(true)
      const appLocation = version.location
      await window.api.loadApp(appLocation)
      await window.api.setVersion(version)
      await getVersionList()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error)
    }
  }

  const handleStop = async () => {
    await window.api.closeApp()
  }

  const getVersionList = async () => {
    try {
      const versions = await window.api.getVersions()
      setVersions(versions)
    } catch (error) {
      handleError(error)
    }
  }

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      const description = error.message
      toast.error('Algo salió mal!', { description })
      return
    }
    toast.error('Algo salió mal!')
  }

  useEffect(() => {
    getVersionList()
    window.api.onAppStateChange(({ open }) => {
      setIsRunning(open)
    })
  }, [])

  return (
    <div>
      <Loader isOpen={loading} />
      <GenerateVersionButton />
      <section ref={parent} className="mb-10">
        {version ? (
          <VersionResume
            version={version}
            isRunnig={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            onCancel={handleCancelVersion}
          />
        ) : (
          <VersionUpload onUpload={handleUpload} />
        )}
      </section>
      <section>
        <h3 className="text-gray-700 font-medium text-2xl mb-3">Recientes:</h3>
        <Versions>
          {versions.map((version) => (
            <Versions.Item
              version={version}
              key={version.version}
              onRemove={handleRemoveVersion}
              onClick={handleSelect}
            />
          ))}
        </Versions>
      </section>
    </div>
  )
}
