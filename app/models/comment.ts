import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tweet from './tweet.js'

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

export interface CommentRelations {
  user: User
  tweet: Tweet
}
export interface CommentPayload {
  id: number
  user_id: number
  tweet_id: number
  content: string
  createdAt: DateTime
  updatedAt: DateTime
}
export interface CommentPayload {
  id: number
  user_id: number
  tweet_id: number
  content: string
  createdAt: DateTime
  updatedAt: DateTime
  likeCount: number
  commentCount: number
  retweetCount: number
}

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number 

  @column()
  declare tweet_id: number

  @column()
  declare content: string 

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Tweet)
  declare tweet: BelongsTo<typeof Tweet>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
} 