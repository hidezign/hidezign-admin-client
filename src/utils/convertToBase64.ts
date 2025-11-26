// utils/base64.ts
export const convertToBase64 = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result;
            // reader.result can be string | ArrayBuffer | null
            if (typeof result === "string") {
                resolve(result);
            } else {
                // ArrayBuffer or null: treat as failure for data URL conversion
                resolve(undefined);
            }
        };

        reader.onerror = (error) => {
            // log and resolve undefined for graceful handling
            // don't reject unless you want the caller to handle exceptions
            // (keeps behaviour same as your previous code which resolved undefined)
            // eslint-disable-next-line no-console
            console.error("Base64 conversion error:", error);
            resolve(undefined);
        };
    });
};

type SetFunc = (value?: string) => void;

/**
 * Reads the first file from an <input type="file"> change event and:
 * - sets the base64 *payload* (without the data URL prefix) via setFunc
 * - optionally sets a preview data URL via setPreviewImg (full data URL)
 *
 * Usage in React:
 * <input type="file" onChange={(e) => imageBase64Convertor(e, setImagePayload, setPreview)} />
 */
export const imageBase64Convertor = async (
    e: Event | React.ChangeEvent<HTMLInputElement>,
    setFunc: SetFunc,
    setPreviewImg?: SetFunc
): Promise<string | undefined> => {
    const target = e?.target as HTMLInputElement | null;
    const file = target?.files?.[0];

    if (!file) {
        // nothing selected
        setFunc(undefined);
        if (setPreviewImg) setPreviewImg(undefined);
        return undefined;
    }

    const dataUrl = await convertToBase64(file);

    if (!dataUrl) {
        setFunc(undefined);
        if (setPreviewImg) setPreviewImg(undefined);
        return undefined;
    }

    // dataUrl looks like: "data:<mime-type>;base64,<base64data>"
    const commaIndex = dataUrl.indexOf("base64,");
    if (commaIndex === -1) {
        // unexpected format — store entire string as fallback
        setFunc(dataUrl);
        if (setPreviewImg) setPreviewImg(dataUrl);
        return dataUrl;
    }

    const base64String = dataUrl.substring(commaIndex + "base64,".length);
    setFunc(base64String);
    if (setPreviewImg) setPreviewImg(dataUrl);

    return base64String;
};
