import React, { useState } from 'react'
import './style.css'
import { RenderModal } from '../Modal'
import Tooltip from '@mui/material/Tooltip'
import { CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { editPost, favoritePost, getPosts, removePost } from '../../Service/service'

export function Card({post, setSnack, openSnackFunc, persistChanges}){
    const [favorite, setFavorite] = useState(post.favorite)
    const [title, setTitle] = useState(post.title)
    const [text, setText] = useState(post.text)
    const [openExcludeModal, setOpenExcludeModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [textButtonExclude, setTextButtonExclude] = useState('Sim')
    const [textButtonEdit, setTextButtonEdit] = useState('Salvar')

    function excludePost(id){
        setTextButtonExclude(<CircularProgress style={{color:"#000", width:"1.5rem", height:"25px"}}/>)

        removePost(id).then(res => {
            if(res.status === 200){
                setTimeout(() => {
                    getPosts().then(res => persistChanges(res.data))
                    setOpenExcludeModal(false)
                    setSnack(
                        <div className="flex space">
                            <CheckCircleOutlineIcon style={{ color: "#E07B67" }}/>
                            <p>Post deletado com sucesso!</p>
                        </div>
                    )
                    openSnackFunc(true)
                    setTextButtonExclude('Sim')
                }, 500)  
            }
        }).catch(() => {
            setTimeout(() => {
                setTextButtonExclude('Sim')
                setSnack(
                    <div className="flex space">
                        <ReportProblemIcon style={{ color: "#E07B67" }}/>
                        <p>Erro ao excluir o post!</p>
                    </div>
                )
                openSnackFunc(true)
            }, 500)  
        })
    }

    function changePost(){
        setTextButtonEdit(<CircularProgress style={{color:"#000", width:"1.5rem", height:"25px"}}/>)

        editPost(title, text, post.id).then( res => {
            if(res.status === 200){
                setTimeout(() => {
                    getPosts().then(res => persistChanges(res.data))
                    setOpenEditModal(false)
                    setSnack(
                        <div className="flex space">
                            <CheckCircleOutlineIcon style={{ color: "#E07B67" }}/>
                            <p>Post alterado com sucesso!</p>
                        </div>
                    )
                    openSnackFunc(true)
                    setTextButtonEdit('Salvar')
                }, 500)
            }
        }).catch( error => {
            setTimeout(() => {
                setTextButtonEdit('Salvar')
                setSnack(
                    <div className="flex space">
                        <ReportProblemIcon style={{ color: "#E07B67" }}/>
                        <p> { error.response.data.status === 400 ? "Título ou texto devem conter 5 caractéres no mínimo!" : "Erro ao editar o post!"} </p>
                    </div>
                )
                openSnackFunc(true)
            }, 500)
        })
    }

    function changeFavorite(id){
        favoritePost(id).then(res => {
            if(res.status === 200){
                setFavorite(res.data.favorite)
                setSnack(
                    <div className="flex space">
                        { res.data.favorite ?
                            <>
                                <FavoriteIcon style={{ color: "#E07B67" }} onClick={() => changeFavorite(post.id)}/> 
                                <p>Post adicionado aos favoritos!</p>
                            </>
                            :
                            <>
                                <FavoriteBorderIcon style={{ color: "#E07B67" }} onClick={() => changeFavorite(post.id)}/> 
                                <p>Post removido dos favoritos!</p>
                            </>
                        }
                    </div>
                )
                openSnackFunc(true)
            } 
        }).catch( error => {

            setSnack(
                <div className="flex space">
                    <ReportProblemIcon style={{ color: "#E07B67" }}/>
                    <p> { error.response.data.status === 404 ? error.response.data.message : 'Erro ao adicionar aos favoritos!' }</p>
                </div>
            )
            openSnackFunc(true)
        })
    }

    function getDataRefactor(data){
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];     
        return data.split('-')[1] + ` de ${ months[parseInt(data.split('-')[1] - 1)] }, ${data.split('-')[0]}`;
    }

    return(
        <div className="card">
            <div className="iconAndDate">
                <p>{ getDataRefactor(post.dataPost) }</p>
                <div className="iconsOption">
                    { 
                        favorite ? 
                        <Tooltip title="Remover dos favoritos" arrow>
                            <FavoriteIcon className="iconFavorite" onClick={() => changeFavorite(post.id)}/>  
                        </Tooltip>
                        :
                        <Tooltip title="Adicionar aos favoritos" arrow>
                            <FavoriteBorderIcon className="iconNoneFavorite" onClick={() => changeFavorite(post.id)}/>   
                        </Tooltip>
                    }
                    <Tooltip title="Editar" arrow>
                        <ModeEditIcon onClick={() => setOpenEditModal(true)}/> 
                    </Tooltip>
                    <Tooltip title="Excluir" arrow>
                        <DeleteIcon onClick={() => setOpenExcludeModal(true)}/>
                    </Tooltip>
                </div>  
            </div>
            <div className="contentCard">
                <p className="title">{ post.title }</p>
                <p>{ post.text }</p>
            </div>
            <RenderModal 
              title='Excluir publicação?' 
              subtitle='Após fazer a exclusão, não será possivel restaurar a publicação'
              postTitle={ null }
              postText={ null }
              open={openExcludeModal}
              closeFunc={setOpenExcludeModal}
              saveChanges={excludePost}
              textButton={textButtonExclude}
              id={post.id}
            />
            <RenderModal 
              title='Editar post' 
              subtitle='Altere as informações em seguida salve.'
              postTitle={ title }
              postText={ text }
              open={openEditModal}
              closeFunc={setOpenEditModal}
              setTitle={setTitle} 
              setText={setText}
              saveChanges={changePost}
              textButton={textButtonEdit}
            />
        </div>
    )
}