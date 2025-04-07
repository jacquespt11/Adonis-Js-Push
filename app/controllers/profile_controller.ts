// app/Controllers/profile_Controller.ts

import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  public async show({ view, auth }: HttpContext) {
    if (!auth.user) {
      return view.render('login')
    }

    const user = auth.user
    return view.render('profile', { user })
  }

  public async edit({ view, auth }: HttpContext) {
    if (!auth.user) {
      return view.render('login')
    }

    const user = auth.user
    return view.render('edit-profile', { user })
  }
}