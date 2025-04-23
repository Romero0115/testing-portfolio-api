import sql from '../database.js';
import bcrypt from 'bcryptjs';



const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};



const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql`
            SELECT * FROM customer WHERE email = ${email}
        `;

        if (result.length === 0) {
            return res.status(401).json({
                toastText: "toastWrongUser"
            });
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                toastText: "toastWrongPassword"
            });
        }

        return res.status(200).json({
            toastText: "toastLoginSuccess"
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            toastText: "toastLoginError"
        });
    }
};



const signup = async (req, res) => {
    const { email, password, name } = req.body;

    const normalizedEmail = email.toLowerCase();

    if (!validateName(name)) {
        return res.status(400).json({ toastText: 'toastInvalidName' });
    }

    if (!validateEmail(normalizedEmail)) {
        return res.status(400).json({ toastText: 'toastInvalidEmail' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ toastText: 'toastWeakPassword' });
    }

    try {
        const userCheck = await sql`
            SELECT * FROM customer WHERE email = ${normalizedEmail}
        `;

        if (userCheck.length > 0) {
            return res.status(400).json({ toastText: 'toastEmailExists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await sql`
            INSERT INTO customer (name, email, password) 
            VALUES (${name}, ${normalizedEmail}, ${hashedPassword})
        `;

        return res.status(201).json({ toastText: 'toastSignupSuccess' });

    } catch (error) {
        console.error('Error en signup:', error);
        return res.status(500).json({ toastText: 'toastSignupError' });
    }
};

export { login, signup };

