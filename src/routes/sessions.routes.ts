import { Router } from 'express';
import AuthenticationUserService from '../services/AuthenticationUserService';

const sessionsRouter = Router();
// Responsabilidade das rotas: Receber uma info, chamar outro arquivos, e devolver o resultado

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticationUser = new AuthenticationUserService();

  const { user, token } = await authenticationUser.execute({
    email,
    password,
  });

  delete user.password;
  return response.json({ user, token });
});

export default sessionsRouter;
