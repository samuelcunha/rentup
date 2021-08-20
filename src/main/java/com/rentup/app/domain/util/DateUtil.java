package com.rentup.app.domain.util;

import static java.time.ZonedDateTime.ofInstant;
import static java.time.temporal.ChronoUnit.YEARS;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.rentup.app.web.rest.exceptions.InvalidDateException;
import com.rentup.app.web.rest.exceptions.InvalidDateLegalAgeException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import lombok.experimental.UtilityClass;

@UtilityClass
public class DateUtil {

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    private static final int LEGAL_AGE = 18;
    private static final ZoneId zoneSaoPaulo = ZoneId.of("GMT-3");

    public static String toDateWithDefaultFormat(Date date) {
        try {
            return isNull(date) ? null : getFormattedDate(date);
        } catch (Exception exception) {
            throw new InvalidDateException(exception.getMessage());
        }
    }

    private static String getFormattedDate(Date date) {
        var format = new SimpleDateFormat(DATE_FORMAT);
        return format.format(date);
    }

    public static Date toDateAndValidateLegalAge(String date) {
        try {
            if (isEmpty(date)) throw new InvalidDateException("Date is null or empty");
            return getFormattedAndLegalAgeDate(date);
        } catch (InvalidDateLegalAgeException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new InvalidDateException(exception.getMessage());
        }
    }

    private static Date getFormattedAndLegalAgeDate(String date) throws ParseException {
        var format = new SimpleDateFormat(DATE_FORMAT);
        return returnIfLegalAge(format.parse(date));
    }

    private static Date returnIfLegalAge(Date date) {
        ZonedDateTime currentDate = ofInstant(Instant.now(), zoneSaoPaulo);
        ZonedDateTime birthDate = ofInstant(date.toInstant(), zoneSaoPaulo);
        if (birthDate.until(currentDate, YEARS) < LEGAL_AGE) throw new InvalidDateLegalAgeException();

        return date;
    }
}
