
import React, { useEffect,useState } from 'react';
export default function Todo()
{
    const [title,setTitle]=useState("");
    const [desc,setDesc]=useState("");
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const [editId,setEditId]=useState(-1);

    //Edit
    const [edittitle,setEditTitle]=useState("");
    const [editdesc,setEditDesc]=useState("");


    const apiUrl="http://localhost:8000";
    const handleSubmit=()=>{
        setError("");
        //check inputs
        if (title.trim!=='' && desc.trim!=='') {
            //create API
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title,desc})
            }).then((res)=>{
                if (res.ok) {
                    //add item
                    setTodos([...todos,{title,desc}]);
                    setTitle("");
                    setDesc("");
                    setMessage("Item added successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },1500)
                }
                else{
                    setError("Unable to create Todo Item");
                }
                
            }).catch(()=>{
                setMessage("Unable to create Item");
            })
            
        }
    }
    useEffect(()=>{
        getItems()
    },[])

    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            setTodos(res)
        })
    }
    const handleEdit=(item)=>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDesc(item.desc);
    }

    const handleUpdate=()=>{
        setError("");
        //check inputs
        if (edittitle.trim!=='' && editdesc.trim!=='') {
            //create API
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title:edittitle,desc:editdesc})
            }).then((res)=>{
                if (res.ok) {
                    //update item
                    const updatedtodos=todos.map((item)=>{
                        if(item._id==editId)
                        {
                            item.title=edittitle;
                            item.desc=editdesc;
                        }
                        return item;
                    })

                    setTodos(updatedtodos);
                    setEditTitle("");
                    setEditDesc("");
                    setMessage("Item updated successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },1500)

                    setEditId(-1);
                }
                else{
                    setError("Unable to create Todo Item");
                }
                
            }).catch(()=>{
                setMessage("Unable to create Item");
            })
            
        }
    }

    const handleEditCancel=()=>{
        setEditId(-1);
    }

    const handleDelete=(id)=>{
        if(window.confirm('Are you sure want to delete?'))
        {
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"
            }).then(()=>{
                const updatedtodos=todos.filter((item)=>item._id!==id)
                setTodos(updatedtodos);
            })
        }
    }
    return <>
    <div className="row p-3 bg-success text-light text-center">
        <h1>Todo Project with MERN Stack</h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>    }
        <div className="form-group d-flex gap-2 ">
            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} value={title} className="form-control bg-info" type="text"></input>
            <input placeholder="Description" onChange={(e)=>setDesc(e.target.value)} value={desc}  className="form-control bg-info" type="text"></input>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
    </div>
    <div className='row mt-3'>
        <h3>Task</h3>
        <div className="col-md-10"> 
            <ul className='list-group'>
                {
                    todos.map((item)=><li className='list-group-item d-flex justify-content-between  align-items-center my-2'>
                    <div className='d-flex flex-column me-2'>
                        {
                            editId ==-1 || editId!== item._id ?<>
                            <span className='fw-bold'>{item.title}</span>
                            <span >{item.desc}</span>
                            </> :<>
                            <div className="form-group d-flex gap-2">
                                <input placeholder="Title" onChange={(e)=>setEditTitle(e.target.value)} value={edittitle} className="form-control" type="text"></input>
                                <input placeholder="Description" onChange={(e)=>setEditDesc(e.target.value)} value={editdesc}  className="form-control" type="text"></input>
                                
                            </div>
                            
                            </>}
                        
                        
                    </div>
                            
                        
                            
                
                        
                    
                    <div className='d-flex gap-2'>
                        {editId ==-1 ||editId !== item._id ? <button className='btn btn-warning' onClick={()=>handleEdit(item)}>Edit</button>:<button className="btn btn-warning"onClick={handleUpdate}>Update</button>}
                        {editId ==-1 ||editId !== item._id?<button className='btn btn-danger' onClick={()=>handleDelete(item._id)}>Delete</button>:
                        <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                    </div>
                    
                </li>)
                }
                
                
            </ul>
        </div>
    </div>
    </>
}