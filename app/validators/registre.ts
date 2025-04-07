import vine from '@vinejs/vine'

export const Registre = vine.compile(
    vine.object({
      username: vine.string().trim().minLength(3).maxLength(20),
      email: vine.string().trim().email(),
      password: vine.string().trim().minLength(8).maxLength(20),
    })
)

export class RegistreValidator {
  public messages = {
    'username.required': 'Le nom d\'utilisateur est requis',
    'username.min': 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    'username.max': 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères',
    'email.required': 'L\'adresse email est requise',
    'email.email': 'L\'adresse email est invalide',
    'password.required': 'Le mot de passe est requis',
    'password.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'password.max': 'Le mot de passe ne doit pas dépasser 20 caractères',
  };
}