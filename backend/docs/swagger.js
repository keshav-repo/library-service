/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Authentication operations
 *   - name: users
 *     description: User operations
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Log in
 *     description: Authenticate and get an access token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

// Add more Swagger annotations for other API endpoints

