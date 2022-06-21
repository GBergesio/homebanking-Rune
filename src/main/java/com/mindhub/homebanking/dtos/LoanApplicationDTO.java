package com.mindhub.homebanking.dtos;


import com.mindhub.homebanking.models.Transaction;

public class LoanApplicationDTO {

    private long loanID;
    private Double amount;
    private int payments;
    private String accountNumber;

    public LoanApplicationDTO(){}

    public LoanApplicationDTO(ClientLoanDTO clientLoan, Transaction transaction){
        this.loanID = clientLoan.getId();
        this.amount = clientLoan.getAmount();
        this.payments = clientLoan.getPayments();
        this.accountNumber = transaction.getAccount().getNumber();
    }

    public long getLoanID() {
        return loanID;
    }

    public Double getAmount() {
        return amount;
    }

    public int getPayments() {
        return payments;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}