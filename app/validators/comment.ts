import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
    vine.object({
  content: vine.string().minLength(1).maxLength(5280),
})
)