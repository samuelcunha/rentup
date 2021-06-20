package com.rentup.app.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidDateLegalAgeException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 8196485186113867445L;

    public InvalidDateLegalAgeException() {
        super(null, "Invalid date. User underage.", Status.BAD_REQUEST);
    }
}
