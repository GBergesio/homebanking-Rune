package com.mindhub.homebanking.controllers;
import com.mindhub.homebanking.dtos.AccountDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.repositories.LoanRepository;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.ClientService;
import com.mindhub.homebanking.services.LoanService;
import com.mindhub.homebanking.utils.Utils.*;
import com.mindhub.homebanking.repositories.AccountRepository;
import com.mindhub.homebanking.repositories.ClientRepository;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.mindhub.homebanking.utils.Utils.getRandomNumber;
import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
public class AccountController {

    @Autowired
    private ClientController clientController;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private LoanService loanService;


    @GetMapping("/accounts")
    public List<AccountDTO> getAll() {
        return accountService.getAccountsDTO();
    }

    @GetMapping("/accounts/{id}")
    public AccountDTO getAccountDTO(@PathVariable Long id) {
        return accountService.getAccountDTO(id);
    }

    @PostMapping("/clients/current/accounts")
    public ResponseEntity<Object> createAccount(Authentication authentication, @RequestParam AccountType accountType) {
        Client client = clientService.getClientCurrent(authentication);

        if (client.getAccounts().stream().filter(account -> account.getActiveAccount() == true).collect(Collectors.toSet()).size() >= 3) {
            return new ResponseEntity<>("Forbidden, already has 3 accounts", HttpStatus.FORBIDDEN);
        }
        accountService.saveAccount(new Account("VIN-" + getRandomNumber(0, 99999999), LocalDateTime.now(), 0,accountType, client, true));
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    @GetMapping("/clients/current/accounts/{id}")
    public AccountDTO getAccountDTO(@PathVariable Long id, Authentication authentication) {
//    Client client = clientRepository.findByEmail(authentication.getName());
        Client client = clientService.getClientCurrent(authentication);
        Set<Account> accounts = client.getAccounts();
        return accounts.stream().filter(account2 -> account2.getId() == id).map(account -> new AccountDTO(account)).findFirst().orElse(null);
    }

    @GetMapping("/clients/current/accounts")
    public Set<AccountDTO> getAccountDTO(Authentication authentication) {
        Client client = clientService.getClientCurrent(authentication);
        return client.getAccounts().stream().filter(account -> account.getActiveAccount() == true).map(account -> new AccountDTO(account)).collect(Collectors.toSet());
    }

    @PostMapping("/accounts/delete")
    public ResponseEntity<String> disableAccount(Authentication authentication, @RequestParam String accountNumber) {
//        Client client = clientService.getClientCurrent(authentication);
        Client client = clientRepository.findByEmail(authentication.getName());
        Account account = accountService.getAccountNumber(accountNumber);
        Double balance = accountService.getAccountNumber(accountNumber).getBalance();


        if (!client.getAccounts().stream().filter(Account::getActiveAccount).map(Account::getNumber).collect(Collectors.toList()).contains(accountNumber)) {
            return new ResponseEntity<>("Account does not belong to authenticated client", HttpStatus.FORBIDDEN);
        }
        if(balance > 0){
            return new ResponseEntity<>("Account has a positive balance, it cannot be deleted", HttpStatus.FORBIDDEN);
        }
        if(client.getLoan().size() > 0 && client.getAccounts().stream().filter(account1 -> account1.getActiveAccount()).collect(Collectors.toSet()).size() == 1){
            return new ResponseEntity<>("The client has an active loan. Accounts cannot be deleted until they are paid in full", HttpStatus.FORBIDDEN);
        }
        if (accountService.disableAccount(account)) {
            return new ResponseEntity<>("Account dissabled successfully", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
    }

}
