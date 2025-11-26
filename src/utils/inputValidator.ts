// src/utils/validators.ts

export interface ProductImages {
    mainImage?: unknown;
    leftSideImage?: unknown;
    rightSideImage?: unknown;
    topViewImage?: unknown;
    bottomViewImage?: unknown;
    backImage?: unknown;
    benefitsImage?: unknown;
    highlightImage?: unknown;
    otherImage?: unknown;
}

/**
 * Validates the password input to ensure it is not empty and meets the minimum length requirement.
 */
export function passwordValidator(password: string | undefined | null): string {
    if (!password) return "Password can't be empty.";

    // Minimum length requirement
    if (password.length < 8) return "Password must be at least 8 characters long.";

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";

    // Check for at least one digit
    if (!/[0-9]/.test(password)) return "Password must contain at least one digit.";

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return "Password must contain at least one special character.";

    return "";
}

export function confirmPasswordValidator(
    password: string | undefined | null,
    confirmPassword: string | undefined | null
): string {
    if (!confirmPassword) return "Confirm Password can't be empty.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
}

export function nameValidator(name: string | undefined | null): string {
    if (!name) return "Name can't be empty.";
    return "";
}

export function alphabetValidator(value: string | undefined | null): string {
    if (!value) return "This field can't be empty.";
    if (!/^[A-Za-z]+$/.test(value)) return "Only alphabetic characters are allowed.";
    return "";
}

export function emailValidator(email: string | undefined | null): string {
    const re = /\S+@\S+\.\S+/;
    if (!email) return "Email can't be empty.";
    if (!re.test(email)) return "Oops! We need a valid email address.";
    if (email.indexOf(" ") !== -1) return "Email cannot contain spaces.";
    return "";
}

/**
 * phone can be string or number, required default true
 */
export function phoneValidator(phone?: string | number | null, required = true): string {
    if ((phone === undefined || phone === null || phone === "") && required)
        return "Phone number can't be empty.";
    if (phone === undefined || phone === null || phone === "") return "";

    const phoneStr = String(phone).trim();
    if (!/^\d{10}$/.test(phoneStr)) return "Please enter a valid 10-digit phone number.";
    return "";
}

/**
 * OTP validator expects a 6-digit numeric OTP
 */
export function otpValidator(otp?: string | number | null): string {
    if (otp === undefined || otp === null || otp === "") return "OTP can't be empty.";
    const otpStr = String(otp).trim();
    if (!/^\d{6}$/.test(otpStr)) return "OTP must be a 6-digit number.";
    return "";
}

export function fieldValidator(value: unknown, required = true): string {
    if (required && (value === undefined || value === null || value === "")) return "This Field can't be empty.";
    return "";
}

export function tagValidator(tags?: string | null): string {
    if (!tags) return "This Field can't be empty.";
    // split by comma and ignore empty items produced by extra commas
    const tagCount = tags.split(",").filter(t => t.trim() !== "").length;
    if (tagCount > 15) return "Max 15 tags allowed";
    return "";
}

export function imagesValidator(images: ProductImages | undefined | null): string {
    if (!images) return "Please upload all the images.";

    const requiredKeys: (keyof ProductImages)[] = [
        "mainImage",
        "leftSideImage",
        "rightSideImage",
        "topViewImage",
        "bottomViewImage",
        "backImage",
        "benefitsImage",
        "highlightImage",
        "otherImage",
    ];

    for (const key of requiredKeys) {
        if (!images[key]) return "Please upload all the images.";
    }

    return "";
}

export function numberValidator(
    value: string | number | undefined | null,
    limit?: number,
    required = true
): string {
    if ((value === undefined || value === null || value === "") && required) return "This field can't be empty.";
    if (value === undefined || value === null || value === "") return "";

    const num = typeof value === "number" ? value : Number(String(value).trim());
    if (Number.isNaN(num)) return "Please enter a valid number.";
    if (num < 0) return "This field can't be negative.";
    if (limit !== undefined && num > limit) return `Number can't be more than ${limit}.`;
    return "";
}

export function pincodeValidator(pincode?: string | number | null, required = true): string {
    if ((pincode === undefined || pincode === null || pincode === "") && required) return "Pincode can't be empty.";
    if (pincode === undefined || pincode === null || pincode === "") return "";

    const pinStr = String(pincode).trim();
    if (!/^\d+$/.test(pinStr)) return "Pincode must contain only numeric digits.";
    if (!/^\d{6}$/.test(pinStr)) return "Please enter a valid 6-digit pincode.";
    return "";
}

export function gstValidator(gstNumber?: string | null): string {
    if (!gstNumber) return "GST number can't be empty.";

    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
    if (!gstPattern.test(gstNumber)) return "Please enter a valid GST number.";
    return "";
}

export function panValidator(panNumber?: string | null): string {
    if (typeof panNumber !== "string" || !panNumber.trim()) {
        return "PAN number can't be empty.";
    }
    const pan = panNumber.trim().toUpperCase();
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(pan)) return "Please enter a valid PAN number.";
    return "";
}

/**
 * Validates an Indian IFSC code.
 */
export function ifscValidator(ifsc?: string | null): string {
    if (!ifsc) return "IFSC code can't be empty.";
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(ifsc)) return "Please enter a valid IFSC code.";
    return "";
}

/**
 * Latitude and longitude validators accept string or number.
 */
export function validateLatitude(latitude?: string | number | null): string {
    if (latitude === undefined || latitude === null || latitude === "") return "Latitude can't be empty.";

    const latNum = typeof latitude === "number" ? latitude : parseFloat(String(latitude).trim());
    if (Number.isNaN(latNum)) return "Latitude must be a number.";
    if (latNum < -90 || latNum > 90) return "Latitude must be between -90 and 90.";
    if (!/^-?\d*\.?\d+$/.test(String(latitude).trim())) return "Latitude must be a valid number (integer or float).";
    return "";
}

export function validateLongitude(longitude?: string | number | null): string {
    if (longitude === undefined || longitude === null || longitude === "") return "Longitude can't be empty.";

    const lonNum = typeof longitude === "number" ? longitude : parseFloat(String(longitude).trim());
    if (Number.isNaN(lonNum)) return "Longitude must be a number.";
    if (lonNum < -180 || lonNum > 180) return "Longitude must be between -180 and 180.";
    if (!/^-?\d*\.?\d+$/.test(String(longitude).trim())) return "Longitude must be a valid number (integer or float).";
    return "";
}

/* ----------------- Banking / UPI validators ----------------- */

export function accountHolderNameValidator(accountHolderName?: string | null): string {
    if (!accountHolderName) return "Account Holder Name can't be empty.";
    return "";
}

export function accountNumberValidator(accountNumber?: string | number | null): string {
    if (accountNumber === undefined || accountNumber === null || accountNumber === "") return "Account Number can't be empty.";
    const accStr = String(accountNumber).trim();
    const isValidAccountNumber = /^\d{9,16}$/; // between 9 and 16 digits
    if (!isValidAccountNumber.test(accStr)) return "Account Number must be between 9 and 16 digits.";
    return "";
}

export function ifscCodeValidator(ifscCode?: string | null): string {
    if (!ifscCode) return "IFSC Code can't be empty.";
    const isValidIfsc = /^[A-Za-z]{4}0[A-Za-z0-9]{5}$/;
    if (!isValidIfsc.test(ifscCode)) return "Invalid IFSC Code.";
    return "";
}

export function branchValidator(branch?: string | null): string {
    if (!branch) return "Branch can't be empty.";
    return "";
}

export function bankNameValidator(bankName?: string | null): string {
    if (!bankName) return "Bank Name can't be empty.";
    return "";
}

export function upiHolderNameValidator(upiHolderName?: string | null): string {
    if (!upiHolderName) return "UPI Holder Name can't be empty.";
    return "";
}

export function upiAddressValidator(upiAddress?: string | null): string {
    if (!upiAddress) return "UPI Address can't be empty.";
    return "";
}

export function upiQrCodeValidator(qrCode?: { name?: string } | null): string {
    if (qrCode && qrCode.name && !/\.(jpg|jpeg|png)$/i.test(qrCode.name)) return "QR Code must be an image file (jpg, jpeg, or png).";
    return "";
}
