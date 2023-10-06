import { Input, TextArea } from '@renderer/components'
import { useFormik } from 'formik'
import { GoFileDirectory } from 'react-icons/go'
import { PatternFormat } from 'react-number-format'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'sonner'

interface DefaultData {
  project?: string
  author?: string
  version?: string
}

export const GenerateVersion: React.FC = () => {
  const { data } = useLoaderData() as { data?: DefaultData }
  const formik = useFormik({
    initialValues: {
      name: 'Super Oink',
      project: data?.project ?? '',
      version: '',
      author: data?.author ?? '',
      notes: ''
    },
    onSubmit: async (data, actions) => {
      try {
        const { path } = await window.api.compileVersion(data)
        actions.resetForm()
        toast.success(`Version ${data.version} generada correctamente!`, {
          description: `Puedes encontrar la versión en ${path}`
        })
      } catch {
        toast.error('Algo salio mal', {
          description: 'no se pudo generar la versión correctamente'
        })
      }
    }
  })
  const selectDirectory = async () => {
    const result = await window.api.selectDirectory()
    if (!result.filePaths.length) return
    const path = result.filePaths[0]
    console.log({ path })
    try {
      await window.api.verifyProjectDir(path)
      formik.setFieldValue('project', path)
    } catch {
      toast.error('Proyecto no valido!')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-center font-bold text-3xl mb-6 text-gray-800">Nueva versión</h3>
      <form onSubmit={formik.handleSubmit} className=" space-y-5">
        <div className="flex items-end gap-2">
          <Input
            value={formik.values.project}
            disabled
            className="flex-1"
            label="Ubicación del proyecto:"
          />
          <button
            onClick={selectDirectory}
            type="button"
            className="bg-lime-500 py-2 h-[42px] w-[42px] flex justify-center items-center rounded-lg text-emerald-900 font-semibold hover:bg-lime-600"
          >
            <GoFileDirectory className="text-emerald-900" />
          </button>
        </div>
        <Input
          value={formik.values.author}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="author"
          label="Autor:"
        />
        <PatternFormat
          format="#.#.###"
          mask="_"
          value={formik.values.version}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="version"
          label="Version:"
          placeholder="1.0.504"
          customInput={Input}
        />
        <TextArea
          value={formik.values.notes}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          id="notes"
          label="Notas de la versión:"
        />
        <div className="pt-4">
          <button
            type="submit"
            className="bg-lime-500 py-2 w-full rounded-lg text-emerald-900 font-semibold hover:bg-lime-600"
          >
            CREAR
          </button>
        </div>
      </form>
    </div>
  )
}
