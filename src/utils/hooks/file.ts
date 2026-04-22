import {useMutation, useQueryClient} from '@tanstack/react-query'

import {client} from '@utils/api-client'
import {DeleteFileForm, ImageForm} from '@/types'
import {createFile, deleteFile} from '@/utils/gql/file'

/**
 * Delete a image for unit or motorcycle
 */

function useDeleteFile() {
  return useMutation((data: DeleteFileForm) => fetchCheckedDocument(data))
}

/**
 * Creates a image for unit or motorcycle
 */
function useCreateImage() {
  const queryClient = useQueryClient()

  return useMutation((data: ImageForm) => fetchImage(data), {
    onSuccess() {
      queryClient.invalidateQueries(['unit', 'list'])
    },
  })
}

function fetchImage(data: ImageForm) {
  return client<boolean>(createFile, data, {upload: true})
}

function fetchCheckedDocument(data: DeleteFileForm) {
  return client<Document>(deleteFile, data)
}

export {useCreateImage, useDeleteFile}
