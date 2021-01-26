import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";

function App() {
    const baseUrl = "http://localhost/RCRUD/";
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioSeleccionado, setUserSeleccionado] = useState({
        id: '',
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        pass: '',
        pass2: '',
    });

    const handleChange=e=>{
        const {name, value}=e.target;
        setUserSeleccionado((prevState) => ({
          ...prevState,
          [name]: value
        }));
    }

    const abrirCerrarModalInsertar=() => {
        setModalInsertar(!modalInsertar);
    }

    const abrirCerrarModalEditar=() => {
        setModalEditar(!modalEditar);
    }

    const abrirCerrarModalEliminar=() => {
        setModalEliminar(!modalEliminar);
    }

    const peticionGet = async() => {
        await axios.get(baseUrl)
        .then(response => {
            setData(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const peticionPost=async()=>{
        var f = new FormData();
        f.append("firstname", usuarioSeleccionado.firstname);
        f.append("lastname", usuarioSeleccionado.lastname);
        f.append("username", usuarioSeleccionado.username);
        f.append("email", usuarioSeleccionado.email);
        f.append("pass", usuarioSeleccionado.pass);
        f.append("pass2", usuarioSeleccionado.pass2);
        f.append("METHOD", "POST");

        await axios.post(baseUrl, f)
        .then(response=>{
          console.log(response.data);
          setData(data.concat(response.data));
          abrirCerrarModalInsertar();
        }).catch(error=>{
          console.log(error);
        })
    }

    const peticionPut=async()=>{
        var f = new FormData();
        f.append("firstname", usuarioSeleccionado.firstname);
        f.append("lastname", usuarioSeleccionado.lastname);
        f.append("username", usuarioSeleccionado.username);
        f.append("email", usuarioSeleccionado.email);
        f.append("pass", usuarioSeleccionado.pass);
        f.append("pass2", usuarioSeleccionado.pass2);
        f.append("METHOD", "PUT");

        await axios.post(baseUrl, f, {params: {id: usuarioSeleccionado.id}})
        .then(response=>{
          var dataNueva = response.data;
          dataNueva.map(usuario => {
            if(usuario.id === usuarioSeleccionado.id){
              usuario.fullname = usuarioSeleccionado.firstname + ' ' + usuarioSeleccionado.lastname;
              usuario.email = usuarioSeleccionado.email;
            }
          });
          setData(dataNueva);
          abrirCerrarModalEditar();
        }).catch(error=>{
          console.log(error);
        })
      }

    const peticionDelete = async()=>{
        var f = new FormData();
        f.append("METHOD", "DELETE");
        await axios.post(baseUrl, f, {params: {id: usuarioSeleccionado.id}})
        .then(response=>{
            setData(data.filter(user => user.id !== usuarioSeleccionado.id));
            abrirCerrarModalEliminar();
        }).catch(error=>{
            console.log(error);
        })
    }

    const seleccionarUsuario=(user, caso)=>{
        // setUserSeleccionado(user);

        if (caso === "Editar") {
            axios.get(baseUrl + '?id=' + user.id)
            .then(response => {
                // setData(response.data.users[0]);
                console.log(response.data.users[0]);
            }).catch(error => {
                console.log(error);
            });
        }

        (caso === "Editar") ?
        abrirCerrarModalEditar() :
        abrirCerrarModalEliminar()
    }

    useEffect(() => {
        peticionGet();
    }, [])

    return ( 
        <div style={{textAlign: 'center'}}>
            <br />
            <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
            <br /><br />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map(user=>(
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullname}</td>
                    {/* <td>{user.email}</td> */}
                    <td>{user.extrafields[0].value}</td>
                    <td>
                        <button className="btn btn-primary" onClick={()=>seleccionarUsuario(user, "Editar")}>Editar</button> {"  "}
                        <button className="btn btn-danger" onClick={()=>seleccionarUsuario(user, "Eliminar")}>Eliminar</button>
                    </td>
                  </tr>
                ))}
        
              </tbody> 
            </table>

            <Modal isOpen={modalInsertar}>
                <ModalHeader>Registrar usuario</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                    <label>Nombre: </label>
                        <br />
                        <input type="text" className="form-control" name="firstname" onChange={handleChange}/>
                        <br />
                        <label>Apellidos: </label>
                        <br />
                        <input type="text" className="form-control" name="lastname" onChange={handleChange}/>
                        <br />

                        <label>Nombre de usuario: </label>
                        <br />
                        <input type="text" className="form-control" name="username" onChange={handleChange}/>
                        <br />
                        <label>Email: </label>
                        <br />
                        <input type="email" className="form-control" name="email" onChange={handleChange}/>
                        <br />
                        <label>Contraseña: </label>
                        <br />
                        <input type="password" className="form-control" name="pass" onChange={handleChange}/>
                        <br />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPost()}>Registrar</button>{"   "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>

                <ModalHeader>Editar usuario { usuarioSeleccionado && usuarioSeleccionado.fullname }</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nombre: </label>
                        <br />
                        <input type="text" className="form-control" name="firstname" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.first}/>
                        <br />
                        <label>Apellidos: </label>
                        <br />
                        <input type="text" className="form-control" name="lastname" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.lastname}/>
                        <br />

                        <label>Nombre de usuario: </label>
                        <br />
                        <input type="text" className="form-control" name="username" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.username}/>
                        <br />
                        <label>Email: </label>
                        <br />
                        <input type="email" className="form-control" name="email" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.email}/>
                        <br />
                        <label>Contraseña: </label>
                        <br />
                        <input type="password" className="form-control" name="pass" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.pass}/>
                        <br />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={()=>peticionPut()}>Insertar</button>{"   "}
                    <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                    ¿Estás seguro que deseas eliminar a { usuarioSeleccionado && usuarioSeleccionado.fullname }?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={()=>peticionDelete()}>
                        Sí
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={()=>abrirCerrarModalEliminar()}
                    >
                        No
                    </button>
                </ModalFooter>
            </Modal>
        </div>
  );
}

export default App;