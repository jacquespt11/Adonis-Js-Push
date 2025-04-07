import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tweet from './tweet.js'

function belongsTo(relatedModel: () => typeof BaseModel, options?: { foreignKey?: string }): (target: any, propertyKey: string) => void {
  return function (target: any, propertyKey: string): void {
    if (!target.constructor.relations) {
      target.constructor.relations = {}
    }
    target.constructor.relations[propertyKey] = {
      type: 'belongsTo',
      relatedModel: relatedModel(),
      ...options,
    }
  }
}

export default class TweetHashtag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  public tweet_id!: number

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>

  @belongsTo(() => Tweet)
  public tweet!: BelongsTo<typeof Tweet>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}