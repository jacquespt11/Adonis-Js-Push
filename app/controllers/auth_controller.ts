import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // Vérifier les informations d'identification
    const user = await User.findBy('email', email)
    if (!user || !(await user.verifyCredentials(user.password, password))) {
      return response.status(400).send({ message: 'Credentielle est invalide' })
    }
    

    // Authentifier l'utilisateur
    await auth.use('web').login(user)

    return response.redirect('/')
  }
}
