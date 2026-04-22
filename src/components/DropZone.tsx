import * as React from 'react'

import {useDropzone, Accept, DropzoneInputProps} from 'react-dropzone'
import {ArrowUpTrayIcon} from '@heroicons/react/24/outline'

type Props = DropzoneInputProps & {
  uploadText: string
  allowFiles: string
  maxFiles?: number
  maxSize?: number
  field: any
  acceptDocuments?: Accept
}

/**
 * Renders an async select from 'react-select' libray
 *
 * @component
 * @param {Props}
 */
function DropZone({
  uploadText,
  allowFiles,
  maxFiles,
  acceptDocuments,
  maxSize,
  field,
  ...props
}: Props) {
  const [files, setFiles] = React.useState<Array<any>>([])

  const multiple = maxFiles && maxFiles > 2 ? true : false

  const {getRootProps, getInputProps} = useDropzone({
    accept: acceptDocuments,
    maxFiles,
    maxSize,
    multiple,
    onDrop: acceptedFiles => {
      const fileSelect = multiple ? acceptedFiles : acceptedFiles[0]
      field.onChange(fileSelect)
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      )
    },
  })

  const thumbs = files.map(file => (
    <div key={file.name}>
      {file.type.includes('image') ? (
        <img alt="imagen de archivo" className="w-20 h-20" src={file.preview} />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-gray-300 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">
          FILE
        </div>
      )}
    </div>
  ))

  return (
    <div
      {...props}
      {...getRootProps({className: `dropzone ${props.className}`})}
    >
      <div className="space-y-1 text-center">
        <ArrowUpTrayIcon
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
        <div className="flex text-sm text-gray-600 justify-center">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-medium text-gray-600 hover:text-gray-500"
          >
            <span className="justify-center">{uploadText}</span>
            <input type="file" {...getInputProps()} />
          </label>
        </div>
        <p className="text-xs text-gray-500 justify-center">
          {allowFiles} maximo 10MB
        </p>
      </div>
      <aside className="mt-4 inline-flex space-x-4">{thumbs}</aside>
    </div>
  )
}

export {DropZone}
