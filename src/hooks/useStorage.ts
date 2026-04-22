import {useState} from 'react'
import backendClient from '@/lib/backendClient'

const BUCKET_NAME = 'dishes'

export interface UploadResult {
  path: string
  publicUrl: string
}

export function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const upload = async (
    file: File,
    folder: string = 'dishes',
  ): Promise<UploadResult | null> => {
    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

      // Subir archivo
      const {data, error: uploadError} = await backendClient.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Obtener URL pública
      const {data: urlData} = backendClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

      setProgress(100)

      return {
        path: data.path,
        publicUrl: urlData.publicUrl,
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Error uploading file')
      setError(error)
      console.error('Upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const uploadMultiple = async (
    files: File[],
    folder: string = 'dishes',
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      const result = await upload(files[i], folder)
      if (result) {
        results.push(result)
      }
      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    return results
  }

  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
    error,
  }
}

export function useDeleteImage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteImage = async (path: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      const {error: deleteError} = await backendClient.storage
        .from(BUCKET_NAME)
        .remove([path])

      if (deleteError) {
        throw deleteError
      }

      return true
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Error deleting file')
      setError(error)
      console.error('Delete error:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteImage,
    isDeleting,
    error,
  }
}

// Utilidad para extraer el path de una URL pública de storage
export function getPathFromPublicUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(
      /\/storage\/v1\/object\/public\/dishes\/(.+)/,
    )
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

// Obtener URL pública desde un path
export function getPublicUrl(path: string): string {
  const {data} = backendClient.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}
