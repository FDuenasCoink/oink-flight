import clsx from 'clsx'
import { ComponentProps } from 'react'

interface InputProps extends ComponentProps<'input'> {
  label: string
}
export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={props.id} className="block mb-2 text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        className={clsx(
          'bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        )}
        {...props}
      />
    </div>
  )
}

interface TextAreaInput extends ComponentProps<'textarea'> {
  label: string
}
export const TextArea: React.FC<TextAreaInput> = ({ label, className, ...props }) => {
  return (
    <div>
      <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-800">
        {label}
      </label>
      <textarea
        rows={4}
        className={clsx(
          '"block p-2.5 w-full text-sm text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"',
          className
        )}
        {...props}
      ></textarea>
    </div>
  )
}
