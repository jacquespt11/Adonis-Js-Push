import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Assure-toi que les chemins des imports sont corrects
import User from './user.js'
import Tweet from './tweet.js'
import Media from './media.js'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare tweet_id: number

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Tweet, { foreignKey: 'tweet_id' })
  declare tweet: BelongsTo<typeof Tweet>

  @belongsTo(() => Media, { foreignKey: 'media_id' })
  declare media: BelongsTo<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
