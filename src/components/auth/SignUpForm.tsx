// src/components/auth/SignUpForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { IoWarningOutline } from "react-icons/io5";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { emailValidator, nameValidator, passwordValidator } from "../../utils/inputValidator";
import { camelCaseToReadable } from "../../utils/additonalFunc";
import { toast } from "sonner";
import PageLoader from "../PageLoader";
import { signUpAdmin } from "@/API/admin.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/Redux/Reducer/authReducer";

type SignUpFormData = {
    username: string;
    email: string;
    password: string;
};

type FormErrors = Partial<Record<keyof SignUpFormData, string>>;

export default function SignUpForm(): React.ReactElement {
    const dispatch = useDispatch<any>(); // replace `any` with your AppDispatch if available
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const [formData, setFormData] = useState<SignUpFormData>({
        username: "",
        email: "",
        password: "",
    });
    const [formDataErr, setFormDataErr] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SignUpFormData) => {
        const value = e.target.value ?? "";

        let error: string | null = null;

        if (field === "email") {
            error = emailValidator(value);
        } else if (field === "username") {
            error = nameValidator(value);
        } else if (field === "password") {
            error = passwordValidator(value);
        }

        setFormDataErr((prev) => ({
            ...prev,
            [field]: error || "",
        }));

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateFields = (): boolean => {
        let isValid = true;
        const errors: FormErrors = { ...formDataErr };

        (Object.keys(formData) as Array<keyof SignUpFormData>).forEach((field) => {
            const value = formData[field];
            if (!value || String(value).trim() === "") {
                errors[field] = `${camelCaseToReadable(String(field))} can't be empty.`;
                isValid = false;
            } else {
                errors[field] = "";
            }
        });

        setFormDataErr(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateFields();
        if (isValid) {
            if (!isChecked) {
                toast("Terms Not Accepted", {
                    description: "Please accept the Terms of Service before submitting the form.",
                    icon: <IoWarningOutline className="h-4 w-4" />,
                    duration: 5000,
                    classNames: {
                        description: "!text-black/80",
                    },
                });
                return;
            } else {
                submitSignUpDetails();
            }
        }
    };

    const resetFunctions = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
        });
        setFormDataErr({});
        setIsChecked(false);
    };

    const submitSignUpDetails = async () => {
        try {
            setLoading(true);
            const response: any = await signUpAdmin(formData); // type `any` because API types are unknown here
            if (response?.success) {
                dispatch(
                    loginSuccess({
                        token: response?.user?.token,
                        role: response?.role,
                        user: response?.user,
                    })
                );
                toast.success("SignUp successful", {
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            } else {
                // handle explicit failure response
                toast.error("SignUp failed", {
                    description: response?.message || "Failed to sign up. Please try again.",
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            }
        } catch (err: unknown) {
            console.error(err);
            const anyErr = err as any;
            toast.error("Submission Failed", {
                description:
                    anyErr?.response?.data?.message ||
                    anyErr?.message ||
                    "Failed to submit details. Please try again later.",
                duration: 5000,
                className: "bg-card text-card-foreground border-border",
            });
        } finally {
            setLoading(false);
            resetFunctions();
            navigate("/");
        }
    };

    return (
        <>
            {loading && <PageLoader />}
            <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                Sign Up
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter your email and password to sign up!
                            </p>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-5">
                                    {/* Username */}
                                    <div className="sm:col-span-1">
                                        <Label>
                                            Username
                                            <span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Enter your username"
                                            value={formData.username}
                                            onChange={(e) => handleChange(e, "username")}
                                            error={Boolean(formDataErr.username)}
                                            required={true}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label>
                                            Email
                                            <span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleChange(e, "email")}
                                            error={Boolean(formDataErr.email)}
                                            required={true}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <Label>
                                            Password
                                            <span className="text-error-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={(e) => handleChange(e, "password")}
                                                error={Boolean(formDataErr.password)}
                                                required={true}
                                            />
                                            <span
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex items-center gap-3">
                                        <Checkbox className="w-5 h-5" checked={isChecked} onChange={(checked: boolean) => setIsChecked(checked)} />
                                        <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                            By creating an account means you agree to the{" "}
                                            <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span> and our{" "}
                                            <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-5">
                                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
