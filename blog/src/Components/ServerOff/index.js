import React from 'react'
import './style.css'
import ServerIcon from '../../Static/Images/serverOff.png'

export function ServerOff(){
    return(
        <div className='divServerOff'>
            <img src={ ServerIcon } className="imageNotFound"  alt=""/>
            <p>Ops... Nossos servidores estão inicializando!</p>
            <span>Tente novamente daqui a pouco.</span>
        </div>
    )
}