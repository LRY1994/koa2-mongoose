const API_LIST = {
    /**登录 */
    LOGIN :{
        method:'post',
        url :'/user/signin'
    },
    /**文章 */
    UPLOAD :{
        method:'post',
        url :'/post/upload',
        headers: { 'Content-Type': `multipart/form-data`},
    },
    ADD_POST :{
        method:'post',
        url :'/post/new',
    },
    LIST_POST:{
        method:'get',
        url :'/post/list'
    },
    GET_POST:{
        method:'get',
        url :'/post/get'
    },
    EDIT_POST:{
        method:'post',
        url :'/post/update',
    },
    DEL_POST:{
        method:'delete',
        url :'/post/delete'
    },
}


export default API_LIST