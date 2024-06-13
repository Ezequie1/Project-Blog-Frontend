import { urls, urlsPRD } from "../Static/variables"
import axios from "axios"

export function getPosts(numberPage = 0){
    return axios.get(urls.getAll, { timeout: 5000, params: { page: numberPage, size: 10 } })
}

export function searchPosts(value, numberPage = 0){
    return axios.get(urls.searchPosts + value, { timeout: 5000, params: { page: numberPage, size: 10 }})
}

export function createPost(title, text){
    return axios.post(urls.createPost, { title: title, text: text })
}

export function favoritePost(id){
    return axios.put(urls.favoritePost + id)
}

export function editPost(title, text, id){
    return axios.put(urls.editPost + id, { title: title, text: text })
}

export function removePost(id){
    return axios.delete(urls.deletePost + id)
}