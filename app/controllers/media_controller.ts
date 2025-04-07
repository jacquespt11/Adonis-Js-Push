import type { HttpContext } from '@adonisjs/core/http'
import Media from 'App/models/media.js'
import fs from 'fs/promises'
import { Database } from '@adonisjs/lucid/database'

export default class MediaController {
  public async store({ request, response }: HttpContext) {
    try {
      const media = request.file('media', {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      })

      if (!media) {
        return response.badRequest({ message: 'No media file uploaded' })
      }

      const fileName = `${Date.now()}-${media.clientName}`
      await media.move('uploads', { name: fileName })

      if (media.state !== 'moved') {
        return response.badRequest({ message: media.errors[0]?.message || 'File upload failed' })
      }

      const newMedia = await Media.create({
        file_path: `uploads/${fileName}`,
        file_name: media.clientName,
        file_size: media.size,
        file_extension: media.extname,
        file_type: media.extname || 'unknown',
      })

      return response.created({
        message: 'Media file uploaded successfully',
        media: newMedia,
      })
    } catch (error) {
      return response.internalServerError({ message: 'An error occurred', error: error.message })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const media = await Media.find(params.id)
      if (!media) {
        return response.notFound({ message: 'Media file not found' })
      }

      return response.ok(media)
    } catch (error) {
      return response.internalServerError({ message: 'An error occurred', error: error.message })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const media = await Media.find(params.id)
      if (!media) {
        return response.notFound({ message: 'Media file not found' })
      }

      // Suppression du fichier physique de manière asynchrone
      await fs.unlink(media.file_path).catch(() => {})

      // Suppression de l'entrée en base de données
      await media.delete()

      return response.ok({ message: 'Media file deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'An error occurred', error: error.message })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const media = await Media.find(params.id)
      if (!media) {
        return response.notFound({ message: 'Media file not found' })
      }

      const newMedia = request.file('media', {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      })

      if (!newMedia) {
        return response.badRequest({ message: 'No media file uploaded' })
      }

      const fileName = `${Date.now()}-${newMedia.clientName}`
      await newMedia.move('uploads', { name: fileName })

      if (newMedia.state !== 'moved') {
        return response.badRequest({ message: newMedia.errors[0]?.message || 'File update failed' })
      }

      // Suppression de l'ancien fichier si différent
      if (media.file_path !== `uploads/${fileName}`) {
        await fs.unlink(media.file_path).catch(() => {})
      }

      // Mise à jour des informations média
      media.merge({
        file_path: `uploads/${fileName}`,
        file_name: newMedia.clientName,
        file_size: newMedia.size,
        file_extension: newMedia.extname,
        file_type: newMedia.extname || 'unknown',
      })

      await media.save()
      await trx.commit()

      return response.ok({ message: 'Media file updated successfully', media })
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({ message: 'An error occurred', error: error.message })
    }
  }

  public async showLikes({ params, response }: HttpContext) {
    try {
      const media = await Media.query().where('id', params.id).preload('likes').first()

      if (!media) {
        return response.notFound({ message: 'Media file not found' })
      }

      return response.ok({
        media,
        likes: media.likes,
        likeCount: media.likes.length,
      })
    } catch (error) {
      return response.internalServerError({ message: 'An error occurred', error: error.message })
    }
  }
}
