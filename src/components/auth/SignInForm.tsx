// src/components/auth/SignInForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import { emailValidator, passwordValidator } from "@/utils/inputValidator";
import { camelCaseToReadable } from "@/utils/additonalFunc";
import { toast } from "sonner";
import { IoWarningOutline } from "react-icons/io5";
import { loginSuccess } from "@/Redux/Reducer/authReducer";
import { loginAdmin } from "@/API/admin.api";
import PageLoader from "../PageLoader";

type SignInFormData = {
    email: string;
    password: string;
};

type FormErrors = Partial<Record<keyof SignInFormData, string>>;

export default function SignInForm(): React.ReactElement {
    const dispatch = useDispatch<any>(); // replace `any` with AppDispatch from your store if available
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const [formData, setFormData] = useState<SignInFormData>({
        email: "",
        password: "",
    });
    const [formDataErr, setFormDataErr] = useState<FormErrors>({});

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SignInFormData) => {
        const value = e.target.value ?? "";

        let error: string | null = null;

        if (field === "email") {
            error = emailValidator(value);
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

        (Object.keys(formData) as Array<keyof SignInFormData>).forEach((field) => {
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
                    description: "Please accept before submitting the form.",
                    icon: <IoWarningOutline className="h-4 w-4" />,
                    duration: 5000,
                    classNames: {
                        description: "!text-black/80",
                    },
                });
                return;
            } else {
                submitSignInDetails();
            }
        }
    };

    const resetFunctions = () => {
        setFormData({
            email: "",
            password: "",
        });
        setFormDataErr({});
        setIsChecked(false);
    };

    const submitSignInDetails = async () => {
        try {
            setLoading(true);
            const response: any = await loginAdmin(formData); // type to be replaced with API response type
            if (response?.success) {
                dispatch(
                    loginSuccess({
                        token: response?.user?.token,
                        role: response?.role,
                        user: response?.user,
                    })
                );
                toast.success("SignIn successful", {
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            } else {
                // handle explicit failure response
                toast.error("SignIn failed", {
                    description: response?.message || "Failed to sign in. Please try again.",
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
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                Sign In
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter your email and password to sign in!
                            </p>
                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
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

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={isChecked} onChange={(checked: boolean) => setIsChecked(checked)} />
                                            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">Keep me logged in</span>
                                        </div>
                                        <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div>
                                        <Button className="w-full" size="sm">
                                            Sign in
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-5">
                                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                                        Sign Up
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
