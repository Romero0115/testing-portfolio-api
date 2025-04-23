const pool = require('../database.js');
const bcrypt = require('bcryptjs');



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
        const result = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                toastText: "toastWrongUser"
            });
        }

        const user = result.rows[0];

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
        const userCheck = await pool.query('SELECT * FROM customer WHERE email = $1', [normalizedEmail]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ toastText: 'toastEmailExists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO customer (name, email, password) VALUES ($1, $2, $3)',
            [name, normalizedEmail, hashedPassword]
        );

        return res.status(201).json({ toastText: 'toastSignupSuccess' });

    } catch (error) {
        console.error('Error en signup:', error);
        return res.status(500).json({ toastText: 'toastSignupError' });
    }
};



module.exports = { login, signup };
