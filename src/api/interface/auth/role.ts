import {defHttp} from "@/api/http";
// role
export const apiGetRoleList = (params: any) => {
    return defHttp.post({
            url: "/role/list",
            params,
        }
    );
};

export const apiUpdateRole = (params: any) => {
    return defHttp.post({
            url: "/role/update",
            params,
        }
    );
};

export const apiDelRole = (params: any) => {
    return defHttp.post({
            url: "/role/delete",
            params,
        }
    );
};

export const apiCreateRole = (params: any) => {
    return defHttp.post({
            url: "/role/create",
            params,
        }
    );
};
export const apiAssignRole = (params: any) => {
    return defHttp.post({
            url: "/role/assign",
            params,
        }
    );
};