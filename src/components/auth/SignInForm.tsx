import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
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

export default function SignInForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [formDataErr, setFormDataErr] = useState({});

    const [loading, setLoading] = useState(false);

    const handleChange = (e, field) => {
        const { value } = e.target;

        let error = null;

        if (field === "email") {
            error = emailValidator(value);
        } else if (field === "password") {
            error = passwordValidator(value);
        }

        setFormDataErr({
            ...formDataErr,
            [field]: error,
        });

        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const validateFields = () => {
        let isValid = true;
        let errors = { ...formDataErr };

        Object.keys(formData).forEach((field) => {
            if (!formData[field]) {
                errors[field] = `${camelCaseToReadable(field)} can't be empty.`;
                // console.log("false ho gaya")
                isValid = false;
            } else {
                errors[field] = "";
            }
        });
        // console.log(errors, isValid);
        setFormDataErr(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
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
                submitSignUpDetails();
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

    const submitSignUpDetails = async () => {
        try {
            setLoading(true);
            const response = await loginAdmin(formData);
            if (response?.success) {
                dispatch(
                    loginSuccess({
                        token: response?.user?.token,
                        role: response?.role,
                        user: response?.user,
                    })
                );
                toast.success("SignUp successfull", {
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Submission Failed", {
                description:
                    error?.response?.data?.message ||
                    "Failed to submit details. Please try again later.",
                duration: 5000,
                className: "bg-card text-card-foreground border-border",
            });
        } finally {
            navigate("/");
            resetFunctions();
            setLoading(false);
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
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="space-y-6">
                                    <div>
                                        <Label>
                                            Email
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            onChange={(e) =>
                                                handleChange(e, "email")
                                            }
                                            error={formDataErr.email}
                                            required={true}
                                        />
                                    </div>
                                    {/* <!-- Password --> */}
                                    <div>
                                        <Label>
                                            Password
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter your password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    handleChange(e, "password")
                                                }
                                                error={formDataErr.password}
                                                required={true}
                                            />
                                            <span
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
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
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={setIsChecked}
                                            />
                                            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                                Keep me logged in
                                            </span>
                                        </div>
                                        <Link
                                            to="/reset-password"
                                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
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
                                    Don&apos;t have an account? {""}
                                    <Link
                                        to="/signup"
                                        className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
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
