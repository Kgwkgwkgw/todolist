package kr.or.connect.todo.persistence;

import static kr.or.connect.todo.persistence.TodoSqls.COUNT_ALL;
import static kr.or.connect.todo.persistence.TodoSqls.COUNT_BY_COMPLETED;
import static kr.or.connect.todo.persistence.TodoSqls.DELETE_BY_ID;
import static kr.or.connect.todo.persistence.TodoSqls.DELETE_BY_COMPLETED;
import static kr.or.connect.todo.persistence.TodoSqls.SELECT_ALL;
import static kr.or.connect.todo.persistence.TodoSqls.SELECT_BY_ID;
import static kr.or.connect.todo.persistence.TodoSqls.SElECT_BY_COMPLETED;
import static kr.or.connect.todo.persistence.TodoSqls.UPDATE;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import kr.or.connect.todo.domain.Todo;

@Repository
public class TodoDao {
	
	private final Logger log = LoggerFactory.getLogger(TodoDao.class);
	private NamedParameterJdbcTemplate jdbc;
	private SimpleJdbcInsert insertAction;
	
	//rowMapper 
	private RowMapper<Todo> rowMapper = BeanPropertyRowMapper.newInstance(Todo.class);
	
	
	public TodoDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
		this.insertAction = new SimpleJdbcInsert(dataSource)
				.withTableName("todo")
				.usingColumns("todo","date")
				.usingGeneratedKeyColumns("id");
		
	}
	
	public List<Todo> selectAll() {
		Map<String, Object> params = Collections.emptyMap();
		return jdbc.query(SELECT_ALL, params, rowMapper);
	}
	
	public List<Todo> selectByCompleted(Integer completed) {
		Map<String, ?> params = Collections.singletonMap("completed", completed);
		return jdbc.query(SElECT_BY_COMPLETED, params, rowMapper);
	}
	
	public Todo selectById(Integer id) {
		Map<String, ?> params = Collections.singletonMap("id", id);
		return jdbc.queryForObject(SELECT_BY_ID, params, rowMapper);
	}
	
	public Integer countAll() {
		Map<String, Object> params = Collections.emptyMap();
		return jdbc.queryForObject(COUNT_ALL, params, Integer.class);
	}
	
	public Integer countByCompleted(Integer completed) {
		Map<String, ?> params = Collections.singletonMap("completed", completed);
		return jdbc.queryForObject(COUNT_BY_COMPLETED, params, Integer.class);
	}
	
	public Integer insert(Todo todo) {
		SqlParameterSource params = new BeanPropertySqlParameterSource(todo);
		return insertAction.executeAndReturnKey(params).intValue();
	}
	
	public Integer deleteById(Integer id) {
		Map<String, ?> params = Collections.singletonMap("id", id);
		return jdbc.update(DELETE_BY_ID, params);
	}
	
	public Integer deleteByCompleted(Integer completed) {
		Map<String, ?> params = Collections.singletonMap("completed", completed);
		return jdbc.update(DELETE_BY_COMPLETED, params);
	}
	
	public Integer update(Todo todo) {
		SqlParameterSource params = new BeanPropertySqlParameterSource(todo);
		log.info("{}",todo);
		return jdbc.update(UPDATE, params);
	}

}
