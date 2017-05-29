package kr.or.connect.todo.api;

import java.util.Collection;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.domain.TodoCri;
import kr.or.connect.todo.service.TodoService;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
	private TodoService todoService;
	private final Logger log = LoggerFactory.getLogger(TodoController.class);
	
	@Autowired
	public TodoController(TodoService todoService){
		this.todoService = todoService;
	}
	
	@GetMapping
	Collection<Todo> readList(TodoCri todoCri) {
		return todoService.findByCri(todoCri);
	}
	
	@GetMapping("/count")
	Integer calcCount(TodoCri todoCri) {
		return todoService.calcCountByCri(todoCri);
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	Todo create(@Valid @RequestBody Todo todo) {
		Todo newTodo = todoService.create(todo);
		log.info("todo created : {}" , newTodo);
		return todo;
	}
	
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT) 
	void remove(@PathVariable Integer id){
		todoService.removeById(id);
	}
	
	@DeleteMapping
	@ResponseStatus(HttpStatus.NO_CONTENT)
	void removeList(@RequestBody TodoCri todoCri) {
		log.info("delete by todoCri {}",todoCri);
		todoService.removeByCri(todoCri);
	}
	
	@PatchMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	void modify(@PathVariable Integer id, @RequestBody Todo todo) {
		todoService.modify(id, todo);
	}
	
}
