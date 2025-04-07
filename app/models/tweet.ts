import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Comment from './comment.js'
import Like from './like.js'
import Retweet from './retweet.js'
import Media from './media.js'
import Hashtag from './hashtag.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'

function belongsTo(relatedModel: () => typeof BaseModel): (target: any, propertyKey: string) => void {
  return function (target: any, propertyKey: string): void {
    // Attach metadata to the target class for the relationship
    if (!target.constructor.relations) {
      target.constructor.relations = {};
    }
    target.constructor.relations[propertyKey] = {
      type: 'belongsTo',
      relatedModel: relatedModel,
    };
  };
}
function hasMany(relatedModel: () => typeof BaseModel): (target: any, propertyKey: string) => void {
  return function (target: any, propertyKey: string): void {
    // Attach metadata to the target class for the relationship
    if (!target.constructor.relations) {
      target.constructor.relations = {};
    }
    target.constructor.relations[propertyKey] = {
      type: 'hasMany',
      relatedModel: relatedModel,
    };
  };
}

export interface TweetRelations {
  user: User
  comments: Comment[]
  likes: Like[]
  retweets: Retweet[]
  media: Media[]
  hashtags: Hashtag[]
}
export interface TweetPayload {
  id: number
  user_Id: number
  content: string
  media: string
  hashtags: string
  createdAt: DateTime
  updatedAt: DateTime
  likeCount: number
  commentCount: number
  retweetCount: number
}

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare content: string

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>
  declare likeCount: number

  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>
  
  @hasMany(() => Media)
  declare media: HasMany<typeof Media>
  
  @hasMany(() => Hashtag)
  declare hashtags: HasMany<typeof Hashtag>
}
