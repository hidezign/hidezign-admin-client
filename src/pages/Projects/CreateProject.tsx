// src/pages/Projects/CreateProject.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // prefer react-router-dom for hooks typing
import { toast } from "sonner";

import { createProject } from "@/API/admin.api";
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
import { fieldValidator } from "@/utils/inputValidator";

type ProjectForm = {
    projectTitle: string;
    projectDescription: string;
    liveUrl: string;
    isActive: boolean;
    isShowHome: boolean;
    technologies: string;
    image: string; // base64 payload (without data:*;base64, prefix)
    file: string; // base64 payload (pdf)
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
    const [loading, setLoading] = React.useState<boolean>(false);

    const [formData, setFormData] = React.useState<ProjectForm>(initialFormData);
    const [formDataErr, setFormDataErr] = React.useState<FormErrors>({});
    // const [isChecked, setIsChecked] = React.useState<boolean>(false);

    // Generic field updater
    const handleChange = (
        eOrValue: React.ChangeEvent<HTMLInputElement> | string | boolean,
        field: keyof ProjectForm
    ) => {
        let value: ProjectForm[typeof field];

        // For text inputs we usually pass the event; for textarea we pass string; for switches boolean.
        if (typeof eOrValue === "string" || typeof eOrValue === "boolean") {
            value = eOrValue as ProjectForm[typeof field];
        } else {
            // React.ChangeEvent<HTMLInputElement>
            value = (eOrValue.target?.value ?? "") as ProjectForm[typeof field];
        }

        // Validate the single field (uses your existing fieldValidator)
        const error = typeof value === "boolean" ? "" : fieldValidator(String(value));

        setFormDataErr((prev) => ({
            ...prev,
            [field]: error || "",
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

        (Object.keys(formData) as Array<keyof ProjectForm>).forEach((field) => {
            const value = formData[field];

            // For boolean fields we don't require non-empty check
            if (typeof value === "boolean") {
                errors[field] = "";
                return;
            }

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
    const handleFileInput =
        (field: "image" | "file") =>
            async (e: React.ChangeEvent<HTMLInputElement>) => {
                const base64 = await imageBase64Convertor(e, () => { }) // second arg required but we want return value
                    .catch(() => undefined);

                // imageBase64Convertor returns base64 payload (without data:*;base64,) or undefined
                setFormData((prev) => ({
                    ...prev,
                    [field]: base64 ?? "",
                }));
            };

    return (
        <>
            {loading && <PageLoader />}
            <ComponentCard title="Create Project" desc="Please fill in the details to create a new project.">
                <form method="post" onSubmit={handleSubmit} className="space-y-2">
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
                                color="gray"
                                defaultChecked={false}
                                onChange={(checked: boolean) => {
                                    handleChange(checked, "isActive");
                                }}
                            />
                            <Switch
                                label="Show on homepage"
                                color="gray"
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
                    </div>

                    <Button size="sm" className="w-full" variant="primary">
                        Create Project
                    </Button>
                </form>
            </ComponentCard>
        </>
    );
};

export default CreateProject;
