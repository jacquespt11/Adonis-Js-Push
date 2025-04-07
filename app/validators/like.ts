import vine from '@vinejs/vine'

export const createLikeValidator = vine.compile(
    vine.object({
        tweet_Id: vine.string().trim().uuid(),
    })
)
export class LikeValidator {
    public messages = {
        'tweet_Id.required': 'Le tweet est requis',
        'tweet_Id.uuid': 'Le tweet doit être un UUID valide',
    };
}