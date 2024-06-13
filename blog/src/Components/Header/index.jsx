import React from "react"
import "./style.css"
import { ServerOff } from '../ServerOff'
import NotFoundIcon from '../../Static/Images/icon.png'
import SearchIcon from '@mui/icons-material/Search'
import { CircularProgress } from '@mui/material'
import { getPosts, searchPosts } from '../../Service/service'

export function Header({setData, setContent, setActualPage}){

    function notValues() {
        setData(null)
        return(
            <div className="divNotFound">
                <img src={ NotFoundIcon } className="imageNotFound"  alt=""/>
                <p>Ops... Não encontramos nada!</p>
            </div>
        )
    }

    async function searchData(value){
        setContent(<CircularProgress style={{color: '#E07B67'}}/>)
        setData(null)

        if(value !== "") {
            await searchPosts(value, 0).then( res => {
                setTimeout(() => {
                    if(res.data.content.length === 0){
                        setContent(notValues)
                        setActualPage(res.data)
                    }else{
                        setData(res.data.content)
                        setActualPage(res.data)
                    }
                }, 500)  
            }).catch(() => setContent(<ServerOff/>))
        }else{
            await getPosts().then( res => setTimeout(() => {
                setData(res.data.content)
                setActualPage(res.data)
            } , 500)).catch(() => setContent(<ServerOff/>))
        }
    }

    return(
        <div className="header">
            <p><span>Code</span>lândia</p>
            <div className="divInput">
                <SearchIcon sx={{fontSize: { xs: 24, sm: 25, md: 25, lg: 30 } }} className="iconSearch" style={{color: "#E07B67"}}/>
                <input type="text" placeholder="Pesquisar no blog" className="input" id="inputSearch" onChange={ event => searchData(event.target.value) }/>
            </div>
        </div>
    )
}