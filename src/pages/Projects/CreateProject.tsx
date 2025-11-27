// src/pages/Projects/CreateProject.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // prefer react-router-dom for hooks typing
import { toast } from "sonner";

import { createProject, getProjectDetails, updateProject } from "@/API/admin.api";
import ComponentCard from "@/components/common/ComponentCard";
import FileInput from "@/components/form/input/FileInput";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import PageLoader from "@/components/PageLoader";
import Button from "@/components/ui/button/Button";

import { camelCaseToReadable } from "@/utils/additonalFunc";
import { imageBase64Convertor } from "@/utils/convertToBase64";
import { fieldValidator, urlValidator } from "@/utils/inputValidator";
import { Link, useParams } from "react-router";

type ProjectForm = {
    projectTitle: string;
    projectDescription: string;
    liveUrl?: string;
    isActive: boolean;
    isShowHome: boolean;
    technologies?: string;
    image?: string; // base64 payload (without data:*;base64, prefix)
    file?: string; // base64 payload (pdf)
};

type FormErrors = Partial<Record<keyof ProjectForm, string>>;

const initialFormData: ProjectForm = {
    projectTitle: "",
    projectDescription: "",
    liveUrl: "",
    isActive: false,
    isShowHome: false,
    technologies: "",
    image: "",
    file: "",
};

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState<boolean>(false);

    const [formData, setFormData] = React.useState<ProjectForm>(initialFormData);
    const [formDataErr, setFormDataErr] = React.useState<FormErrors>({});
    const [project, setProject] = React.useState({} as any);

    React.useEffect(() => {
        fetchProjectDetails(id!);
    }, [id]);

    React.useEffect(() => {
        if (id && project) {
            setFormData({
                projectTitle: project?.title || "",
                projectDescription: project?.description || "",
                liveUrl: project?.liveUrl || "",
                isActive: project?.isActive || false,
                isShowHome: project?.isShowHome || false,
                technologies: project?.technologies?.join(", ") || "",
                image: project?.image || "",
                file: project?.file || "",
            });
        }
    }, [project]);



    const fetchProjectDetails = async (projectId: string) => {
        try {
            setLoading(true);
            const response = await getProjectDetails(projectId);
            if (response?.success) {
                setProject(response?.project);
            }
        } catch (error) {
            console.error("Failed to fetch project details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Generic field updater
    const handleChange = (
        eOrValue:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | string
            | boolean,
        field: keyof ProjectForm
    ) => {
        // Resolve raw value from event / string / boolean
        let value: ProjectForm[typeof field] = "" as any;

        if (typeof eOrValue === "boolean") {
            value = eOrValue as ProjectForm[typeof field];
        } else if (typeof eOrValue === "string") {
            value = eOrValue.trim() as ProjectForm[typeof field];
        } else if ("target" in eOrValue && eOrValue.target) {
            const target = eOrValue.target as HTMLInputElement | HTMLTextAreaElement;

            // If it's a file input, keep the File object (caller uses imageBase64Convertor separately)
            if ((target as HTMLInputElement).files && (target as HTMLInputElement).files!.length) {
                value = (target as HTMLInputElement).files![0] as any;
            } else {
                value = (target.value ?? "").trim() as ProjectForm[typeof field];
            }
        }

        // Validation
        let errorMessage = "";

        // liveUrl is optional — validate only when non-empty
        if (field === "liveUrl") {
            if (typeof value === "string" && value !== "") {
                const urlErr = urlValidator(String(value));
                errorMessage = urlErr ?? "";
            } else {
                errorMessage = "";
            }
        } else if (typeof value === "boolean") {
            // no validation for booleans
            errorMessage = "";
        } else {
            // For other string fields use fieldValidator (it should return string error or null/empty)
            errorMessage = fieldValidator(String(value ?? "")) || "";
        }

        // Update error state + form data
        setFormDataErr((prev) => ({
            ...prev,
            [field]: errorMessage,
        }));

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Validate all required fields; returns true if valid
    const validateFields = (): boolean => {
        let isValid = true;
        const errors: FormErrors = { ...formDataErr };

        // Helper to set error
        const setError = (field: keyof ProjectForm, message: string) => {
            errors[field] = message;
            isValid = false;
        };

        // projectTitle (required)
        if (!formData.projectTitle || String(formData.projectTitle).trim() === "") {
            setError("projectTitle", `${camelCaseToReadable("projectTitle")} can't be empty.`);
        } else {
            const e = fieldValidator(String(formData.projectTitle).trim());
            errors.projectTitle = e || "";
            if (e) isValid = false;
        }

        // projectDescription (required)
        if (!formData.projectDescription || String(formData.projectDescription).trim() === "") {
            setError("projectDescription", `${camelCaseToReadable("projectDescription")} can't be empty.`);
        } else {
            const e = fieldValidator(String(formData.projectDescription).trim());
            errors.projectDescription = e || "";
            if (e) isValid = false;
        }

        // liveUrl (optional — validate only when provided)
        if (formData.liveUrl && String(formData.liveUrl).trim() !== "") {
            const urlErr = urlValidator(String(formData.liveUrl).trim());
            if (urlErr) {
                setError("liveUrl", urlErr);
            } else {
                errors.liveUrl = "";
            }
        } else {
            errors.liveUrl = "";
        }

        // isActive / isShowHome (booleans) — always valid
        errors.isActive = "";
        errors.isShowHome = "";

        // technologies (optional) — if provided, run light validator (not required)
        if (formData.technologies && String(formData.technologies).trim() !== "") {
            const techErr = fieldValidator(String(formData.technologies).trim());
            errors.technologies = techErr || "";
            if (techErr) isValid = false;
        } else {
            errors.technologies = "";
        }

        // image (optional) — if provided must be a string (base64) otherwise ask user to convert
        if (formData.image) {
            if (typeof formData.image === "string") {
                // optional: you could validate base64 shape here, but keep simple
                errors.image = "";
            } else {
                setError("image", "Please upload/select an image (convert to base64 if using JSON).");
            }
        } else {
            errors.image = "";
        }

        // file (optional) — if provided must be a string (base64)
        if (formData.file) {
            if (typeof formData.file === "string") {
                errors.file = "";
            } else {
                setError("file", "Please upload/select a PDF file (convert to base64 if using JSON).");
            }
        } else {
            errors.file = "";
        }

        setFormDataErr(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateFields();
        if (isValid) {
            submitProjectDetails();
        }
    };

    const resetFunctions = () => {
        setFormData(initialFormData);
        setFormDataErr({});
        // setIsChecked(false);
    };

    const submitProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await createProject(formData);
            if (!response?.success) {
                toast.error("Project creation failed", {
                    description: response?.message || "Failed to create project. Please try again later.",
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            } else {
                resetFunctions();
                toast.success("Project created successfully", {
                    duration: 5000,
                    className: "bg-card text-card-foreground border-border",
                });
            }
        } catch (err: unknown) {
            console.error(err);
            // Narrow error to read axios-like response safely
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
            navigate("/projects");
        }
    };

    // File input handlers using imageBase64Convertor (which returns Promise<string|undefined>)
    const handleFileInput = (field: "image" | "file") =>
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const base64 = await imageBase64Convertor(e, () => { }) // second arg required but we want return value
                .catch(() => undefined);

            // imageBase64Convertor returns base64 payload (without data:*;base64,) or undefined
            setFormData((prev) => ({
                ...prev,
                [field]: base64 ?? "",
            }));
        };


    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateFields();
        if (isValid) {
            try {
                setLoading(true);

                const sanitizedData = { ...formData };

                // Remove non-base64 image/file
                if (typeof sanitizedData.image === "object") {
                    delete sanitizedData.image;
                }
                if (typeof sanitizedData.file === "object") {
                    delete sanitizedData.file;
                }

                const response = await updateProject(id!, sanitizedData);
                if (!response?.success) {
                    toast.error("Project updation failed", {
                        description: response?.message || "Failed to update project. Please try again later.",
                        duration: 5000,
                        className: "bg-card text-card-foreground border-border",
                    });
                } else {
                    resetFunctions();
                    toast.success("Project updated successfully", {
                        duration: 5000,
                        className: "bg-card text-card-foreground border-border",
                    });
                }
            } catch (err: unknown) {
                console.error(err);
                // Narrow error to read axios-like response safely
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
                navigate("/projects");
            }
        }
    }

    return (
        <>
            {loading && <PageLoader />}
            <ComponentCard title="Create Project" desc="Please fill in the details to create a new project.">
                <form method="post" onSubmit={id ? handleUpdate : handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                        {/* Project Title */}
                        <div className="flex flex-col">
                            <Label htmlFor="projectTitle">Project Title</Label>
                            <Input
                                type="text"
                                id="projectTitle"
                                placeholder="Enter project title"
                                value={formData.projectTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "projectTitle")}
                                error={Boolean(formDataErr?.projectTitle)}
                                hint={formDataErr?.projectTitle ?? ""}
                            />
                        </div>

                        {/* Project Description */}
                        <div className="flex flex-col row-span-2">
                            <Label htmlFor="projectDescription">Project Description</Label>
                            <TextArea
                                rows={6}
                                value={formData.projectDescription}
                                error={Boolean(formDataErr?.projectDescription)}
                                hint={formDataErr?.projectDescription ?? "Please provide a short description of the project."}
                                onChange={(value: string) => handleChange(value, "projectDescription")}
                                placeholder="Enter project description"
                            />
                        </div>

                        {/* Switches isActive & isShowHome */}
                        <div className="grid grid-cols-2 gap-4">
                            <Switch
                                label="Active Project"
                                defaultChecked={formData?.isActive ? true : false}
                                onChange={(checked: boolean) => {
                                    handleChange(checked, "isActive");
                                }}
                            />
                            <Switch
                                label="Show on homepage"
                                defaultChecked={formData?.isShowHome ? true : false}
                                onChange={(checked: boolean) => handleChange(checked, "isShowHome")}
                            />
                        </div>

                        {/* Live URL */}
                        <div className="flex flex-col">
                            <Label htmlFor="liveUrl">Live Link</Label>
                            <Input
                                type="url"
                                id="liveUrl"
                                placeholder="Enter live link"
                                value={formData.liveUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "liveUrl")}
                                error={Boolean(formDataErr?.liveUrl)}
                                hint={formDataErr?.liveUrl ?? "If the project is live, please provide the URL."}
                            />
                            {formData.liveUrl && (
                                <Link
                                    to={formData.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 text-sm text-blue-600 hover:underline"
                                >
                                    Visit Live Project
                                </Link>
                            )}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-col row-span-2">
                            <Label htmlFor="technologies">Technologies</Label>
                            <TextArea
                                rows={6}
                                value={formData.technologies}
                                error={Boolean(formDataErr?.technologies)}
                                hint={formDataErr?.technologies ?? "List the technologies used in the project, separated by comma."}
                                onChange={(value: string) => handleChange({ target: { value } } as any, "technologies")}
                                placeholder="Enter project description"
                            />
                        </div>

                        {/* Image */}
                        <div className="flex flex-col">
                            <Label>Upload Image</Label>
                            <FileInput
                                accept={"image/*"}
                                onChange={handleFileInput("image")}
                                error={formDataErr?.image}
                            />
                        </div>



                        {/* PDF */}
                        <div className="flex flex-col">
                            <Label>Upload PDF (project detail)</Label>
                            <FileInput
                                accept={"application/pdf"}
                                onChange={handleFileInput("file")}
                                error={formDataErr?.file}
                            />
                        </div>

                        {/* Preview Image
                        <div className="flex flex-col">
                            <Label>Image Preview</Label>
                            <div className="mt-1 border border-dashed border-border rounded-md p-2 h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                {formData.image ? (
                                    <img
                                        src={formData.image?.url}
                                        alt={formData.projectTitle || "project image"}
                                        className="w-40 h-40 object-cover mt-2 rounded-md border"
                                    />
                                ) : (
                                    <span className="text-gray-400">No image selected</span>
                                )}
                            </div>
                        </div> */}
                    </div>

                    <Button size="sm" className="w-full" variant="primary">
                        {id ? "Update Project" : "Create Project"}
                    </Button>
                </form>
            </ComponentCard>
        </>
    );
};

export default CreateProject;
