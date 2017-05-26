package kr.or.connect.todo.api;

import java.util.Collection;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
		if(todoCri.getFiltering()!=null){
			log.info(todoCri.toString());
			return todoService.findByCri(todoCri);
		}
		else
			return todoService.findAll();
	}
	@GetMapping("/count")
	Integer calcCount(TodoCri todoCri) {
		if(todoCri.getFiltering()!=null) {
			return todoService.calcCountByCri(todoCri);
		}
		else {
			return todoService.calcCountAll();
		}
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
	
	@PutMapping("/{id}/completion")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	void modify(@PathVariable Integer id, @RequestParam Integer completed){
		log.info(completed+"");
		todoService.modify(id, completed);
	}
	
}
