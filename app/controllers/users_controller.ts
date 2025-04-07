// app/controllers/user_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { CreateUserValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'
import ally from '@adonisjs/ally/services/main'

export default class UsersController {
  private validSocialProviders = ['google', 'facebook', 'github', 'linkedin']

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.findByOrFail('email', email)

      if (!(await hash.verify(user.password, password))) {
        return response.status(401).json({ message: 'Identifiants invalides' })
      }

      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      return response.status(401).json({ message: 'Identifiants invalides' })
    }
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateUserValidator)

    try {
      const user = await User.create({
        username: payload.username,
        email: payload.email,
        password: payload.password,
      })

      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      return response.status(400).json({ 
        message: 'Erreur de validation',
        errors: error.messages || error.message
      })
    }
  }

  async socialLogin({ params, response }: HttpContext) {
    const provider = params.provider

    if (!this.validSocialProviders.includes(provider)) {
      return response.status(400).json({ message: 'Provider non supporté' })
    }

    try {
      const socialUser = await ally.use(provider)!.user()

      const user = await User.firstOrCreate(
        { email: socialUser.email! },
        {
          username: socialUser.name || socialUser.nickName,
          email: socialUser.email!,
          password: await hash.make(Math.random().toString(36).slice(-8)),
          avatar: socialUser.avatarUrl,
        }
      )

      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      return response.status(400).json({ message: 'Échec de l’authentification' })
    }
  }

  async profile({ params, view }: HttpContext) {
    const user = await User.findByOrFail('username', params.username)
    return view.render('profile', { user })
  }

  async adminDashboard({ response, bouncer }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('isAdmin')
    return response.json({ message: "Bienvenue admin" })
  }

  async logout({ response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}