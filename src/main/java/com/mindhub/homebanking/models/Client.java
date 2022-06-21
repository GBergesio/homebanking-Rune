package com.mindhub.homebanking.models;

import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.catalina.User;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private String firstName,lastName,email, password;

    @OneToMany(mappedBy = "client",fetch = FetchType.EAGER)
    private Set<Account> accounts = new HashSet<>();

    @OneToMany (mappedBy="client",fetch = FetchType.EAGER)
    private Set<ClientLoan> clientLoans = new HashSet<>();

   @OneToMany(mappedBy = "client",fetch = FetchType.EAGER)
   private Set<Card> cards = new HashSet<>();

   private UserType userType;

    public Client() {
    }

    public Client(String firstName, String lastName, String email, String password, UserType userType) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    public long getId() {return id;}

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Account> getAccounts() {
        return this.accounts;
    }

    public void addAccount(Account account) {
        account.setAccount(this);
        this.accounts.add(account);
    }

    public String toString() {
        return "Client{id=" + this.id + ", firstName='" + this.firstName + "', lastName='" + this.lastName + "', email='" + this.email + "'}";
    }

    public void setAccounts(Set<Account> accounts) {
        this.accounts = accounts;
    }

    public Set<ClientLoan> getClientLoans() {
        return clientLoans;
    }

    public void setClientLoans(Set<ClientLoan> clientLoans) {
        this.clientLoans = clientLoans;
    }

    public void addClientLoan(ClientLoan clientLoan){
        clientLoan.setClient(this);
        clientLoans.add(clientLoan);
    }

    public List<Loan>getLoan(){
        return clientLoans.stream().map(ClientLoan::getLoan).collect(Collectors.toList());} // client -> client.getLoan()

    public Set<Card> getCards() {
        return cards;
    }

    public String getFullName(){
        return this.firstName + " " + this.lastName;
    }

    public void addCards(Card card){
        card.setClient(this);
        cards.add(card);
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCards(Set<Card> cards) {
        this.cards = cards;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
