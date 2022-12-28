import {
    useGetTodosQuery,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useAddTodoMutation
} from "../api/apiSlice"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import PageButton from './PageButton'

const TodoList = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [newTodo, setNewTodo] = useState('')

    const {
        data: todos,
        totalCount,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery( { page, limit } )
    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()

    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo({ userId: 1, title: newTodo, completed: false })
        setNewTodo('')
    }

    const newItemSection =
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
            </div>
            <button className="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>


    let content, nav;    
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        // Pagination 
        //console.log(`totalCount=${todos.totalCount}`)
        const total_pages = Math.ceil(todos.totalCount / limit)
        //console.log(`total_pages=${total_pages}`)
        const lastPage = () => setPage(total_pages)
        const firstPage = () => setPage(1)
        const pagesArray = Array(total_pages).fill().map((_, index) => index + 1)
        nav = (
            <nav className="nav-ex2">
                <button onClick={firstPage} disabled={ page === 1}>&lt;&lt;</button>
                {/* Removed isPreviousData from PageButton to keep button focus color instead */}
                {pagesArray.map(pg => <PageButton key={pg} pg={pg} setPage={setPage} />)}
                <button onClick={lastPage} disabled={page === total_pages}>&gt;&gt;</button>
            </nav>
        )
        // 

        content = todos.data.map(todo => { //JSON.stringify(todos)
            return (
                <article key={todo.id}>
                    <div className="todo">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            id={todo.id}
                            onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
                        />
                        <label htmlFor={todo.id}>{todo.title}</label>
                    </div>
                    <button className="trash" onClick={() => deleteTodo({ id: todo.id })}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </article>
            )
        })
    } else if (isError) {
        content = <p>{error}</p>
    }

    return (
        <main>
            <h1>Todo List</h1>
            {newItemSection}
            {nav}
            {content}
        </main>
    )
}
export default TodoList