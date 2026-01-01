export default function generateEmailHTML({ code, registration = false }: { code: string, registration: boolean }) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Login Verification Code</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                }
                .container {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                .code-box {
                    margin: 30px auto;
                    padding: 20px 30px;
                    background-color: #f3f4f6;
                    border-radius: 12px;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    display: inline-block;
                }
                .logo {
                    width: 80px;
                    height: auto;
                    margin-bottom: 30px;
                }
                a {
                    color: #2563eb;
                    text-decoration: none;
                }
                .signature {
                    margin-top: 40px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">

                <h1>MarkADay Login Verification Code</h1>

                <p>
                    A recent login attempt was made on <a href="https://markaday.com">MarkADay</a> using your email address.
                    If you initiated this request, please use the verification code below to complete the login process: ${code}
                </p>

                <div class="code-box">${code}</div>

                <p>
                    If you did not attempt to log in, you can safely ignore this email.
                    Please do not share this one-time verification code with anyone.
                </p>

                <div class="signature">
                    Sent from <a href="https://markaday.com">MarkADay</a> for email verification.
                </div>
            </div>
        </body>
    </html>

    `
}