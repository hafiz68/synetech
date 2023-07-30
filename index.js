const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Email = require('./models/email');
const User = require('./models/user');
const passport = require('./auth/passport');
const { secretKey } = require('./config/jwtConfig');
const { user } = require('./models/user');
const { email } = require('./models/email');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const mailgun = require('mailgun-js')({ apiKey: process.env.MAIL_GUN_KEY, domain: process.env.MAIL_GUN_DOMAIN });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(passport.initialize());

const authenticateJWT = passport.authenticate('jwt', { session: false });

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({ username, password });
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/send', authenticateJWT, (req, res) => {
    const { to, subject, text } = req.body;

    const data = {
        from: 'your@email.com',
        to,
        subject,
        text,
    };

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent:', body);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

app.post('/webhook', (req, res) => {
    const { from, subject, body, 'Message-Id': messageId } = req.body;

    Email.create({
        messageId,
        sender: from,
        subject,
        body,
    })
        .then(() => {
            res.status(200).send('Email received successfully');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error saving email to the database');
        });
});

sequelize.authenticate()

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("App listening at " + PORT);
    });
}).catch(err => {
    console.log(err);
});