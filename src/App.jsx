import React from "react";
import {firebase} from './firebase'

function App() {
   //Hooks
   const [nombre,setNombre] = React.useState('')
   const [apellido,setApellido] = React.useState('')
   const [id,setId] = React.useState('')
   const [lista,setLista] = React.useState([])
   const [modoEdicion,setModoEdicion]= React.useState(false)
   const[error,setError]=React.useState(null)
   /* ---------------------------/------------------------ */
  React.useEffect(()=>{ 
  const obtenerDatos = async()=>{
    try {
     const db = firebase.firestore()
     const data = await db.collection('usuarios').get()
     //console.log(data.docs);
     const arrayData = data.docs.map((documento)=>({id:documento.id,...documento.data()}))
     setLista(arrayData)
     console.log(arrayData);
    } catch (error) {
      console.log(error);
    }
  }  
  obtenerDatos()
  },[])
  const guardardatos = async(e)=>{
    e.preventDefault()
    
    if (!nombre.trim()) {
      setError('Ingrese Nombre')
      return
    }
    if (!apellido.trim()) {
      setError('Ingrese Apellido')
      return
    }
    //Guardar usuario a la colección
    try {
      const db = firebase.firestore()
      const nuevoUsuario={
        nombre,apellido
      }
      //Agregar a bd firebase
      const dato = await db.collection('usuarios').add(nuevoUsuario)
      //Agregar a Lista
      setLista([
        ...lista,
        {id:dato.id,...nuevoUsuario}
      ])
    } catch (error) {
      console.log(error);
    }
    //Limpiar estados
    setNombre('')
    setApellido('')
    setId('')
    setError(null)
  }
  //Eliminar
  const eliminarDato = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('usuarios').doc(id).delete()
      const listaFiltrada = lista.filter((elemento)=>elemento.id!==id)
      setLista(listaFiltrada)
    } catch (error) {
      console.log(error);
    }
  }
  //Editar
  /* función para activar el modo edición*/
  const editar = (elemento) =>{
    setModoEdicion(true)
    setNombre(elemento.nombre)
    setApellido(elemento.apellido)
    setId(elemento.id)
  }
  //Función para guardar datos
  const editarDatos = async (e) =>{
    e.preventDefault()
    
    if (!nombre.trim()) {
      setError('Ingrese Nombre')
      return
    }
    if (!apellido.trim()) {
      setError('Ingrese Apellido')
      return
    }
    try {
      const db = firebase.firestore()
      await db.collection('usuarios').doc(id).update({nombre,apellido})
      const listaEditada = lista.map((elemento)=>elemento.id===id ? {id,nombre,apellido}: elemento)
      setLista(listaEditada)
      setModoEdicion(false)
      setNombre('')
      setApellido('')
      setId('')
      setError(null)
    } catch (error) {
     console.log(error); 
    }

  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <br />
          <h2 className="text-center">{modoEdicion ? 'Edición del Usuario(s)': 'Registro de Usuarios'}</h2>
          {
            error ? (<div className="alert alert-danger" role="alert"> 
            {error}
            </div>):
            null
          }
          <form onSubmit={modoEdicion ? editarDatos : guardardatos}>
          <input type="text"placeholder="Ingrese Nombre" className="form-control my-2" onChange={(e)=>{setNombre(e.target.value)}} value = {nombre} />
          <input type="text"placeholder="Ingrese Apellido" className="form-control my-2" onChange={(e)=>{setApellido(e.target.value)}} value = {apellido}/>
          <div className="d-grid gap-2">
          {
            modoEdicion ?<button className="btn btn-success" type="submit">Editar</button>
            :
            <button className="btn btn-primary" type="submit">Agregar</button>
          }
          </div>
          </form>
        </div>
      </div>
      <br/>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Lista de Usuarios Registrados</h2>
          <ul className="list-group">
          {
            lista.map((elemento)=>(
              <li className="list-group-item" key={elemento.id}>{elemento.nombre} - {elemento.apellido}
              <button className="btn btn-warning float-end mx-2" onClick={()=>editar(elemento)}>Editar</button>
              <button className="btn btn-danger float-end mx-2" onClick={()=>eliminarDato(elemento.id)}>Eliminar</button>
              </li>
            ))
          }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
