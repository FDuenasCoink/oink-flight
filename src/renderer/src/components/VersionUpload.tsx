import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { clsx } from 'clsx'
import { toast } from 'sonner'

interface VersionUploadFileProps {
  onUpload?: (path: string) => void
}

export const VersionUpload: React.FC<VersionUploadFileProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: { path: string }[]) => {
    if (!acceptedFiles.length) return
    const file = acceptedFiles[0]
    onUpload?.(file.path)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
    accept: {
      'application/zip': ['.oink', '.zip']
    },
    onDropRejected: () => {
      toast.error('Archivo invalido!', {
        description: 'Verifica que la extencion del archivo sea la correcta (.oink, .zip)'
      })
    }
  })

  return (
    <label
      {...getRootProps()}
      className={clsx(
        'h-[160px] border-2 border-dashed  transition-all cursor-pointer w-full rounded-lg flex justify-center items-center',
        {
          'bg-blue-100 border-blue-600 scale-105': isDragActive,
          'border-gray-400 bg-gray-200': !isDragActive
        }
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <span className="font-light text-blue-700">Cargar...</span>
      ) : (
        <span className="font-light text-gray-600">Subir versión...</span>
      )}
    </label>
  )
}
