import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import Moment from 'moment';

export default function List() {

    const [news, setNews] = useState([])

    useEffect(()=>{
        fetchNews()
    },[])

    const fetchNews = async () => {
        await axios.get(`/api/noticias`).then(({data})=>{
            setNews(data.noticias)
        })
    }

    const deleteNews = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Confirmar Eliminación',
            text: "No prodrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          await axios.delete(`/api/noticias/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchNews()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/noticias/create"}>
                    Nueva Noticia
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Descripcion</th>
                                    <th>Imagen Principal</th>
                                    <th>Fecha y Hora</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    news.length > 0 && (
                                        news.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.titulo}</td>
                                                <td>{row.descripcion}</td>

                                                <td>
                                                    <img width="50px" src={`/storage/${row.imagen}`} />
                                                </td>
                                                <td>{Moment(row.updated_at).format('D/M/YYYY, h:mm:ss a')}</td>
                                                <td>
                                                    <Link to={`/noticias/edit/${row.id}`} className='btn btn-primary me-2 mx-1'>
                                                        Editar
                                                    </Link>
                                                    <Button variant="danger" onClick={()=>deleteNews(row.id)}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}



