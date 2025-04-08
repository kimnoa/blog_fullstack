export const convertUrlToFile = async (urls: string) => {
    const response = await fetch(urls);
    const data = await response.blob();
    const extend = urls.split('.').pop();
    const fileName = urls.split('/').pop();
    const meta = { type: `image/${extend}` };

    return new File([data], fileName as string, meta);
};

export const convertUrlsToFile = async (urls: string[]) => {
    const fileList: File[] = [];
    for (const url of urls) {
        const file = await convertUrlToFile(url);
        fileList.push(file);
    }
    return fileList;
}