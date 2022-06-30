package com.mindhub.homebanking.controllers;


import com.lowagie.text.DocumentException;
import com.mindhub.homebanking.dtos.CardPosnetDTO;
import com.mindhub.homebanking.dtos.PDFParamsDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.repositories.AccountRepository;
import com.mindhub.homebanking.repositories.ClientRepository;
import com.mindhub.homebanking.repositories.TransactionRepository;
import com.mindhub.homebanking.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CardService cardService;

    @Autowired
    private PDFService pdfService;

    @CrossOrigin
    @Transactional
    @PostMapping("/transactions")
    public ResponseEntity<Object> transaction(Authentication authentication,
                                              @RequestParam double amount, @RequestParam String description,
                                              @RequestParam String rootAccount, @RequestParam String destinationAccount, Double newBalance) {

        Account account = accountRepository.findByNumber(authentication.getName());

        if (rootAccount.isEmpty() && destinationAccount.isEmpty() && amount <= 0 && description.isEmpty()) {
            return new ResponseEntity<>("Missing Data", HttpStatus.FORBIDDEN);
        }

        if (rootAccount.isEmpty()) {
            return new ResponseEntity<>("Choose your Account", HttpStatus.FORBIDDEN);
        }

        if (destinationAccount.isEmpty()) {
            return new ResponseEntity<>("Choose destination account", HttpStatus.FORBIDDEN);
        }

        if (amount <= 0) {
            return new ResponseEntity<>("Amount less than or equal to 0", HttpStatus.FORBIDDEN);
        }
        if (description.isEmpty()) {
            return new ResponseEntity<>("Missing enter description", HttpStatus.FORBIDDEN);
        }

        if (rootAccount.equals(destinationAccount)) {
            return new ResponseEntity<>("You cannot transfer to the same account", HttpStatus.FORBIDDEN);
        }

        if (accountRepository.findByNumber(rootAccount) == null) {
            return new ResponseEntity<>("Origin account does not exist", HttpStatus.FORBIDDEN);
        }

        if (accountRepository.findByNumber(destinationAccount) == null) {
            return new ResponseEntity<>("Destination account does not exist", HttpStatus.FORBIDDEN);
        }
//        if(!client.getAccount().contains(rootAccount)) MISMA FORMA
          if(!clientService.getClientCurrent(authentication).getAccounts().stream().map(account1 -> account1.getNumber()).collect(Collectors.toSet()).contains(rootAccount)){
            return new ResponseEntity<>("Origin account is not authenticated", HttpStatus.FORBIDDEN);
        }

        if(accountRepository.findByNumber(rootAccount).getBalance() < amount){
            return new ResponseEntity<>("Your Account does not have enough balance", HttpStatus.FORBIDDEN);
        }

        Account accountDebit = accountRepository.findByNumber(rootAccount);
        Account accountCredit = accountRepository.findByNumber(destinationAccount);

        accountDebit.setBalance(accountDebit.getBalance() - amount);
        accountCredit.setBalance(accountCredit.getBalance() + amount);

        Transaction debitTransaction = new Transaction(TransactionType.DEBIT,0-amount,description + " transfer to " + accountCredit.getNumber(), LocalDateTime.now(),accountDebit, accountDebit.getBalance());
        Transaction creditTransaction = new Transaction(TransactionType.CREDIT,amount,description + " transfer from " +  accountDebit.getNumber(), LocalDateTime.now(),accountCredit, accountCredit.getBalance());



        accountService.saveAccount(accountDebit);
        accountService.saveAccount(accountCredit);
        transactionService.saveTransaction(debitTransaction);
        transactionService.saveTransaction(creditTransaction);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/transactions/posnet")
    public ResponseEntity<Object> transactionPosnet(@RequestBody CardPosnetDTO cardPosnetDTO){

        Card card = cardService.findCard(cardPosnetDTO.getCardNumber());
        Card paymentCard = null;
        String cardHolder = card.getCardHolder();
        int cvv = card.getCvv();


        Double amount = cardPosnetDTO.getAmount();
        LocalDateTime thruDate = card.getThruDate();
        LocalDateTime today = LocalDateTime.now();
        Client client = card.getClient();

        List<Account> accounts = client.getAccounts().stream().filter(account -> account.getBalance() >= amount && account.getActiveAccount()).collect(Collectors.toList());

        // hacer un if que verifique primero si existe la cuenta - .Exist() true or False
        if(accounts.stream().findFirst().orElse(null).getBalance() < cardPosnetDTO.getAmount()){
            return new ResponseEntity<>("This Account does not have enough balance", HttpStatus.FORBIDDEN);
        }

        // hacer un if que verifique primero si existe la cuenta - .Exist() true or False

        if(cardPosnetDTO.getCardNumber().toString().isEmpty()){
            return new ResponseEntity<>("empty card number field", HttpStatus.FORBIDDEN);
        }
        if(cardPosnetDTO.getAmount() <= 0){
            return new ResponseEntity<>("You cannot send a negative amount", HttpStatus.FORBIDDEN);
        }
        if(cardPosnetDTO.getCvv() != cvv){
            return new ResponseEntity<>("Invalid CVV", HttpStatus.FORBIDDEN);
        }
        if(cardPosnetDTO.getDescription().isEmpty()){
            return new ResponseEntity<>("Empty description", HttpStatus.FORBIDDEN);
        }
        if(thruDate.getYear() < today.getYear() || thruDate.getYear() <= today.getYear() && thruDate.getMonthValue() < today.getMonthValue()){
            return new ResponseEntity<>("The card is expired", HttpStatus.FORBIDDEN);
        }
        if(thruDate.getYear() != card.getThruDate().getYear()){
            return new ResponseEntity<>("Invalid year", HttpStatus.FORBIDDEN);
        }

        accounts.get(0).setBalance(accounts.get(0).getBalance() - cardPosnetDTO.getAmount());
        accountService.saveAccount(accounts.get(0));

        Transaction transaction = new Transaction(TransactionType.DEBIT,cardPosnetDTO.getAmount(),cardPosnetDTO.getDescription(),LocalDateTime.now(),accounts.get(0),accounts.get(0).getBalance());
        transactionService.saveTransaction(transaction);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/transactions/pdfResume")
    public void generatePDF(HttpServletResponse response, Authentication authentication,@RequestBody PDFParamsDTO pdfParamsDTO) throws IOException, DocumentException {
        response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd:hh::mm");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-disposition";
        String headerValue = "attachment; filename=Rune_Bank_" + currentDateTime + ".pdf";
        response.setHeader(headerKey,headerValue);
        pdfService.PDFGenerator(response,authentication,pdfParamsDTO);
    }
}