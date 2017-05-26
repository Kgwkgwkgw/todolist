package kr.or.connect.todo.persistence;

public class TodoSqls {
	// TodoDao 쿼리
	static final String DELETE_BY_ID =
			"DELETE FROM todo WHERE id= :id";
	static final String SELECT_ALL = "SELECT * FROM todo";
	static final String COUNT_ALL = "SELECT count(*) FROM todo";
	// completed  1 -> 완료된 일
	// completed  0 -> 미완료 일
	static final String SElECT_BY_COMPLETED = "SELECT * FROM todo where completed = :completed";
	static final String SELECT_BY_ID = "SELECT * FROM todo where id =:id";
	static final String COUNT_BY_COMPLETED = "SELECT COUNT(*) FROM todo where completed = :completed";
	
	static final String UPDATE = "UPDATE todo SET\n"
			+ "completed = :completed,"
			+ "todo = :todo,"
			+ "date = now()"
			+ "WHERE id = :id";	
}
