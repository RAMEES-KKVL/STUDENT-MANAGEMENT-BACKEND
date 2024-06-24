let randomOTP: number;

export default {
    otpGenerator : ()=>{
        // Generating a random number between 0 and 9999
        randomOTP = Math.floor(Math.random() * 10000)
        if ( randomOTP < 1000 ) {
            return randomOTP = randomOTP + 1000
        } else {
            return randomOTP
        }   
    },

    otpValidator : (otp : number): boolean=>{
        // Comparing the user-entered OTP with the generated OTP
        if ( otp == randomOTP ) {
            return true
        } else {
            return false
        }
    }
}
    

