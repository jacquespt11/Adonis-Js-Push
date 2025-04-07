import type { HttpContext } from '@adonisjs/core/http'
import Comment from 'App/models/comment.js'
import { createCommentValidator } from '#validators/comment'

export default class CommentController {
  public async store({ request, auth, params, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createCommentValidator.validate(data)
      await Comment.create({
        user_id: auth.user!,
        tweet_id: params.tweet_id,
        content: payload.content,
      })
      return response.redirect(`/tweets/${params.tweet_id}`)
    } catch (error) {
      if (error && 'messages' in error) {
        return response.status(400).json({ errors: error.messages })
      }
      return response.status(400).json({ message: 'Validation failed', errors: error.messages })
    }
  }
}