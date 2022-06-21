package com.mindhub.homebanking.controllers;
import com.mindhub.homebanking.dtos.ClientLoanDTO;
import com.mindhub.homebanking.dtos.LoanApplicationDTO;
import com.mindhub.homebanking.dtos.LoanDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.repositories.*;
import com.mindhub.homebanking.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.mindhub.homebanking.models.TransactionType.CREDIT;


@RequestMapping("/api")
@RestController
public class LoanController {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private ClientLoanRepository clientLoanRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    AccountService accountService;

//    @Autowired
    ClientService clientService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    ClientLoanService clientLoanService;

    @Autowired
    LoanService loanService;


    @Transactional
    @PostMapping("/loans")
    public ResponseEntity<Object> loans(Authentication authentication,
                                        @RequestBody LoanApplicationDTO loanApplicationDTO) {

        Client client =
//                clientService.getClientCurrent(authentication);
                clientRepository.findByEmail(authentication.getName());
        Loan loan =
                loanService.findByID(loanApplicationDTO.getLoanID());
//                loanRepository.findById(loanApplicationDTO.getLoanID()).orElse(null);
        Account destinationAccount =
                accountService.getAccountNumber(loanApplicationDTO.getAccountNumber());
//                accountRepository.findByNumber(loanApplicationDTO.getAccountNumber());

        if (loanApplicationDTO.getAmount() <= 0 || loanApplicationDTO.getPayments() <= 0) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (loanApplicationDTO.getAmount().toString().isEmpty()) {
            return new ResponseEntity<>("Missing data Amount", HttpStatus.FORBIDDEN);
        }

        if(client.getLoan().stream().filter(clientLoanDTO -> clientLoanDTO.getId() == loan.getId()).collect(Collectors.toSet()).size()>0){
            return new ResponseEntity<>("Type of loan already taken", HttpStatus.FORBIDDEN);
        }

        if (loan == null) {
            return new ResponseEntity<>("The type of loan does not exist", HttpStatus.FORBIDDEN);
        }

        if (loan.getMaxAmount() < loanApplicationDTO.getAmount()) {
            return new ResponseEntity<>("Exceeds the maximum allowed", HttpStatus.FORBIDDEN);
        }

        if (!loan.getPayments().contains(loanApplicationDTO.getPayments())) {
            return new ResponseEntity<>("Number of payments not allowed", HttpStatus.FORBIDDEN);
        }

        if (destinationAccount == null) {
            return new ResponseEntity<>("The account to which you want to deposit does not exist", HttpStatus.FORBIDDEN);
        }

        if (!client.getAccounts().contains(destinationAccount)){
            return new ResponseEntity<>("The account does not belong to the authenticated client", HttpStatus.FORBIDDEN);
        }

        // Solicitud de prestamo =
//        Double amountInterest = loanApplicationDTO.getAmount() + (loanApplicationDTO.getAmount() * 20 / 100);
        Double amountInterest = loanApplicationDTO.getAmount() * (loan.getInterest() * 0.01 + 1);
        destinationAccount.setBalance(destinationAccount.getBalance() + loanApplicationDTO.getAmount());

        Transaction transaction = new Transaction(CREDIT, loanApplicationDTO.getAmount(), loan.getName() + " loan approved", LocalDateTime.now(), destinationAccount, destinationAccount.getBalance() + loanApplicationDTO.getAmount());
        ClientLoan clientLoan = new ClientLoan(amountInterest,loanApplicationDTO.getPayments(),client,loan);
//      accountRepository.save(destinationAccount);
        accountService.saveAccount(destinationAccount);
        transactionService.saveTransaction(transaction);
//      transactionRepository.save(transaction);
//      clientLoanRepository.save(clientLoan);
        clientLoanService.saveClientLoan(clientLoan);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/loans")
    public List<LoanDTO> getAll(){
//        return loanService.getLoanDTO();
        return loanRepository.findAll().stream().map(LoanDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/clientLoans")
    public List<ClientLoanDTO> getAllClientLoans(){
        return clientLoanRepository.findAll().stream().map(ClientLoanDTO::new).collect(Collectors.toList());
    }

    @PostMapping("/loans/createLoan")
    public ResponseEntity<Object>addNewLoan(Authentication authentication,@RequestBody LoanDTO newLoanDTO){

        if (authentication.getAuthorities().contains("ADMIN")){
            return new ResponseEntity<>("Only admins can enter here",HttpStatus.FORBIDDEN);
        }
        if (loanService.getLoans().stream().map(loan -> loan.getName()).collect(Collectors.toSet()).contains(newLoanDTO.getName())){
            return new ResponseEntity<>("Loan already exists, enter another name",HttpStatus.FORBIDDEN);
        }
        if(newLoanDTO.getName().isEmpty() || newLoanDTO.getMaxAmount() <= 0 || newLoanDTO.getPayments().isEmpty() || newLoanDTO.getInterest() <= 0){
            return new ResponseEntity<>("Missing Data",HttpStatus.FORBIDDEN);
        }

        Loan loan = new Loan(newLoanDTO.getName(), newLoanDTO.getMaxAmount(), newLoanDTO.getInterest(),newLoanDTO.getPayments());
        loanService.newLoan(loan);

        return new ResponseEntity<>("Created",HttpStatus.CREATED);
    }

}