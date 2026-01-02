// modules imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
// files imports
import User from '../../../DB/models/user.model.js';
import sendEmailService from '../../services/Send-mail.service.js';


// ======================= signUp api ========================= //

/* 
    // 1- destructing the required data from the request body
    // 2- check if user is already exist in database using the email 
    // 3 - sending confirmation email to the user
        // 3.1 - check if the email is sent successfully
    // 4 - save the password hashed
    // 5 - creating a new user document in the database
    // 5.1 - save the created User in the request object for rollback in case of error
    // 5.2 - check if the user is created successfully
    // 6- return the response
*/

export const signUp = async (req, res, next) => {
    // 1- destructing the required data from the request body
    const {
        userName,
        email,
        password,
        phoneNumbers,
        addresses,
        role,
        age,
        gender
    } = req.body;
    // 2- check if user is already exist in database using the email 
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return next({ message: 'email is already exist , please try to login', cause: 409 });
    }

    // 3 - sending confirmation email to the user
    const userToken = jwt.sign({ email }, process.env.JWT_SECRET_VEREFICATION, { expiresIn: '30m' });
    const isEmailSent = await sendEmailService({
        to: email,
        subject: 'Email verification',
        message: `<section style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="width: 50%; background-color: rgba(128, 128, 128,0.3); height: 20vh; border-radius: .625rem; text-align: center;">
            <h2 style=" color: black; text-shadow: 7px 7px 5px  white;display:block;font-size:25px;">Please click the link to verify your account</h2>
            <a style="text-decoration: none; font-size: 20px; " href='http://localhost:3000/auth/verify-email?token=${userToken}'>Verify Account</a>
        </div>
    </section>`
    })
    // 3.1 - check if the email is sent successfully
    if (!isEmailSent) {
        return next({ message: 'unable to send email , please try again later', cause: 500 });
    }
    // 4 - save the password hashed
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    // 5 - creating a new user document in the database
    const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
        phoneNumbers,
        addresses,
        role,
        age,
        gender
    })
    // 5.1 - save the created User in the request object for rollback in case of error
    req.savedDocument = { model: User, _id: newUser._id };
    // 5.2 - check if the user is created successfully
    if (!newUser) {
        return next({ message: 'unable to create user', cause: 500 });
    }
    // 6- return the response
    return res.status(201).json({
        success: true,
        message: 'user created successfully , please check your email to verify your account',
        data: newUser
    })
}

// ====================== verify the email ======================== //

/*
    // 1- destructing the user token from the request query
    // 2 - verify user token
    // 3 - get user by email with isEmailVerified = false
    // 4 - check if the user has found
    // 5 - return the response
*/

export const verifyEmail = async (req, res, next) => {
    // 1- destructing the user token from the request query
    const { token } = req.query;
    // 2 - verify user token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_VEREFICATION);
    // 3 - get user by email with isEmailVerified = false
    const findUser = await User.findOneAndUpdate({ email: decodedData.email, isEmailVerified: false }, { isEmailVerified: true }, { new: true });
    // 4 - check if the user has found
    if (!findUser) {
        return next(new Error(`user not foud`, { cause: 404 }));
    }
    // 5 - return the response
    res.status(200).json({
        success: true,
        message: 'email verified successfully , please try to login'
    })
}

// ==================== signIn api ================================ //

/*
    // 1- destructing the required data from the request body
    // 2 - check if user is exist in database using the email
        // 2.1 - check if the user is found
    // 3 - compare password with hashed password
        // 3.1 - check if the password is correct
    // 4 - create tokens
    // 5 - create flag for loggedIn User
    // 6 - save the changes 
    // 7 - return the response
*/

export const signIn = async (req, res, next) => {
    // 1- destructing the required data from the request body
    const { email, password } = req.body;
    // 2 - check if user is exist in database using the email
    const userFound = await User.findOne({ email, isEmailVerified: true, isAccountDeleted: false });
    // 2.1 - check if the user is found
    if (!userFound) {
        return next({ message: 'Invalid login credentials or email is not verified', cause: 404 });
    }
    // 3 - compare password with hashed password
    const verifyPass = bcrypt.compareSync(password, userFound.password);
    // 3.1 - check if the password is correct
    if (!verifyPass) {
        return next({ message: 'Incorrect password', cause: 401 });
    }
    // 4 - create tokens
    const userToken = jwt.sign({ email, id: userFound._id, loggedIn: true }, process.env.JWT_SECRET_LOGIN, { expiresIn: '30m' });
    const refreshToken = jwt.sign({email, id: userFound._id, loggedIn: true }, process.env.JWT_SECRET_LOGIN, { expiresIn: '1y' });
    // 5 - create flag for loggedIn User
    userFound.isloggedIn = true;
    // 6 - update some user's data
    userFound.refreshToken = refreshToken;
    userFound.status = 'online';
    // 6 - save the changes 
    await userFound.save();
    // 7 - return the response
    return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken: userToken
        }
    })
}

// ============================== forget password ==================== //
/*
    // 1 - destructing user email
    // 2 - check if the user is found
    // 3 - generate unique and random code
    // 4 - hashing the generated code 
    // 5 - generate token to send it with the email
    // 6 - creating the reset password link
    // 7 - send the email to the user
    // 8 - check if the email is sent or not
    // 9 - update the user data
    // 10 - return the response
*/
export const forgetPassword = async (req, res, next) => {
    // 1 - destructing user email
    const { email } = req.body;
    // 2 - check if the user is found
    const user = await User.findOne({ email });
    if (!user) {
        return next({ message: 'Invalid Email', cause: 400 });
    }
    // 3 - generate unique and random code
    const code = nanoid();
    // 4 - hashing the generated code 
    const hashedCode = bcrypt.hashSync(code, +process.env.SALT_ROUNDS);
    // 5 - generate token to send it with the email
    const token = jwt.sign({ email, sentCode: hashedCode }, process.env.RESET_TOKEN, { expiresIn: '30m' });
    // 6 - creating the reset password link
    const resetPasswordLink = `${req.protocol}://${req.headers.host}/auth/reset/${token}`;
    // 7 - send the email to the user
    const isEmailSent = sendEmailService({
        to: email,
        subject: 'Reset Password',
        message: `<section style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="width: 50%; background-color: rgba(128, 128, 128,0.3); height: 20vh; border-radius: .625rem; text-align: center;">
            <h2 style=" color: black; text-shadow: 7px 7px 5px  white;display:block;font-size:25px;">Please click the link to verify your account</h2>
            <a style="text-decoration: none; font-size: 20px; " href='${resetPasswordLink}'>Click To Reset Your Password</a>
        </div>
    </section>`
    })
    // 8 - check if the email is sent or not
    if (!isEmailSent) {
        return next({ message: 'Fail To Send Reset Password Email', cause: 400 });
    }
    // 9 - update the user data
    const userUpdates = await User.findOneAndUpdate({ email }, {
        ResetPasswordOTP: hashedCode
    }, { new: true });
    // 10 - return the response
    res.status(200).json({
        success: true,
        message: 'Reset Mail Sent Successfully, Try To Login',
        data: userUpdates
    })
}


// ================================= reset password ==================== //
/*
    // 1 - destructing the reset token from the params
    // 2 - decode the token to verify the data
    // 3 - find the user using the email and the reset otp
    // 4 - destructing the new password from the body
    // 5 - hash the new password
    // 6 - update the user's data
    // 7 - save the updated data
    // 8 - return the response
*/
export const resetPassword = async (req, res, next) => {
    // 1 - destructing the reset token from the params
    const { token } = req.params;
    // 2 - decode the token to verify the data
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN);
    // 3 - find the user using the email and the reset otp
    const user = await User.findOne({ email: decodedToken?.email, ResetPasswordOTP: decodedToken?.sentCode });
    if (!user) {
        return next({ message: 'You Already Reset Your Password', cause: 400 })
    }
    // 4 - destructing the new password from the body
    const { newPassword } = req.body;
    // 5 - hash the new password
    const newPassHashed = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);
    // 6 - update the user's data
    user.password = newPassHashed;
    user.ResetPasswordOTP = null;
    // 7 - save the updated data
    await user.save();
    // 8 - return the response
    res.status(200).json({
        success: true,
        message: 'The Password Reset Done Successfully'
    })
}


// =============================== get new access token ===================== //
/** */

// export const getNewAccessToken = async (req,res,next)=>{
//     // 1 - destructing the refresh token from the headers
//     const {id} = req.authUser;
//     // 2 - fetch the user document by using the refresh token to check if it's still valid
//     const user = await User.findById(id);
//     if(!user){
//         return next({message:'Invalid Refresh Token',cause:400});
//     }

//     // 3 - create new tokens
//     const userToken = jwt.sign({ email, id: user._id, loggedIn: true }, process.env.JWT_SECRET_LOGIN, { expiresIn: '30m' });
//     const refreshToken = jwt.sign({ id: user._id, loggedIn: true }, process.env.JWT_REFRESH_SECRET_LOGIN, { expiresIn: '1y' });

//     user.refreshToken = refreshToken;

//     await user.save();

//     // return the response 
//     res.status(200).json({
//         success:true,
//         data:{
//             newAccessToken:userToken
//         }
//     })
// }