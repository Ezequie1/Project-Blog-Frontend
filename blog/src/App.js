import './App.css'
import React, { useState, useEffect } from 'react'
import { Card } from './Components/Card'
import { createPost, getPosts } from './Service/service'
import AddIcon from '@mui/icons-material/Add'
import { CircularProgress } from "@mui/material"
import Snackbar from '@mui/material/Snackbar'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { RenderModal } from './Components/Modal'
import { Header } from './Components/Header'
import { ServerOff } from './Components/ServerOff'
import { RenderPagination } from './Components/RenderPagination'

export default function App() {
  const [data, setData] = useState(null)
  const [seeModal, setModal] = useState(false)
  const [content, setContent] = useState(<CircularProgress style={{color: '#E07B67'}}/>)
  const [textButton, setTextButton] = useState('Salvar')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [paginationValues, setPaginationValues] = useState()
  const [message, setMessage] = useState(
    <div className="flex space">
      <CheckCircleOutlineIcon style={{ color: "green" }} fontSize="large"/>
      <p>Post salvo com sucesso!</p>
    </div>
  )

  useEffect(() => {
    async function getData(){
      await getPosts().then(res => {
        setData(res.data.content)
        setPaginationValues(res.data)
      }).catch(() => setContent(<ServerOff/>))
    }

    setTimeout(() => getData(), 1000)
  }, [])
    

  function savePost(){
    if(title !== '' && text !== ''){
      setTextButton(<CircularProgress style={{color:"#000", width:"1.5rem", height:"25px"}}/>)

      createPost(title, text).then(res => {
        if(res.status === 201){
      
          setTimeout(() => {
            setModal(false)
            setTextButton('Salvar')
            setMessage(
              <div className="flex space">
                <CheckCircleOutlineIcon style={{ color: "#E07B67" }}/>
                <p>Post salvo com sucesso!</p>
              </div>
            )
            setOpen(true)
          }, 500)
        }

        if(document.getElementById('inputSearch').value !== ''){
          getPosts(1).then( res => {
            getPosts(res.data.totalPages - 1).then( resGet => {
              setData(resGet.data.content)
              setPaginationValues(resGet.data)
            })
          })          
        } else {
          getPosts(paginationValues.number).then(resGet => {
            setData(resGet.data.content)
          })
        }
      }).catch(error => {
        setTimeout(() => {
          setTextButton('Salvar')
          setMessage(
            <div className="flex space">
              <ReportProblemIcon style={{ color: "#E07B67" }}/>
              <p> { error.response.data.status === 400 ? "Título ou texto devem conter 5 caractéres no mínimo!" : "Erro ao salvar o post!"} </p>
            </div>
          )
          setOpen(true)
        }, 500)
      })
    }
  }

  return(
    <>
      <Header setData={setData} setContent={setContent} setActualPage={setPaginationValues}/>
      <div className="column">
        { data !== null && data.length !== 0 ?         
          data.map((post, index) => {
            return <Card post={post} key={index} setSnack={setMessage} openSnackFunc={setOpen} persistChanges={setData} isServerOff={setContent} actualPage={paginationValues.number}/>
          })
        :
          content
        }
      </div>
      <div className="iconAdd" onClick={() => setModal(true)}>
        <AddIcon fontSize="large"/> 
      </div>
      <RenderModal 
        title='Crie seu post' 
        subtitle='Insira seu título e texto, em seguida clique em salvar para adicionar seu post!'
        postTitle=''
        postText=''
        open={seeModal}
        closeFunc={setModal}
        setTitle={setTitle}
        setText={setText}
        saveChanges={savePost}
        textButton={textButton}
      />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message={message}
      />
      { data !== null && data.length !== 0 ? <RenderPagination value={paginationValues} setPageData={setData} setContent={setContent} paginationValues={setPaginationValues} /> : <></>}
    </>
  )
}
