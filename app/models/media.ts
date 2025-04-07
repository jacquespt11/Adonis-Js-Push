import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
//import type { BelongsTo } from '@adonisjs/lucid/types/relations'
//import Tweet from './tweet.js'
//import User from './user.js'
import Like from './like.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

/*function belongsTo(relatedModel: () => typeof BaseModel, options?: { foreignKey?: string }): (target: any, propertyKey: string) => void {
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
}*/
function hasMany(relatedModel: () => typeof BaseModel, options?: { foreignKey?: string }): (target: any, propertyKey: string) => void {
  return function (target: any, propertyKey: string): void {
    if (!target.constructor.relations) {
      target.constructor.relations = {}
    }
    target.constructor.relations[propertyKey] = {
      type: 'hasMany',
      relatedModel: relatedModel(),
      ...options,
    }
  }
}

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare tweet_id: number

  @column()
  declare file_path: string

  @column()
  declare file_type: string

  @column()
  declare file_size: number
  
  @column()
  declare file_name: string

  @column()
  declare file_extension: string

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>
  declare likeCount: number

  @column()
  declare url: string

 // @belongsTo(() => Tweet)
 // declare tweet: BelongsTo<typeof Tweet>

 // @belongsTo(() => User)
  //declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}