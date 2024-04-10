// 分页请求参数
export interface Page {
    pageIndex: number;
    pageSize: number;
}
export interface ReqPage {
    page: Page
}
export namespace Org {
    export interface ReqUserParams extends ReqPage {
        name: string
        parentId?: string | number
        charger?: string | number
        memo?: string
        id?: number
    }
}

export namespace User {
    export interface ReqUserParams extends ReqPage {
        username: string
        deptId: number | string
        roleIdList: number[]
        mobile: string
        id?: number
        email?: string,
        password?: string
    }
    export interface UserResponse {
        username: string
        deptId: number | string
        roleList: { id: number }[]
        mobile: string
        id?: number
        email?: string,
        password?: string
    }
}

export namespace Role {
    export interface ReqUserParams extends ReqPage {
        roleName: string
        roleDesc?: string
        permissionIdList?: number[]
        id?: number
    }
}

export type Camera = {
    id?: string
    lineId?: string
    equipmentName?: string
    equipmentCode?: string
    ip: string
    port: string
    username: string
    password: string
    channel: 1 | 2 | 3 | 4 | 5
}

export type Preset = {
    id?: number
    presetName: string
    presetIndex: number
    comment?: string
}