// Membuat aplikasi login menggunakan google

const express = require('express'); // Membuat web server
const session = require('express-session'); // Membuat sessionnya
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Pake passport google

const app = express(); // Variable untuk mendapatkan object express

app.use(session({ // Integrasi session
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}))

app.set('view engine', 'ejs'); // Template view engine ejs

app.use(passport.initialize()); //Inisiasi passport
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            // Dari client json yang di download di google console
            clientID: "",
            clientSecret: "",
            callbackURL: "",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

// Integrasi session ke passport 
// Membuat session
passport.serializeUser((user, done) => { 
    done(null, user);
});
// Hapus session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/', (req, res) => { // Default cloud
    res.render('index'); // Menampilkan index
});

// Membuat views index.ejs

app.get('/auth/google', // Disini link yang tadi /auth/google
    passport.authenticate('google', { // Membuat authentication di google
        scope: ['profile', 'email'], // Minta informasi profile dan email yang kita request di google console
        prompt: 'select_account', // Memberikan prompt mau login dengan account yang mana
    })
);

app.get( 
    "/auth/google/callback", 
    passport.authenticate("google", {failureRedirect: '/'}), // Kalau gagal diarahkan ke url root
    (req, res) => {
        res.redirect("/profile"); // Kalau berhasil login ke profile
    }
);

app.get('/profile', (req, res) => { // Setelah masuk ke profile
    if (!req.isAuthenticated()) { // Dicek lagi berhasil login atau tidak
        return res.redirect('/auth/google'); // Diminta login jika belum berhasil
    }
    res.render("profile", { user: req.user }); // Render profile, object usernya dikirim
});

// Setelah ini buat profile.ejs di views

app.get('/logout', (req, res) => {
    req.logout(err => { // Req logout
        if (err) return next(err); // Kalau error muncul error
        res.redirect('/'); // Kalau berhasil balik ke index
    });
});

app.listen(3000, () => { // Menjalankan server di port 3000
    console.log('Server is running on port 3000');
});