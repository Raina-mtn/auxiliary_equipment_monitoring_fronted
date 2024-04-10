import { defHttp } from "@/api/http";
// 获取加密公钥
export const getSm2PublicKey = () => {
    return fetch("/api/encrypt/sm2PublicKey").then((response) => response.json());
};

// 登录
export const login = (params: any) => {
    return defHttp.post(
        {
            url: "/login",
            params,
        },
        {
            encrypto: true,
        }
    );
};

// 登出
export const logout = () => {
    return defHttp.post({
        url: '/logout'
    })
}

// 获取用户基本信息
export const apiGetUserMenu = () => {
    return defHttp.post({
        url: '/user/menu'
    })
}
// 获取用户菜单权限
export const apiGetUserBaseInfo = () => {
    return defHttp.post({
        url: '/user/base-info'
    })
}

export const apiGetUserList = (params: object) => {
    return defHttp.post({
        url: '/user/list',
        params
    })
}

export const apiCreateUser = (params: object) => {
    return defHttp.post({
        url: '/user/create',
        params
    })
}

export const apiUpdateUser = (params: object) => {
    return defHttp.post({
        url: '/user/update',
        params
    })
}

export const apiDelUser = (params: object) => {
    return defHttp.post({
        url: '/user/delete',
        params
    })
}

export const apiLockUser = (params: object) => {
    return defHttp.post({
        url: '/user/lock',
        params
    })
}

export const apiUnlockUser = (params: object) => {
    return defHttp.post({
        url: '/user/unlock',
        params
    })
}

export const apiUpdatePass = (params: object) => {
    return defHttp.post({
        url: '/user/update-pass',
        params
    })
}
// 二次验证密码
export const apiRecheckPass = (params: object) => {
    return defHttp.post({
        url: '/user/recheck-pass',
        params
    })
}

export const apiGetLog = (params: object) => {
    return defHttp.post({
        url: '/user/access-log',
        params
    })
}

export const apiGetALLMenu = () => {
    return defHttp.post({
        url: '/permission/menu-tree',
    })
}