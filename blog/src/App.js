import './App.css'
import React, { useState, useEffect } from 'react'
import { Card } from './Components/Card'
import { createPost, getPosts } from './Service/service'
import AddIcon from '@mui/icons-material/Add'
import { CircularProgress } from "@mui/material"
import Snackbar from '@mui/material/Snackbar'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { RenderModal } from "./Components/Modal"
import { Header } from './Components/Header'

export default function App() {
  const [data, setData] = useState(null)
  const [seeModal, setModal] = useState(false)
  const [content, setContent] = useState(<CircularProgress style={{color: '#E07B67'}}/>)
  const [textButton, setTextButton] = useState('Salvar');
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(
    <div className="flex space">
      <CheckCircleOutlineIcon style={{ color: "green" }} fontSize="large"/>
      <p>Post salvo com sucesso!</p>
    </div>
  )

  useEffect(() => {
    async function getData(){
      await getPosts().then(res => setData(res.data))
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

        getPosts().then(res => setData(res.data))

      }).catch(error => {
        setTimeout(() => {
          setTextButton('Salvar')
          setMessage(
            <div className="flex space">
              <ReportProblemIcon style={{ color: "#E07B67" }}/>
              <p> {error.response.data.errors[0].defaultMessage} </p>
            </div>
          )
          setOpen(true)
        }, 500)
      })
    }
  }

  return(
    <>
      <Header setData={setData} setContent={setContent}/>
      <div className="column">
        { data !== null && data.length !== 0 ?         
          data.map((post, index) => {
            return <Card post={post} key={index} setSnack={setMessage} openSnackFunc={setOpen} persistChanges={setData}/>
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
    </>
  )
}
