export const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => {
            console.error("Base64 conversion error:", error);
            resolve(undefined);
        };
    });
};

export const imageBase64Convertor = (e: any, setFunc: Function, setPreviewImg?: Function) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            const base64StringArray = base64String.split('base64,')[1];
            setFunc(base64StringArray);
            return reader.result;
        };
        reader.readAsDataURL(file);
    }
};