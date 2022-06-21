package com.mindhub.homebanking.services;
import com.mindhub.homebanking.dtos.AccountDTO;
import com.mindhub.homebanking.models.Account;
import com.mindhub.homebanking.models.Client;

import java.util.List;



public interface AccountService {

    List<AccountDTO> getAccountsDTO();

    List<Account> getAccounts();

    List<Account> getAccountByClient(Client client);

    AccountDTO getAccountDTO(Long id);

    void saveAccount(Account account);

    Account getAccountNumber(String number);

    boolean disableAccount(Account account);
}
