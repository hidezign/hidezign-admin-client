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

export const urlValidator = (value: string): string | null => {
    if (!value) return null;

    try {
        new URL(value.trim().startsWith("http")
            ? value.trim()
            : "https://" + value.trim()
        );
        return null;
    } catch {
        return "Invalid URL format. Example: https://example.com";
    }
};

