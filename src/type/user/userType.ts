// 用户type

export interface IUserQuery {
    // 用户id
    userId:number
    // 姓名
    userName:string
    // 邮箱
    email:string
    // 角色名
    roleName:string
    // 状态 0正常，1禁用，2离职
    status:string
    // 创建时间
    createTime:string
}

export interface IUserQueryReq {
    pageNo: number,
    pageSize: number,
    userName: string,
}

export interface IUserDeleteReq {
    ids:string
}

export interface IUserAddOrUpateReq {
    userId:string
    userName: string,
    password: string,
    email: string,
    roleName: string,
    roleCode: string,
    status: string,
    roles: IRole[],
}

interface IRole{
    roleCode:string
    roleName:string
}