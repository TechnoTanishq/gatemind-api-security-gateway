package com.gatemind.client.exceptions;

public class DuplicateClientException extends RuntimeException {

    public DuplicateClientException(String message) {
        super(message);
    }

}