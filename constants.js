exports.constants = {
    // HTTP Status Codes
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // Roles
    ADMIN_ROLE: "admin",
    USER_ROLE: "user",

    // JWT
    TOKEN_EXPIRATION_TIME: 10 * 60 * 1000, // 10 minutes
    JWT_EXPIRATION_TIME: "30d",

    // Pagination
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,

    // Environments
    NODE_ENV_DEV: "development",
    NODE_ENV_PROD: "production",
    NODE_ENV_TEST: "test",
};