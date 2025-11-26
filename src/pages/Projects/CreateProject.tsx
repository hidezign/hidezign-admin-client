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
import { fieldValidator, urlValidator } from "@/utils/inputValidator";
import React from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        projectTitle: "",
        projectDescription: "",
        liveUrl: "",
        isActive: false,
        isShowHome: false,
        technologies: "",
        image: "",
        file: ""
    });
    const [formDataErr, setFormDataErr] = React.useState({});
    const [isChecked, setIsChecked] = React.useState(false);

    const handleChange = (e, field) => {
        let value;
        if (field === "projectDescription") {
            value = e;
        } else if (field === "isActive" || field === "isShowHome") {
            value = e;
        } else {
            value = e.target.value;
        }

        let error = null;

        error = fieldValidator(value);

        setFormDataErr({
            ...formDataErr,
            [field]: error,
        });
        if (field === "projectDescription") {
            setFormData({
                ...formData,
                [field]: e,
            });
            return;
        }
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
            submitProjectDetails();
        }
    };

    const resetFunctions = () => {
        setFormData({
            projectTitle: "",
            projectDescription: "",
            liveUrl: "",
            isActive: false,
            isShowHome: false,
            technologies: "",
            image: "",
            file: ""
        });
        setFormDataErr({});
        setIsChecked(false);
    };

    const submitProjectDetails = async () => {
        try {
            setLoading(true);
            console.log(formData)
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
            navigate('/projects')
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <PageLoader />}
            <ComponentCard
                title="Create Project"
                desc="Please fill in the details to create a new project."
            >
                <form method="post" onSubmit={(e) => handleSubmit(e)} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                        {/* Project Title */}
                        <div className="flex flex-col">
                            <Label htmlFor="projectTitle">Project Title</Label>
                            <Input
                                type="text"
                                id="projectTitle"
                                placeholder="Enter project title"
                                value={formData.projectTitle}
                                onChange={(e) => handleChange(e, "projectTitle")}
                                error={formDataErr?.projectTitle ? true : false}
                                hint={formDataErr?.projectTitle ? formDataErr?.projectTitle : ""}
                            />
                        </div>

                        {/* Project Description */}
                        <div className="flex flex-col row-span-2">
                            <Label htmlFor="projectDescription">
                                Project Description
                            </Label>
                            <TextArea
                                rows={6}
                                value={formData.projectDescription}
                                error={formDataErr?.projectDescription ? true : false}
                                hint={formDataErr?.projectDescription ? formDataErr?.projectDescription : "Please provide a short description of the project."}
                                onChange={(value) => handleChange(value, "projectDescription")}
                                placeholder="Enter project description"
                            />
                        </div>

                        {/* Switches isActive & isShowHome */}
                        <div className="grid grid-cols-2 gap-4">
                            <Switch
                                label="Active Project"
                                color="gray"
                                defaultChecked={false}
                                onChange={(checked) => handleChange(checked, "isActive")}
                            />
                            <Switch
                                label="Show on homepage"
                                color="gray"
                                onChange={(checked) => handleChange(checked, "isShowHome")}
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
                                onChange={(e) => handleChange(e, "liveUrl")}
                                error={formDataErr?.liveUrl ? true : false}
                                hint={formDataErr?.liveUrl ? formDataErr?.liveUrl : "If the project is live, please provide the URL."}
                            />
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-col row-span-2">
                            <Label htmlFor="technologies">
                                Technologies
                            </Label>
                            <TextArea
                                rows={6}
                                value={formData.technologies}
                                error={formDataErr?.technologies ? true : false}
                                hint={formDataErr?.technologies ? formDataErr?.technologies : "List the technologies used in the project, separated by comma."}
                                onChange={(value) =>
                                    handleChange(
                                        { target: { value } },
                                        "technologies"
                                    )
                                }
                                placeholder="Enter project description"
                            />
                        </div>

                        {/* Image */}
                        <div className="flex flex-col">
                            <Label >Upload Image</Label>
                            <FileInput
                                accept={"image/*"}
                                onChange={(e) =>
                                    imageBase64Convertor(e, (imageBase64: any) =>
                                        setFormData({
                                            ...formData,
                                            image: imageBase64,
                                        })
                                    )
                                }
                                error={formDataErr?.image}
                            />
                        </div>


                        {/* PDF */}
                        <div className="flex flex-col">
                            <Label >Upload PDF (project detail)</Label>
                            <FileInput
                                accept={"application/pdf"}
                                onChange={(e) =>
                                    imageBase64Convertor(e, (imageBase64: any) =>
                                        setFormData({
                                            ...formData,
                                            file: imageBase64,
                                        })
                                    )
                                }
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
