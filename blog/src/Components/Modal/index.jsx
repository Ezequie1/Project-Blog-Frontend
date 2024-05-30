import React from 'react';
import './style.css'
import Modal from '@mui/material/Modal'
import { TextField } from '@mui/material'

export function RenderModal(params){
    return(
        <Modal
          open={params.open}
          onClose={() => params.closeFunc(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <div className="modal">
                <div className="divInfosModal">
                    <h2><span>Code</span>lândia</h2>
                    <p><strong>{ params.title }</strong></p>
                    <p>{ params.subtitle }</p>
                </div>
                {
                    params.postTitle !== null && params.postText !== null ? 
                    <>
                        <TextInput text={params.postTitle === '' ? '' : params.postTitle} func={params.setTitle} rows={2}/>   
                        <TextInput text={params.postText === '' ? '' : params.postText} func={params.setText} rows={4}/>
                    </> 
                    :
                    <>
                    </>
                }
                <div className="divButtonsModal">
                    <button className="buttonsModal no" onClick={() => params.closeFunc(false)}>
                        Cancelar
                    </button>
                    <button className="buttonsModal yes" onClick={() => { params.id !== 0 ? params.saveChanges(params.id) : params.saveChanges() }}>
                        { params.textButton }
                    </button>
                </div>
            </div>
        </Modal>
    )
}

function TextInput({text, func, rows}){
    return(
        <TextField
          id="outlined-multiline-static"
          multiline
          label={rows === 2 ? 'Título' : 'Texto'}
          style={{color: '#fff'}}
          rows={rows}
          defaultValue={text}
          className="textField"
          onChange={event => func(event.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              fontFamily: "Lexend Deca",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e07b67",
                borderWidth: "2px",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e07b67",
                  borderWidth: "3px",
                },
              },
              "&:hover:not(.Mui-focused)": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e07b67",
                },
              },
            },
            "& .MuiInputLabel-outlined": {
              color: "#e07b67",
              fontWeight: "bold",
              "&.Mui-focused": {
                color: "#e07b67",
                fontWeight: "bold",
              },
            },
          }}
        />
    )
}