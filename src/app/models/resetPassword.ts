export interface ResetPassword {
    resetToken: any;
    resetUrl: string;
    email: string;
}

export interface ResetConfirmPassword {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}