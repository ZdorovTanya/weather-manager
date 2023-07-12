function ToDo({todo, removeCity}){
    return(
        <div key={todo.id}>
            <div>
                {todo.task}
            </div>
            <div onClick={() => removeCity(todo.id)}>
                х
            </div>
        </div>
    )
}
export default ToDo