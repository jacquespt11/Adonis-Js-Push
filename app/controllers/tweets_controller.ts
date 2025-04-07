import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import { CreateTweetValidator } from '#validators/tweet'

export default class TweetsController {
  public async index({ view }: { view: any }) {
    // Récupérer les tweets avec leurs relations (utilisateur)
    const tweets = await Tweet.query().preload('user').orderBy('created_at', 'desc')
    return view.render('tweets/index', { tweets })
  }

  public async create({ view }: {view: any}) {
    return view.render('tweets/create')
  }

  public async store({ request, response, session }: HttpContext) {
    const validatedData = await CreateTweetValidator.validate(request)

    const tweet = new Tweet()
    tweet.content = validatedData.content
    await tweet.save()

    session.flash({ success: 'Tweet created successfully!' })
    return response.redirect().toRoute('tweets.index')
  }
}