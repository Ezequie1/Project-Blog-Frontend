import React from "react"
import "./style.css"
import NotFoundIcon from '../../Static/Images/icon.png'
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material'
import { getPosts, searchPosts } from '../../Service/service'

export function Header({setData, setContent}){

    function notFound(){
        return(
            <div className="divNotFound">
                <img src={ NotFoundIcon } alt=""/>
                <p>Ops... Não encontramos nada!</p>
            </div>
        )
    }

    async function searchData(value){
        setContent(
            <div className="flex space">
                <CircularProgress style={{color: '#E07B67'}}/>
            </div>
        )
        if(value !== "") {
            await searchPosts(value).then( res => {
                setTimeout(() => res.data.length === 0 ? setContent(notFound()) : setData(res.data), 500)  
            })
        }else{
            await getPosts().then(res => setTimeout(() => setData(res.data), 500))
        }
    }

    return(
        <div className="header">
            <p><span>Code</span>lândia</p>
            <div className="divInput">
                <SearchIcon fontSize="large" className="iconSearch" style={{color: "#E07B67"}}/>
                <input type="text" placeholder="Pesquisar no blog" className="input" onChange={ event => searchData(event.target.value) }/>
            </div>
        </div>
    )
}