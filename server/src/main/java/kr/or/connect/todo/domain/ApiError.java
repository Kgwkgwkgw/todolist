package kr.or.connect.todo.domain;

import java.util.Map;

import org.springframework.http.HttpStatus;

public class ApiError {
	private HttpStatus status;
    private String message;
    private Map<String, Object> errors;
 
    public ApiError(HttpStatus status, String message, Map<String, Object> errors) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public HttpStatus getStatus() {
		return status;
	}
	public void setStatus(HttpStatus status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Map<String, Object> getErrors() {
		return errors;
	}
	public void setErrors(Map<String, Object> errors) {
		this.errors = errors;
	}
}
