package com.mindhub.homebanking.dtos;

import java.time.LocalDateTime;

public class PDFParamsDTO {

    private String numberAccount;

    private LocalDateTime dataSince;

    private LocalDateTime dateUntil;

    public PDFParamsDTO() {
    }

    public PDFParamsDTO(String numberAccount, LocalDateTime dataSince, LocalDateTime dateUntil) {
        this.numberAccount = numberAccount;
        this.dataSince = dataSince;
        this.dateUntil = dateUntil;
    }

    public String getNumberAccount() {
        return numberAccount;
    }

    public void setNumberAccount(String numberAccount) {
        this.numberAccount = numberAccount;
    }

    public LocalDateTime getDataSince() {
        return dataSince;
    }

    public void setDataSince(LocalDateTime dataSince) {
        this.dataSince = dataSince;
    }

    public LocalDateTime getDateUntil() {
        return dateUntil;
    }

    public void setDateUntil(LocalDateTime dateUntil) {
        this.dateUntil = dateUntil;
    }
}

