import vine from '@vinejs/vine'      

    export const CreateTweetValidator = vine.compile(
        vine.object({
    content: vine.string().minLength(1).maxLength(5280),
    })
)