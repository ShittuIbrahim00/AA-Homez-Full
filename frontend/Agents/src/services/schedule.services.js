import {request} from "./api";


class ScheduleServices {

    createSchedule(data){
        return request(
            "/property/schedule", "POST",
            data, true,
        );
    }

    createSubSchedule(data){
        return request(
            "/property/sub/schedule", "POST",
            data, true,
        );
    }

    getAllPendingSchedules(){
        return request(
            "/agent/schedules/pending", "GET",
            undefined, true,
        );
    }

    getAllApprovedSchedules(){
        return request(
            "/agent/schedules/approved", "GET",
            undefined, true,
        );
    }

    getAllDeclinedSchedules(){
        return request(
            "/agent/schedules/declined", "GET",
            undefined, true,
        );
    }

    getSchedule(id){
        return request(
            `/agent/schedule/${id}`
        );
    }

}

export default new ScheduleServices();
