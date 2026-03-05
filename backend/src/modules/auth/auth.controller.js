import { asyncHandler } from '../../common/utils/async.handler.js';
import { sendResponse } from '../../common/utils/response.js';

/**
 * Controller for authentication endpoints.
 */
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Handles user registration.
   */
  register = asyncHandler(async (req, res) => {
    const { email, password, phone, role } = req.body;
    const { user, token } = await this.authService.register({ email, password, phone, role });

    sendResponse(res, 201, { user, token }, 'User registered successfully');
  });

  /**
   * Handles user login.
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await this.authService.login(email, password);

    sendResponse(res, 200, { user, token }, 'User logged in successfully');
  });
}
