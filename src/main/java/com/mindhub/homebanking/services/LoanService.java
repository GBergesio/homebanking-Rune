package com.mindhub.homebanking.services;

import com.mindhub.homebanking.dtos.LoanDTO;
import com.mindhub.homebanking.models.Loan;
import com.mindhub.homebanking.repositories.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public interface LoanService {

    Loan findByID(Long number);

    List<LoanDTO> getLoanDTO();

    List<Loan> getLoans();

    void newLoan(Loan loan);


}
