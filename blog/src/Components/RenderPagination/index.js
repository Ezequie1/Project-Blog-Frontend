import React from 'react';
import './style.css'
import { getPosts, searchPosts } from '../../Service/service'
import { ServerOff } from '../ServerOff'
import { CircularProgress } from '@mui/material'

export function RenderPagination({value, setPageData, setContent, paginationValues}){
    let array = []

    for(let i = 0; i < value.totalPages; i ++){
        value.number === i ? 
            array.push(<span className='selectedPage' key={i}></span>) : 
            array.push(<span className='notSelected' onClick={ () => changePage(i) } key={i}></span>);
    } 

    async function changePage(numberPage){
        setContent(<CircularProgress style={{color: '#E07B67'}}/>)
        setPageData(null)
        let search = document.getElementById('inputSearch').value

        if(search === ''){
            await getPosts(numberPage).then( res => {
                setTimeout(() => {
                    setPageData(res.data.content)
                    paginationValues(res.data)
                }, 500)
            }).catch(() => setContent(<ServerOff/>))
        }else{
            await searchPosts(search, numberPage).then( res => {
                setTimeout(() => {
                    setPageData(res.data.content)
                    paginationValues(res.data)
                }, 500)
            }).catch(() => setContent(<ServerOff/>))
        }
    }
    
    return(
        <div className='divPagination'>
            {
                array.map( page => { return page })
            }
        </div>
    )
}