import type { HttpContext } from '@adonisjs/core/http'
import Like from '#models/like'
import { createLikeValidator } from '#validators/like'

export default class LikesController {
  public async store({ request, auth, params, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createLikeValidator.validate(data)
      await Like.create({
        user_id: auth.user!,
        tweet_id: params.tweet_id,
        ...payload,
      })
      return response.redirect(`/tweets/${params.tweet_id}`)
    } catch (error) {
      if (error && 'messages' in error) {
        return response.status(400).json({ errors: error.messages })
      }
      return response.status(400).json({ message: 'Validation failed', errors: error.messages })
    }
  }
  public async destroy({ params, response }: HttpContext) {
    const like = await Like.find(params.id)
    if (!like) {
      return response.notFound('Like not found')
    }
    await like.delete()
    return response.ok({ message: 'Like deleted successfully' })
  }
}