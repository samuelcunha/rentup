package com.rentup.app.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidDateException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 8196485186113867445L;

    public InvalidDateException(String detail) {
        super(null, "Invalid date", Status.BAD_REQUEST, detail);
    }
}
