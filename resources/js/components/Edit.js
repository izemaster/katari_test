import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useNavigate, useParams,Link } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditUser() {
  const navigate = useNavigate();

  const { id } = useParams()

  const [titulo, setTitle] = useState("")
  const [descripcion, setDescription] = useState("")
  const [imagen, setImage] = useState(null)
  const [validationError,setValidationError] = useState({})

  useEffect(()=>{
    fetchNews()
  },[])

  const fetchNews = async () => {
    await axios.get(`http://localhost:8000/api/noticias/${id}`).then(({data})=>{
      const { titulo, descripcion } = data.noticia
      setTitle(titulo)
      setDescription(descripcion)
    }).catch(({response:{data}})=>{
      Swal.fire({
        text:data.message,
        icon:"error"
      })
    })
  }

  const changeHandler = (event) => {
		setImage(event.target.files[0]);
	};

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('_method', 'PATCH');
    formData.append('titulo', titulo)
    formData.append('descripcion', descripcion)
    if(imagen!==null){
      formData.append('imagen', imagen)
    }

    await axios.post(`http://localhost:8000/api/noticias/${id}`, formData).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      navigate("/")
    }).catch(({response})=>{
      if(response.status===422){
        setValidationError(response.data.errors)
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Actualizar Noticia</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={updateProduct}>
                  <Row>
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" value={titulo} onChange={(event)=>{
                              setTitle(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Description">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} value={descripcion} onChange={(event)=>{
                              setDescription(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />

                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Actualizar
                  </Button>
                  <Link to={"/"} className="navbar-brand text-black">
                    <Button variant="danger" className="mt-2 mx-2" size="lg" block="block" type="button">
                        Cancelar
                    </Button>
                  </Link>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
