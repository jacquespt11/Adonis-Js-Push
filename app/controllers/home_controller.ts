import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import User from '#models/user'

export default class HomeController {

    public async index({ view, auth }:  HttpContext ) {
        if (!auth.user) {
            return view.render('login')
        }
    
        const tweets = await Tweet.query().preload('user').orderBy('createdAt', 'desc')
        const suggestions = await User.query().limit(3)
    
        return view.render('home', { tweets, suggestions })
    }
    

    public async login({ view }: { view: any }) {
        return view.render('login')
    }
    
    public async register({ view }: { view: any }) {
        return view.render('register')
    }
}
