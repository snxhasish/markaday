import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

function generateJWT(email: string, extraPayload = {}) {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined.");
    }

    return jwt.sign(
        {
            email,
            ...extraPayload,
            iat: Math.floor(Date.now() / 1000),
        },
        secretKey,
        {
            expiresIn: "28d",
            algorithm: "HS256",
        }
    );
}

export default generateJWT