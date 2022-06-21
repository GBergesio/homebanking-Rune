package com.mindhub.homebanking.dtos;

import com.mindhub.homebanking.models.*;

import javax.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ClientDTO {

    private long id;
    private String firstName;
    private String lastName;
    private String email;

    private Set<AccountDTO> accountDTO = new HashSet<>();

    private Set<ClientLoanDTO> loans = new HashSet<>();

    private Set<CardDTO> cards = new HashSet<>();

    private UserType userType;

    public ClientDTO() {};

    public ClientDTO(Client client) {
        this.id = client.getId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.email = client.getEmail();
        this.accountDTO = client.getAccounts().stream().filter(account -> account.getActiveAccount() == true).map(AccountDTO::new).collect(Collectors.toSet()); //account -> new AccountDTO(account)
        this.cards = client.getCards().stream().filter(Card::getEnabled).map(CardDTO::new).collect(Collectors.toSet());
        this.loans = client.getClientLoans().stream().map(ClientLoanDTO::new).collect(Collectors.toSet());
        this.userType = client.getUserType();
    }

    public long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Set<AccountDTO> getAccountDTO() {
        return accountDTO;
    }

    public Set<ClientLoanDTO> getLoans() {
        return loans;}

    public Set<CardDTO> getCards() {
        return cards;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
