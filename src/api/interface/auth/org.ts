import {defHttp} from "@/api/http";
// orgtree
export const apiGetOrgTree = (params?: any) => {
    return defHttp.post({
            url: "/organization/tree",
            params,
        }
    );
};

export const apiGetOrgList = (params: any) => {
    return defHttp.post({
            url: "/organization/list",
            params,
        }
    );
};

export const apiDelOrg = (params: any) => {
    return defHttp.post({
            url: "/organization/delete",
            params,
        }
    );
};

export const apiCreateOrg = (params: any) => {
    return defHttp.post({
            url: "/organization/create",
            params,
        }
    );
};

export const apiUpdateOrg = (params: any) => {
    return defHttp.post({
            url: "/organization/update",
            params,
        }
    );
};