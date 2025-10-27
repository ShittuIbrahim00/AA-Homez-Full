import { toastError } from "@/utils/toastMsg"; // Updated import

/**
 *
 * @param {string} val
 * @return {string}
 */
const reformatMsg = (val) => {
    return val
}

/**
 *
 * @param photo obj
 * @param name string
 * @returns Promise data(boolean || object || array)
 */
export const _cloudinaryUpload = (photo: object, name: string) => {

    console.log("on_cloud", {photo})
    const data = new FormData();
    // @ts-ignore
    data.append('file', photo);
    data.append("upload_preset", "se65tizp-workapp");
    // data.append("upload_preset", "aa_homes_admin");
    data.append("cloud_name", "dh9uut55k");

    return fetch("https://api.cloudinary.com/v1_1/dh9uut55k/image/upload", {
        method: "POST",
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Origin': 'https://localhost:3000'
        },
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
            toastError(`${err}`);
            return false;
        });

    // console.log("done_cloud");
};