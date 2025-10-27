import {request} from "./api";


class UserServices {

    getUser() {
        return request(
            "/agent", "GET",
            undefined, true
        )
    }


}

export default new UserServices();
