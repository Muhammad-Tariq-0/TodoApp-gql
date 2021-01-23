import { useMutation, useQuery } from "@apollo/client";
import gql from 'graphql-tag'
import React from "react"
import loader from '../images/loader1.gif'
import './index.css'

export default function Home() {

    const GET_TODOS = gql`
    {
    todo {
        id,
       todo,
       status
      }
    }
`


    const ADD_TODO = gql`
    mutation addTodo($todo: String!){
        addTodo(todo: $todo){
            todo
        }
    }
`
const DELETE_TODO = gql`
mutation deleteTodo($id: ID!){
    deleteTodo(id: $id){
        id
    }
}
`

//-------------------Adding Todo------------------------------

    let inputText;
    const [addTodo] = useMutation(ADD_TODO);
   function addtodo(){
        addTodo({
            variables: {
                todo: inputText.value
            },
            refetchQueries: [{ query: GET_TODOS }]
        })
        inputText.value = "";
    }

//-------------------Deleting Todo------------------------------
const [deleteTodo] = useMutation(DELETE_TODO);
function deletetodo(id) {
    console.log(id)
   deleteTodo({
       variables: {id},
       refetchQueries: [{query: GET_TODOS}]
   })
}


//-------------------Getting Todos------------------------------

    const { loading, error, data } = useQuery(GET_TODOS);
     console.log(data);
    if (loading)
        return <img src={loader} alt="loading" className="loader" />

    if (error) {
        console.log(error)
        return <h2>Error</h2>
    }

    return (
        <div className="app">
            <div>
            <label>
                <h1 className="heading"> TODO APP </h1>
                <input type="text" ref={node => {
                    inputText = node;
                }} maxLength="50"/>
            </label>
            <button onClick={addtodo} className="addButton">Add Todo</button>
            </div>

            <div id="todos">
            {data.todo.map((todos,num)=>{
                return(
                    <ul key={num} className="todo">
                        <li>{todos.todo}</li>
                       <li><button onClick={()=>{deletetodo(todos.id)}} className="deleteButton">delete</button> &nbsp; </li>
                    </ul>
                )
            })}
            
            </div>
           
        </div>
    );

}





