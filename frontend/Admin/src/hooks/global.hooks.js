/**
 *
 * @param photo obj
 * @param name string
 * @returns Promise data(boolean || object || array)
 */
export const _cloudinaryUpload = (photo, name) => {

    console.log("on_cloud", {photo})
    const data = new FormData();
    data.append('file', photo);
    data.append("upload_preset", "se65tizp-workapp");
    data.append("cloud_name", "dh9uut55k");

    return fetch("https://api.cloudinary.com/v1_1/dh9uut55k/upload", {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(data => {
            console.log("cloudinary: ", {data});
            const obj = {
                value: data.url,
                obj: name,
            };

            return obj;
        })
        .catch(err => {
            console.error("Cloudinary upload error:", err);
            throw new Error("Failed to upload image to Cloudinary");
        });
};