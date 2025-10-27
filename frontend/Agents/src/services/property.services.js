import {request} from "./api";


class PropertyServices {

    getAllHotProperty() {
        return request(
            "/property/hot", "GET",
            undefined, true
        )
    }

    getProperty(id){
        return request(
            `/property/get/${id}`, "GET",
            undefined, true
        )
    }

    getProperties(page){
        return request(
            `/property/get?page=${page}&limit=20`, "GET",
            undefined, true
        )
    }

    getAllSubProperties(){
        return request(
            "/property/sub", "GET",
            undefined, true
        )
    }

    getSubProperty(id){
        return request(
            `/property/sub/${id}`,"GET",
            undefined, true
        )
    }

}

export default new PropertyServices();
