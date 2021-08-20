package com.rentup.app.domain.rent;

public enum RentStatus {
    REQUESTED,
    CONFIRMED,
    REFUSED,
    FINISHED;

    public boolean isTerminalStatus() {
        return this.equals(REFUSED) || this.equals(FINISHED);
    }
}
