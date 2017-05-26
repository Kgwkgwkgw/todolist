package kr.or.connect.todo.service;

import java.util.Collection;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.domain.TodoCri;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {
	
	private final Logger log = LoggerFactory.getLogger(TodoService.class);

	private TodoDao todoDao;
	
	@Autowired
	public TodoService(TodoDao todoDao){
		this.todoDao = todoDao;
	}
	
	public Collection<Todo> findAll() { 
		return todoDao.selectAll();
	}
	
	public Todo findById(Integer id) {
		return todoDao.selectById(id);
	}
	
	public Collection<Todo> findByCri(TodoCri todoCri) {
		if(todoCri.getFiltering().equals(TodoCri.COMPLETION_MODE))
			return todoDao.selectByCompleted(todoCri.getCompleted());
		else 
			throw new IllegalArgumentException("Not supported Mode");
	}
	
	public Integer calcCountAll(){
		return todoDao.countAll();
	}
	
	public Integer calcCountByCri(TodoCri todoCri) {
		if(todoCri.getFiltering().equals(TodoCri.COMPLETION_MODE))
			return todoDao.countByCompleted(todoCri.getCompleted());
		else
			throw new IllegalArgumentException("Not supported Mode");
	}
	
	public Todo create(Todo todo) {
		todo.setDate(new Date());
		Integer id = todoDao.insert(todo);
		todo.setId(id);
		return todo;
	}
	
	public Integer removeById(Integer id) {
		return todoDao.deleteById(id);
	}
	
	public Integer modify(Integer id, Integer completed) {
		Todo oldTodo = todoDao.selectById(id);
		log.info(oldTodo.toString());
		oldTodo.setCompleted(completed);
		log.info("whthwhtwhthwthwht");
		log.info(oldTodo.toString());
		return todoDao.update(oldTodo);
	}
}
